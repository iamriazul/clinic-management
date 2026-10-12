from django.contrib import admin
from .models import Doctor


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('name', 'specialization', 'phone', 'consultation_fee', 'is_available')
    list_filter = ('specialization', 'is_available')
    search_fields = ('name', 'specialization')
