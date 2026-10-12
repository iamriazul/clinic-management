"""
URL configuration for clinic_management project.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/doctors/', include('apps.doctors.urls')),
    path('api/v1/patients/', include('apps.patients.urls')),
    path('api/v1/appointments/', include('apps.appointments.urls')),
    path('api/v1/dashboard/', include('apps.dashboard.urls')),
]
