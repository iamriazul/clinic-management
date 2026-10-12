from django.urls import path
from . import views

urlpatterns = [
    path('', views.patient_list_create, name='patient-list-create'),
    path('<int:pk>/', views.patient_detail, name='patient-detail'),
]
