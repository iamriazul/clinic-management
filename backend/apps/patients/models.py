import uuid
from django.db import models
from django.conf import settings


class Patient(models.Model):
    """Patient profile with unique patient ID."""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='patient_profile'
    )
    patient_id = models.CharField(max_length=20, unique=True, editable=False)
    name = models.CharField(max_length=200)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=10,
        choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')],
        blank=True,
        default=''
    )
    phone = models.CharField(max_length=20, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    address = models.TextField(blank=True, default='')
    blood_group = models.CharField(max_length=5, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'patients'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.patient_id} - {self.name}"

    def save(self, *args, **kwargs):
        if not self.patient_id:
            self.patient_id = self._generate_patient_id()
        super().save(*args, **kwargs)

    @staticmethod
    def _generate_patient_id():
        """Generate a unique patient ID like PAT-XXXX."""
        last = Patient.objects.order_by('-id').first()
        next_num = (last.id + 1) if last else 1
        return f"PAT-{next_num:04d}"
