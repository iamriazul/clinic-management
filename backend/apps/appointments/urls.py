from django.urls import path
from . import views

urlpatterns = [
    path('', views.appointment_list_create, name='appointment-list-create'),
    path('slots/', views.available_slots, name='available-slots'),
    path('<int:pk>/', views.appointment_detail, name='appointment-detail'),
]
