from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from .models import Faculty, Department, AcademicYear, Group, StudentProfile, TeacherProfile
from .serializers import (
    FacultySerializer,
    DepartmentSerializer,
    AcademicYearSerializer,
    GroupSerializer,
    StudentProfileSerializer, StudentProfileWriteSerializer,
    TeacherProfileSerializer, TeacherProfileWriteSerializer,
)
from apps.rbac.permissions import IsManagement, IsAdminOrRector


def success(data=None, message="", status_code=status.HTTP_200_OK):
    return Response({"success": True, "data": data, "message": message}, status=status_code)


def error(message="", details=None, status_code=status.HTTP_400_BAD_REQUEST):
    return Response({"success": False, "error": message, "details": details}, status=status_code)


# ── Faculty ──────────────────────────────────────────────────────────────────

class FacultyListCreateView(ListCreateAPIView):
    queryset           = Faculty.objects.all()
    serializer_class   = FacultySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role in ("rector",):
            return Faculty.objects.all()
        if user.role == "dean":
            return Faculty.objects.filter(dean=user)
        return Faculty.objects.all()

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return success(serializer.data)

    def create(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role == "rector"):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        serializer.save()
        return success(serializer.data, "Fakultet yaratildi", status.HTTP_201_CREATED)


class FacultyDetailView(RetrieveUpdateDestroyAPIView):
    queryset           = Faculty.objects.all()
    serializer_class   = FacultySerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        return success(self.get_serializer(self.get_object()).data)

    def update(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role == "rector"):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        partial    = kwargs.pop("partial", False)
        serializer = self.get_serializer(self.get_object(), data=request.data, partial=partial)
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        serializer.save()
        return success(serializer.data, "Yangilandi")

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        self.get_object().delete()
        return success(message="O'chirildi")


# ── Department ───────────────────────────────────────────────────────────────

class DepartmentListCreateView(ListCreateAPIView):
    serializer_class   = DepartmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs   = Department.objects.select_related("faculty", "head", "vice_head")
        if user.is_superuser or user.role == "rector":
            return qs
        if user.role == "dean":
            try:
                return qs.filter(faculty=user.dean_of_faculty)
            except Exception:
                return qs.none()
        if user.role in ("head", "vice_head"):
            try:
                dept = user.head_of_department if user.role == "head" else user.vice_head_of_department
                return qs.filter(pk=dept.pk)
            except Exception:
                return qs.none()
        faculty_id = self.request.query_params.get("faculty")
        if faculty_id:
            return qs.filter(faculty_id=faculty_id)
        return qs

    def list(self, request, *args, **kwargs):
        return success(self.get_serializer(self.get_queryset(), many=True).data)

    def create(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role in ("rector", "dean")):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        serializer.save()
        return success(serializer.data, "Kafedra yaratildi", status.HTTP_201_CREATED)


class DepartmentDetailView(RetrieveUpdateDestroyAPIView):
    queryset           = Department.objects.all()
    serializer_class   = DepartmentSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        return success(self.get_serializer(self.get_object()).data)

    def update(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role in ("rector", "dean")):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        partial    = kwargs.pop("partial", False)
        serializer = self.get_serializer(self.get_object(), data=request.data, partial=partial)
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        serializer.save()
        return success(serializer.data, "Yangilandi")

    def destroy(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role == "rector"):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        self.get_object().delete()
        return success(message="O'chirildi")


# ── AcademicYear ─────────────────────────────────────────────────────────────

class AcademicYearListCreateView(ListCreateAPIView):
    queryset           = AcademicYear.objects.all()
    serializer_class   = AcademicYearSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        return success(self.get_serializer(self.get_queryset(), many=True).data)

    def create(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role == "rector"):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        serializer.save()
        return success(serializer.data, "O'quv yili yaratildi", status.HTTP_201_CREATED)


class AcademicYearDetailView(RetrieveUpdateDestroyAPIView):
    queryset           = AcademicYear.objects.all()
    serializer_class   = AcademicYearSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        return success(self.get_serializer(self.get_object()).data)

    def update(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role == "rector"):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        partial    = kwargs.pop("partial", False)
        serializer = self.get_serializer(self.get_object(), data=request.data, partial=partial)
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        serializer.save()
        return success(serializer.data, "Yangilandi")

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        self.get_object().delete()
        return success(message="O'chirildi")


# ── Group ────────────────────────────────────────────────────────────────────

class GroupListCreateView(ListCreateAPIView):
    serializer_class   = GroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs   = Group.objects.select_related("department", "academic_year")
        if user.is_superuser or user.role == "rector":
            return qs
        if user.role == "dean":
            try:
                return qs.filter(department__faculty=user.dean_of_faculty)
            except Exception:
                return qs.none()
        if user.role in ("head", "vice_head"):
            try:
                dept = user.head_of_department if user.role == "head" else user.vice_head_of_department
                return qs.filter(department=dept)
            except Exception:
                return qs.none()
        if user.role == "teacher":
            return qs.filter(subjects__teacher=user).distinct()
        if user.role == "student":
            try:
                return qs.filter(pk=user.student_profile.group.pk)
            except Exception:
                return qs.none()
        dept_id  = self.request.query_params.get("department")
        year_id  = self.request.query_params.get("academic_year")
        if dept_id:
            qs = qs.filter(department_id=dept_id)
        if year_id:
            qs = qs.filter(academic_year_id=year_id)
        return qs

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        dept_id = request.query_params.get("department")
        year_id = request.query_params.get("academic_year")
        if dept_id:
            qs = qs.filter(department_id=dept_id)
        if year_id:
            qs = qs.filter(academic_year_id=year_id)
        return success(self.get_serializer(qs, many=True).data)

    def create(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role in ("rector", "dean", "head")):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        serializer.save()
        return success(serializer.data, "Guruh yaratildi", status.HTTP_201_CREATED)


