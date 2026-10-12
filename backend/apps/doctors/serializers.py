from rest_framework import serializers
from .models import Doctor


class DoctorSerializer(serializers.ModelSerializer):
    """Full doctor serializer for CRUD operations."""

    class Meta:
        model = Doctor
        fields = [
            'id', 'user', 'name', 'specialization', 'phone',
            'email', 'consultation_fee', 'is_available',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class DoctorListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing doctors (public)."""

    class Meta:
        model = Doctor
        fields = ['id', 'name', 'specialization', 'consultation_fee', 'is_available']
