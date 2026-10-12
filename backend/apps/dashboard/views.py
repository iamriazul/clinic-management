from datetime import date, timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.doctors.models import Doctor
from apps.patients.models import Patient
from apps.appointments.models import Appointment


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Return role-specific dashboard statistics."""
    user = request.user
    today = date.today()

    if user.is_admin or user.is_superuser:
        return Response({
            'role': 'admin',
            'total_doctors': Doctor.objects.count(),
            'total_patients': Patient.objects.count(),
            'todays_appointments': Appointment.objects.filter(
                appointment_date=today
            ).exclude(status='cancelled').count(),
            'pending_appointments': Appointment.objects.filter(
                status='pending'
            ).count(),
            'confirmed_appointments': Appointment.objects.filter(
                status='confirmed'
            ).count(),
            'completed_appointments': Appointment.objects.filter(
                status='completed'
            ).count(),
            'cancelled_appointments': Appointment.objects.filter(
                status='cancelled'
            ).count(),
            'recent_appointments': _get_recent_appointments(),
        })

    elif user.is_doctor:
        try:
            doctor = Doctor.objects.get(user=user)
        except Doctor.DoesNotExist:
            return Response({
                'role': 'doctor',
                'error': 'No doctor profile linked to this account.',
                'todays_appointments': 0,
                'upcoming_appointments': 0,
                'total_patients': 0,
            })

        return Response({
            'role': 'doctor',
            'todays_appointments': Appointment.objects.filter(
                doctor=doctor, appointment_date=today
            ).exclude(status='cancelled').count(),
            'upcoming_appointments': Appointment.objects.filter(
                doctor=doctor,
                appointment_date__gte=today,
                status__in=['pending', 'confirmed']
            ).count(),
            'total_patients': Appointment.objects.filter(
                doctor=doctor
            ).values('patient').distinct().count(),
            'completed_appointments': Appointment.objects.filter(
                doctor=doctor, status='completed'
            ).count(),
        })

    elif user.is_receptionist:
        return Response({
            'role': 'receptionist',
            'todays_appointments': Appointment.objects.filter(
                appointment_date=today
            ).exclude(status='cancelled').count(),
            'pending_appointments': Appointment.objects.filter(
                status='pending'
            ).count(),
            'total_patients': Patient.objects.count(),
            'total_doctors': Doctor.objects.count(),
            'recent_appointments': _get_recent_appointments(),
        })

    elif user.is_patient:
        try:
            patient = Patient.objects.get(user=user)
        except Patient.DoesNotExist:
            return Response({
                'role': 'patient',
                'error': 'No patient profile found.',
                'upcoming_appointments': 0,
                'completed_appointments': 0,
                'cancelled_appointments': 0,
            })

        return Response({
            'role': 'patient',
            'upcoming_appointments': Appointment.objects.filter(
                patient=patient,
                appointment_date__gte=today,
                status__in=['pending', 'confirmed']
            ).count(),
            'completed_appointments': Appointment.objects.filter(
                patient=patient, status='completed'
            ).count(),
            'cancelled_appointments': Appointment.objects.filter(
                patient=patient, status='cancelled'
            ).count(),
            'total_appointments': Appointment.objects.filter(
                patient=patient
            ).count(),
        })

    return Response({'role': 'unknown', 'message': 'Unknown role.'})


def _get_recent_appointments(limit=5):
    """Helper to get recent appointments for admin/receptionist dashboards."""
    from apps.appointments.serializers import AppointmentListSerializer
    appointments = Appointment.objects.select_related(
        'doctor', 'patient'
    ).order_by('-created_at')[:limit]
    return AppointmentListSerializer(appointments, many=True).data
