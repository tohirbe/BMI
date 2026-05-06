from django.contrib.auth import authenticate
from rest_framework import serializers


from .models import User


class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(email=attrs["email"], password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Email yoki parol noto'g'ri")
        if not user.is_active:
            raise serializers.ValidationError("Foydalanuvchi bloklangan")
        attrs["user"] = user
        return attrs


class StudentProfileSerializer(serializers.ModelSerializer):
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)

    class Meta:
        model  = None  # apps ready bo'lganda set qilinadi
        fields = ("student_id", "date_of_birth", "group")


class TeacherProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = None
        fields = ("position", "department")


def _get_student_profile_serializer():
    from apps.university.models import StudentProfile

    class _S(serializers.ModelSerializer):
        class Meta:
            model  = StudentProfile
            fields = ("student_id", "date_of_birth", "group")
    return _S


def _get_teacher_profile_serializer():
    from apps.university.models import TeacherProfile

    class _S(serializers.ModelSerializer):
        class Meta:
            model  = TeacherProfile
            fields = ("position", "department")
    return _S


class UserSerializer(serializers.ModelSerializer):
    full_name       = serializers.CharField(read_only=True)
    student_profile = serializers.SerializerMethodField()
    teacher_profile = serializers.SerializerMethodField()

    class Meta:
        model  = User
        fields = (
            "id", "email", "first_name", "last_name", "middle_name",
            "role", "phone", "avatar", "is_active",
            "full_name", "student_profile", "teacher_profile",
            "created_at", "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def get_student_profile(self, obj):
        try:
            S = _get_student_profile_serializer()
            return S(obj.student_profile).data
        except Exception:
            return None

    def get_teacher_profile(self, obj):
        try:
            T = _get_teacher_profile_serializer()
            return T(obj.teacher_profile).data
        except Exception:
            return None


class UserCreateSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = (
            "email", "first_name", "last_name", "middle_name",
            "role", "phone", "password", "password2",
        )

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password2"):
            raise serializers.ValidationError({"password2": "Parollar mos kelmadi"})
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ("first_name", "last_name", "middle_name", "phone", "avatar")