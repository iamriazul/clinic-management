from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import login, logout
from django.middleware.csrf import get_token

from .serializers import RegisterSerializer, LoginSerializer, UserSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Register a new patient account."""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        login(request, user)
        return Response({
            'message': 'Registration successful.',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Log in with username and password."""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        return Response({
            'message': 'Login successful.',
            'user': UserSerializer(user).data,
            'csrfToken': get_token(request),
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Log out the current user."""
    logout(request)
    return Response({'message': 'Logged out successfully.'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    """Get the current authenticated user's profile."""
    return Response(UserSerializer(request.user).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def csrf_view(request):
    """Return a CSRF token for the frontend."""
    return Response({'csrfToken': get_token(request)})
