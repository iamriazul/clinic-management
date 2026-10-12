from django.urls import path
from . import views

urlpatterns = [
    path('', views.doctor_list_create, name='doctor-list-create'),
    path('<int:pk>/', views.doctor_detail, name='doctor-detail'),
]
