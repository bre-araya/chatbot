from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import SignupSerializer


# -------------------------
# Function-based Register
# -------------------------
@api_view(['POST'])
def register(request):
    data = request.data
    if User.objects.filter(username=data.get('username')).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(
        username=data.get('username'),
        email=data.get('email'),
        password=data.get('password')
    )
    return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)


# -------------------------
# Function-based Login
# -------------------------
@api_view(['POST'])
def login(request):
    user = authenticate(
        username=request.data.get('username'),
        password=request.data.get('password')
    )
    if user:
        return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
    return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


# -------------------------
# Class-based Signup using Serializer
# -------------------------
class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Signup successful'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
