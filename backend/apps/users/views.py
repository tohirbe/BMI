from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from .models import User
from .serializers import (
    LoginSerializer,
    UserSerializer,
    UserCreateSerializer,
    UserUpdateSerializer,
)


def success(data=None, message="", status_code=status.HTTP_200_OK):
    return Response({"success": True, "data": data, "message": message}, status=status_code)


def error(message="", details=None, status_code=status.HTTP_400_BAD_REQUEST):
    return Response({"success": False, "error": message, "details": details}, status=status_code)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return error("Login xatosi", serializer.errors)

        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)

        data = {
            "access":  str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id":        user.id,
                "email":     user.email,
                "role":      user.role,
                "full_name": user.full_name,
            },
        }
        return success(data, "Muvaffaqiyatli kirish")


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return success(serializer.data)

    def patch(self, request):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if not serializer.is_valid():
            return error("Yangilash xatosi", serializer.errors)
        serializer.save()
        return success(UserSerializer(request.user).data, "Profil yangilandi")


class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return UserCreateSerializer
        return UserSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role in ("rector", "dean", "head", "vice_head"):
            return User.objects.all()
        return User.objects.filter(pk=user.pk)

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error("Yaratish xatosi", serializer.errors)
        user = serializer.save()
        return success(UserSerializer(user).data, "Foydalanuvchi yaratildi", status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        role = request.query_params.get("role")
        search = request.query_params.get("search")
        if role:
            qs = qs.filter(role=role)
        if search:
            qs = qs.filter(first_name__icontains=search) | qs.filter(last_name__icontains=search) | qs.filter(email__icontains=search)
        page = self.paginate_queryset(qs)
        serializer = UserSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return UserUpdateSerializer
        return UserSerializer

    def get_permissions(self):
        if self.request.method == "DELETE":
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not (request.user.is_superuser or
                request.user.role in ("rector", "dean", "head", "vice_head") or
                request.user.pk == instance.pk):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        return success(UserSerializer(instance).data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            return error("Yangilash xatosi", serializer.errors)
        serializer.save()
        return success(UserSerializer(instance).data, "Yangilandi")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return success(message="O'chirildi")