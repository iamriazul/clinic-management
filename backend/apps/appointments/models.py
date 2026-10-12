from django.db import models
from apps.doctors.models import Doctor
from apps.patients.models import Patient


class Appointment(models.Model):
    """Appointment linking a patient to a doctor at a specific date/time."""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    patient = models.ForeignKey(
        Patient, on_delete=models.CASCADE, related_name='appointments'
    )
    doctor = models.ForeignKey(
        Doctor, on_delete=models.CASCADE, related_name='appointments'
    )
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    reason = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'appointments'
        ordering = ['-appointment_date', '-appointment_time']
        # Prevent double booking: same doctor, date, and time
        unique_together = ('doctor', 'appointment_date', 'appointment_time')

    def __str__(self):
        return (
            f"Appointment: {self.patient.name} with Dr. {self.doctor.name} "
            f"on {self.appointment_date} at {self.appointment_time}"
        )
