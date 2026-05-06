from rest_framework import serializers
from .models import Faculty, Department, AcademicYear, Group, StudentProfile, TeacherProfile
from apps.users.models import User


class FacultySerializer(serializers.ModelSerializer):
    dean_name = serializers.CharField(source="dean.full_name", read_only=True, default=None)

    class Meta:
        model  = Faculty
        fields = ("id", "name", "short_name", "dean", "dean_name")


class DepartmentSerializer(serializers.ModelSerializer):
    faculty_name   = serializers.CharField(source="faculty.name",          read_only=True)
    head_name      = serializers.CharField(source="head.full_name",        read_only=True, default=None)
    vice_head_name = serializers.CharField(source="vice_head.full_name",   read_only=True, default=None)

    class Meta:
        model  = Department
        fields = (
            "id", "name", "short_name",
            "faculty", "faculty_name",
            "head", "head_name",
            "vice_head", "vice_head_name",
        )


class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model  = AcademicYear
        fields = ("id", "name", "start_date", "end_date", "is_current")


class GroupSerializer(serializers.ModelSerializer):
    department_name    = serializers.CharField(source="department.name",       read_only=True)
    academic_year_name = serializers.CharField(source="academic_year.name",    read_only=True)
    student_count      = serializers.SerializerMethodField()

    class Meta:
        model  = Group
        fields = (
            "id", "name",
            "department", "department_name",
            "academic_year", "academic_year_name",
            "semester", "course",
            "student_count",
        )

    def get_student_count(self, obj):
        return obj.students.count()


class StudentProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="user.full_name", read_only=True)
    email     = serializers.EmailField(source="user.email",    read_only=True)
    group_name = serializers.CharField(source="group.name",    read_only=True, default=None)

    class Meta:
        model  = StudentProfile
        fields = (
            "id", "user", "full_name", "email",
            "student_id", "date_of_birth",
            "group", "group_name",
        )


class StudentProfileWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = StudentProfile
        fields = ("user", "student_id", "date_of_birth", "group")

    def validate_user(self, value):
        if value.role != User.Role.STUDENT:
            raise serializers.ValidationError("Foydalanuvchi roli 'student' bo'lishi kerak")
        return value


class TeacherProfileSerializer(serializers.ModelSerializer):
    full_name       = serializers.CharField(source="user.full_name",      read_only=True)
    email           = serializers.EmailField(source="user.email",         read_only=True)
    department_name = serializers.CharField(source="department.name",     read_only=True, default=None)

    class Meta:
        model  = TeacherProfile
        fields = (
            "id", "user", "full_name", "email",
            "department", "department_name",
            "position",
        )


class TeacherProfileWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = TeacherProfile
        fields = ("user", "department", "position")

    def validate_user(self, value):
        if value.role != User.Role.TEACHER:
            raise serializers.ValidationError("Foydalanuvchi roli 'teacher' bo'lishi kerak")
        return value