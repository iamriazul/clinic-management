from django.contrib import admin
from .models import Patient


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('patient_id', 'name', 'phone', 'gender', 'created_at')
    list_filter = ('gender',)
    search_fields = ('patient_id', 'name', 'phone')
    readonly_fields = ('patient_id',)
