from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Patient
from .serializers import PatientSerializer, PatientListSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def patient_list_create(request):
    """
    GET: List patients (admin/receptionist/doctor), or own profile (patient).
    POST: Register a new patient (admin/receptionist).
    """
    if request.method == 'GET':
        user = request.user
        if user.is_admin or user.is_receptionist:
            patients = Patient.objects.all()
        elif user.is_doctor:
            # Doctors see patients who have appointments with them
            from apps.appointments.models import Appointment
            patient_ids = Appointment.objects.filter(
                doctor__user=user
            ).values_list('patient_id', flat=True).distinct()
            patients = Patient.objects.filter(id__in=patient_ids)
        elif user.is_patient:
            patients = Patient.objects.filter(user=user)
        else:
            patients = Patient.objects.none()

        # Search
        search = request.query_params.get('search', '')
        if search:
            patients = patients.filter(
                Q(name__icontains=search) |
                Q(patient_id__icontains=search) |
                Q(phone__icontains=search)
            )

        serializer = PatientListSerializer(patients, many=True)
        return Response(serializer.data)

    # POST: Admin and Receptionist only
    if not (request.user.is_admin or request.user.is_receptionist):
        return Response(
            {'detail': 'Only admin and receptionist can register patients.'},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = PatientSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def patient_detail(request, pk):
    """
    GET: View patient details.
    PATCH: Update patient details.
    """
    try:
        patient = Patient.objects.get(pk=pk)
    except Patient.DoesNotExist:
        return Response({'detail': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Permission check: patient can only see their own profile
    user = request.user
    if user.is_patient and (not patient.user or patient.user != user):
        return Response({'detail': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = PatientSerializer(patient)
        return Response(serializer.data)

    if request.method == 'PATCH':
        if not (user.is_admin or user.is_receptionist or (user.is_patient and patient.user == user)):
            return Response({'detail': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = PatientSerializer(patient, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
