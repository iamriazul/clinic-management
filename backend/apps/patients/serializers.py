from rest_framework import serializers
from .models import Patient


class PatientSerializer(serializers.ModelSerializer):
    """Full patient serializer."""

    class Meta:
        model = Patient
        fields = [
            'id', 'user', 'patient_id', 'name', 'date_of_birth', 'gender',
            'phone', 'email', 'address', 'blood_group',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'patient_id', 'created_at', 'updated_at']


class PatientListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for patient lists."""

    class Meta:
        model = Patient
        fields = ['id', 'patient_id', 'name', 'phone', 'gender', 'created_at']
