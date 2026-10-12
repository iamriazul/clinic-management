from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Doctor
from .serializers import DoctorSerializer, DoctorListSerializer


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def doctor_list_create(request):
    """
    GET: List all available doctors (public).
    POST: Create a new doctor (admin only).
    """
    if request.method == 'GET':
        doctors = Doctor.objects.all()
        # Public endpoint: only show available doctors if not staff
        if not request.user.is_authenticated or request.user.role == 'patient':
            doctors = doctors.filter(is_available=True)
        serializer = DoctorListSerializer(doctors, many=True)
        return Response(serializer.data)

    # POST: Admin only
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
    if not (request.user.is_admin or request.user.is_superuser):
        return Response({'detail': 'Admin access required.'}, status=status.HTTP_403_FORBIDDEN)

    serializer = DoctorSerializer(data=request.data)
    if serializer.is_valid():
        doctor = serializer.save()
        # If a user account is linked, set their role to doctor
        if doctor.user:
            doctor.user.role = 'doctor'
            doctor.user.save()
        return Response(DoctorSerializer(doctor).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def doctor_detail(request, pk):
    """
    GET: View doctor details (public).
    PUT: Update doctor (admin only).
    DELETE: Delete doctor (admin only).
    """
    try:
        doctor = Doctor.objects.get(pk=pk)
    except Doctor.DoesNotExist:
        return Response({'detail': 'Doctor not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = DoctorSerializer(doctor)
        return Response(serializer.data)

    # PUT and DELETE: Admin only
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
    if not (request.user.is_admin or request.user.is_superuser):
        return Response({'detail': 'Admin access required.'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        serializer = DoctorSerializer(doctor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        doctor.delete()
        return Response({'message': 'Doctor deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
