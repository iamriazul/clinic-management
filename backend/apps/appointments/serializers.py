from rest_framework import serializers
from .models import Appointment
from apps.doctors.serializers import DoctorListSerializer
from apps.patients.serializers import PatientListSerializer


class AppointmentSerializer(serializers.ModelSerializer):
    """Full appointment serializer for create/update."""
    doctor_info = DoctorListSerializer(source='doctor', read_only=True)
    patient_info = PatientListSerializer(source='patient', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'doctor', 'doctor_info', 'patient_info',
            'appointment_date', 'appointment_time', 'reason',
            'status', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, data):
        """Validate no double booking for the same doctor and time."""
        doctor = data.get('doctor', getattr(self.instance, 'doctor', None))
        date = data.get('appointment_date', getattr(self.instance, 'appointment_date', None))
        time = data.get('appointment_time', getattr(self.instance, 'appointment_time', None))

        if doctor and date and time:
            conflict = Appointment.objects.filter(
                doctor=doctor,
                appointment_date=date,
                appointment_time=time,
            ).exclude(
                status='cancelled'
            )
            if self.instance:
                conflict = conflict.exclude(pk=self.instance.pk)
            if conflict.exists():
                raise serializers.ValidationError(
                    'This doctor already has an appointment at the selected date and time.'
                )
        return data


class AppointmentListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for appointment lists."""
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)
    doctor_specialization = serializers.CharField(source='doctor.specialization', read_only=True)
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    patient_id_display = serializers.CharField(source='patient.patient_id', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'doctor', 'patient', 'doctor_name', 'doctor_specialization',
            'patient_name', 'patient_id_display',
            'appointment_date', 'appointment_time',
            'reason', 'status', 'created_at'
        ]
