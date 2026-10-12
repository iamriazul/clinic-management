from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model with role support."""
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('doctor', 'Doctor'),
        ('receptionist', 'Receptionist'),
        ('patient', 'Patient'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')
    phone = models.CharField(max_length=20, blank=True, default='')

    class Meta:
        db_table = 'users'

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

    @property
    def is_admin(self):
        return self.role == 'admin' or self.is_superuser

    @property
    def is_doctor(self):
        return self.role == 'doctor'

    @property
    def is_receptionist(self):
        return self.role == 'receptionist'

    @property
    def is_patient(self):
        return self.role == 'patient'