class GroupDetailView(RetrieveUpdateDestroyAPIView):
    queryset           = Group.objects.all()
    serializer_class   = GroupSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        return success(self.get_serializer(self.get_object()).data)

    def update(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role in ("rector", "dean", "head")):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        partial    = kwargs.pop("partial", False)
        serializer = self.get_serializer(self.get_object(), data=request.data, partial=partial)
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        serializer.save()
        return success(serializer.data, "Yangilandi")

    def destroy(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role in ("rector", "dean")):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        self.get_object().delete()
        return success(message="O'chirildi")


# ── StudentProfile ────────────────────────────────────────────────────────────

class StudentProfileListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        return StudentProfileWriteSerializer if self.request.method == "POST" else StudentProfileSerializer

    def get_queryset(self):
        user = self.request.user
        qs   = StudentProfile.objects.select_related("user", "group")
        if user.is_superuser or user.role == "rector":
            return qs
        if user.role == "dean":
            try:
                return qs.filter(group__department__faculty=user.dean_of_faculty)
            except Exception:
                return qs.none()
        if user.role in ("head", "vice_head"):
            try:
                dept = user.head_of_department if user.role == "head" else user.vice_head_of_department
                return qs.filter(group__department=dept)
            except Exception:
                return qs.none()
        if user.role == "teacher":
            return qs.filter(group__subjects__teacher=user).distinct()
        if user.role == "student":
            return qs.filter(user=user)
        return qs.none()

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        group_id = request.query_params.get("group")
        if group_id:
            qs = qs.filter(group_id=group_id)
        return success(StudentProfileSerializer(qs, many=True).data)

    def create(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role in ("rector", "dean", "head")):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        serializer = StudentProfileWriteSerializer(data=request.data)
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        profile = serializer.save()
        return success(StudentProfileSerializer(profile).data, "Talaba profili yaratildi", status.HTTP_201_CREATED)


class StudentProfileDetailView(RetrieveUpdateDestroyAPIView):
    queryset           = StudentProfile.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        return StudentProfileWriteSerializer if self.request.method in ("PUT", "PATCH") else StudentProfileSerializer

    def retrieve(self, request, *args, **kwargs):
        return success(StudentProfileSerializer(self.get_object()).data)

    def update(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role in ("rector", "dean", "head")):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        partial    = kwargs.pop("partial", False)
        serializer = StudentProfileWriteSerializer(self.get_object(), data=request.data, partial=partial)
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        profile = serializer.save()
        return success(StudentProfileSerializer(profile).data, "Yangilandi")

    def destroy(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role == "rector"):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        self.get_object().delete()
        return success(message="O'chirildi")


# ── TeacherProfile ────────────────────────────────────────────────────────────

class TeacherProfileListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        return TeacherProfileWriteSerializer if self.request.method == "POST" else TeacherProfileSerializer

    def get_queryset(self):
        user = self.request.user
        qs   = TeacherProfile.objects.select_related("user", "department")
        if user.is_superuser or user.role == "rector":
            return qs
        if user.role == "dean":
            try:
                return qs.filter(department__faculty=user.dean_of_faculty)
            except Exception:
                return qs.none()
        if user.role in ("head", "vice_head"):
            try:
                dept = user.head_of_department if user.role == "head" else user.vice_head_of_department
                return qs.filter(department=dept)
            except Exception:
                return qs.none()
        if user.role == "teacher":
            return qs.filter(user=user)
        return qs.none()

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        dept_id = request.query_params.get("department")
        if dept_id:
            qs = qs.filter(department_id=dept_id)
        return success(TeacherProfileSerializer(qs, many=True).data)

    def create(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role in ("rector", "dean", "head")):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        serializer = TeacherProfileWriteSerializer(data=request.data)
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        profile = serializer.save()
        return success(TeacherProfileSerializer(profile).data, "O'qituvchi profili yaratildi", status.HTTP_201_CREATED)


class TeacherProfileDetailView(RetrieveUpdateDestroyAPIView):
    queryset           = TeacherProfile.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        return TeacherProfileWriteSerializer if self.request.method in ("PUT", "PATCH") else TeacherProfileSerializer

    def retrieve(self, request, *args, **kwargs):
        return success(TeacherProfileSerializer(self.get_object()).data)

    def update(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role in ("rector", "dean", "head")):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        partial    = kwargs.pop("partial", False)
        serializer = TeacherProfileWriteSerializer(self.get_object(), data=request.data, partial=partial)
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        profile = serializer.save()
        return success(TeacherProfileSerializer(profile).data, "Yangilandi")

    def destroy(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role == "rector"):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        self.get_object().delete()
        return success(message="O'chirildi")