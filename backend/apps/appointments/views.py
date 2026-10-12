from django.db import models
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from datetime import date

from .models import Appointment
from .serializers import AppointmentSerializer, AppointmentListSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def appointment_list_create(request):
    """
    GET: List appointments based on user role.
    POST: Book a new appointment.
    """
    if request.method == 'GET':
        user = request.user
        appointments = Appointment.objects.select_related('doctor', 'patient')

        if user.is_admin or user.is_receptionist:
            pass  # See all appointments
        elif user.is_doctor:
            appointments = appointments.filter(doctor__user=user)
        elif user.is_patient:
            appointments = appointments.filter(patient__user=user)
        else:
            appointments = Appointment.objects.none()

        # Filters
        status_filter = request.query_params.get('status', '')
        if status_filter:
            appointments = appointments.filter(status=status_filter)

        date_filter = request.query_params.get('date', '')
        if date_filter:
            appointments = appointments.filter(appointment_date=date_filter)

        doctor_filter = request.query_params.get('doctor', '')
        if doctor_filter:
            appointments = appointments.filter(doctor_id=doctor_filter)

        serializer = AppointmentListSerializer(appointments, many=True)
        return Response(serializer.data)

    # POST: Book appointment
    user = request.user
    if not (user.is_admin or user.is_receptionist or user.is_patient):
        return Response(
            {'detail': 'You do not have permission to book appointments.'},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = AppointmentSerializer(data=request.data)
    if serializer.is_valid():
        appointment = serializer.save()
        return Response(
            AppointmentSerializer(appointment).data,
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def appointment_detail(request, pk):
    """
    GET: View appointment details.
    PATCH: Update appointment status or details.
    DELETE: Cancel an appointment (soft-cancel via status change).
    """
    try:
        appointment = Appointment.objects.select_related('doctor', 'patient').get(pk=pk)
    except Appointment.DoesNotExist:
        return Response({'detail': 'Appointment not found.'}, status=status.HTTP_404_NOT_FOUND)

    user = request.user

    # Permission check for viewing
    if user.is_patient:
        if not appointment.patient.user or appointment.patient.user != user:
            return Response({'detail': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)
    elif user.is_doctor:
        if not appointment.doctor.user or appointment.doctor.user != user:
            return Response({'detail': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data)

    if request.method == 'PATCH':
        # Patients can only cancel their own pending appointments
        if user.is_patient:
            new_status = request.data.get('status')
            if new_status != 'cancelled' or appointment.status != 'pending':
                return Response(
                    {'detail': 'You can only cancel your pending appointments.'},
                    status=status.HTTP_403_FORBIDDEN
                )
            appointment.status = 'cancelled'
            appointment.save()
            return Response(AppointmentSerializer(appointment).data)

        # Doctors can mark as completed
        if user.is_doctor:
            allowed_fields = {'status', 'notes'}
            if not set(request.data.keys()).issubset(allowed_fields):
                return Response(
                    {'detail': 'You can only update status and notes.'},
                    status=status.HTTP_403_FORBIDDEN
                )

        serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        if not (user.is_admin or user.is_receptionist):
            return Response({'detail': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)
        # Soft delete: set status to cancelled
        appointment.status = 'cancelled'
        appointment.save()
        return Response({'message': 'Appointment cancelled successfully.'})


@api_view(['GET'])
@permission_classes([AllowAny])
def available_slots(request):
    """Get booked time slots for a specific doctor and date."""
    doctor_id = request.query_params.get('doctor')
    date_param = request.query_params.get('date')

    if not doctor_id or not date_param:
        return Response({'detail': 'Doctor and date are required.'}, status=status.HTTP_400_BAD_REQUEST)

    booked = Appointment.objects.filter(
        doctor_id=doctor_id,
        appointment_date=date_param,
    ).exclude(status='cancelled').values_list('appointment_time', flat=True)

    booked_times = [t.strftime('%H:%M') for t in booked]
    return Response({'booked_slots': booked_times})
