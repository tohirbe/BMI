from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Subject, Grade, Attendance
from .serializers import (
    SubjectSerializer, SubjectWriteSerializer,
    GradeSerializer, GradeWriteSerializer,
    AttendanceSerializer, AttendanceWriteSerializer,
)
from .services import (
    parse_grades_file, save_grades_bulk,
    parse_attendance_file, save_attendance_bulk,
)
from apps.rbac.permissions import IsOwnerOrManagement


def success(data=None, message="", status_code=status.HTTP_200_OK):
    return Response({"success": True, "data": data, "message": message}, status=status_code)


def error(message="", details=None, status_code=status.HTTP_400_BAD_REQUEST):
    return Response({"success": False, "error": message, "details": details}, status=status_code)


# ── Subject ──────────────────────────────────────────────────────────────────

class SubjectListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        return SubjectWriteSerializer if self.request.method == "POST" else SubjectSerializer

    def get_queryset(self):
        user = self.request.user
        qs   = Subject.objects.select_related("department", "teacher", "group")
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
            return qs.filter(teacher=user)
        if user.role == "student":
            try:
                return qs.filter(group=user.student_profile.group)
            except Exception:
                return qs.none()
        return qs.none()

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        group_id = request.query_params.get("group")
        dept_id  = request.query_params.get("department")
        if group_id:
            qs = qs.filter(group_id=group_id)
        if dept_id:
            qs = qs.filter(department_id=dept_id)
        return success(SubjectSerializer(qs, many=True).data)

    def create(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role in ("rector", "dean", "head")):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        serializer = SubjectWriteSerializer(data=request.data)
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        subject = serializer.save()
        return success(SubjectSerializer(subject).data, "Fan yaratildi", status.HTTP_201_CREATED)


class SubjectDetailView(RetrieveUpdateDestroyAPIView):
    queryset           = Subject.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        return SubjectWriteSerializer if self.request.method in ("PUT", "PATCH") else SubjectSerializer

    def retrieve(self, request, *args, **kwargs):
        return success(SubjectSerializer(self.get_object()).data)

    def update(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role in ("rector", "dean", "head")):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        partial    = kwargs.pop("partial", False)
        serializer = SubjectWriteSerializer(self.get_object(), data=request.data, partial=partial)
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        subject = serializer.save()
        return success(SubjectSerializer(subject).data, "Yangilandi")

    def destroy(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role in ("rector", "dean", "head")):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        self.get_object().delete()
        return success(message="O'chirildi")


# ── Grade ─────────────────────────────────────────────────────────────────────

class GradeListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        return GradeWriteSerializer if self.request.method == "POST" else GradeSerializer

    def get_queryset(self):
        user = self.request.user
        qs   = Grade.objects.select_related("student", "subject", "entered_by")
        if user.is_superuser or user.role == "rector":
            return qs
        if user.role == "dean":
            try:
                return qs.filter(subject__department__faculty=user.dean_of_faculty)
            except Exception:
                return qs.none()
        if user.role in ("head", "vice_head"):
            try:
                dept = user.head_of_department if user.role == "head" else user.vice_head_of_department
                return qs.filter(subject__department=dept)
            except Exception:
                return qs.none()
        if user.role == "teacher":
            return qs.filter(subject__teacher=user)
        if user.role == "student":
            return qs.filter(student=user)
        return qs.none()

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        filters = {
            "student":    "student_id",
            "subject":    "subject_id",
            "grade_type": "grade_type",
        }
        for param, field in filters.items():
            val = request.query_params.get(param)
            if val:
                qs = qs.filter(**{field: val})
        group_id = request.query_params.get("group")
        if group_id:
            qs = qs.filter(subject__group_id=group_id)
        page = self.paginate_queryset(qs)
        return self.get_paginated_response(GradeSerializer(page, many=True).data)

    def create(self, request, *args, **kwargs):
        if request.user.role in ("student", "vice_head"):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        serializer = GradeWriteSerializer(data=request.data, context={"request": request})
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        grade = serializer.save(entered_by=request.user)
        return success(GradeSerializer(grade).data, "Baho saqlandi", status.HTTP_201_CREATED)


class GradeDetailView(RetrieveUpdateDestroyAPIView):
    queryset           = Grade.objects.all()
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        if request.user.role == "student" and obj.student != request.user:
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        return success(GradeSerializer(obj).data)

    def update(self, request, *args, **kwargs):
        if request.user.role in ("student", "vice_head"):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        partial    = kwargs.pop("partial", False)
        serializer = GradeWriteSerializer(
            self.get_object(), data=request.data, partial=partial, context={"request": request}
        )
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        grade = serializer.save(entered_by=request.user)
        return success(GradeSerializer(grade).data, "Yangilandi")

    def destroy(self, request, *args, **kwargs):
        if request.user.role in ("student", "vice_head", "teacher"):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        self.get_object().delete()
        return success(message="O'chirildi")


class GradeBulkUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def post(self, request):
        if request.user.role in ("student", "vice_head"):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)

        file       = request.FILES.get("file")
        subject_id = request.data.get("subject_id")
        confirm    = request.data.get("confirm", "false").lower() == "true"

        if not file:
            return error("Fayl yuklanmadi")
        if not subject_id:
            return error("subject_id majburiy")

        try:
            subject = Subject.objects.get(pk=subject_id)
        except Subject.DoesNotExist:
            return error("Fan topilmadi", status_code=status.HTTP_404_NOT_FOUND)

        if request.user.role == "teacher" and subject.teacher != request.user:
            return error("Bu fan sizga tegishli emas", status_code=status.HTTP_403_FORBIDDEN)

        preview, errors = parse_grades_file(file, subject)

        if errors:
            return Response(
                {"success": False, "errors": errors, "preview": []},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not confirm:
            preview_data = [
                {
                    "student_id": r["student_id"],
                    "grade_type": r["grade_type"],
                    "score":      str(r["score"]),
                    "date":       str(r["date"]),
                }
                for r in preview
            ]
            return success({"preview": preview_data, "count": len(preview)}, "Tasdiqlashdan oldin tekshiring")

        saved = save_grades_bulk(preview, subject, request.user)
        return success({"saved": saved}, f"{saved} ta baho saqlandi")


# ── Attendance ────────────────────────────────────────────────────────────────

class AttendanceListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        return AttendanceWriteSerializer if self.request.method == "POST" else AttendanceSerializer

    def get_queryset(self):
        user = self.request.user
        qs   = Attendance.objects.select_related("student", "subject", "entered_by")
        if user.is_superuser or user.role == "rector":
            return qs
        if user.role == "dean":
            try:
                return qs.filter(subject__department__faculty=user.dean_of_faculty)
            except Exception:
                return qs.none()
        if user.role in ("head", "vice_head"):
            try:
                dept = user.head_of_department if user.role == "head" else user.vice_head_of_department
                return qs.filter(subject__department=dept)
            except Exception:
                return qs.none()
        if user.role == "teacher":
            return qs.filter(subject__teacher=user)
        if user.role == "student":
            return qs.filter(student=user)
        return qs.none()

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        for param, field in [("student", "student_id"), ("subject", "subject_id"),
                              ("date", "date"), ("status", "status")]:
            val = request.query_params.get(param)
            if val:
                qs = qs.filter(**{field: val})
        group_id = request.query_params.get("group")
        if group_id:
            qs = qs.filter(subject__group_id=group_id)
        page = self.paginate_queryset(qs)
        return self.get_paginated_response(AttendanceSerializer(page, many=True).data)

    def create(self, request, *args, **kwargs):
        if request.user.role in ("student", "vice_head"):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        serializer = AttendanceWriteSerializer(data=request.data, context={"request": request})
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        att = serializer.save(entered_by=request.user)
        return success(AttendanceSerializer(att).data, "Davomat saqlandi", status.HTTP_201_CREATED)


class AttendanceDetailView(RetrieveUpdateDestroyAPIView):
    queryset           = Attendance.objects.all()
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        if request.user.role == "student" and obj.student != request.user:
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        return success(AttendanceSerializer(obj).data)

    def update(self, request, *args, **kwargs):
        if request.user.role in ("student", "vice_head"):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        partial    = kwargs.pop("partial", False)
        serializer = AttendanceWriteSerializer(
            self.get_object(), data=request.data, partial=partial, context={"request": request}
        )
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        att = serializer.save(entered_by=request.user)
        return success(AttendanceSerializer(att).data, "Yangilandi")

    def destroy(self, request, *args, **kwargs):
        if request.user.role in ("student", "vice_head", "teacher"):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        self.get_object().delete()
        return success(message="O'chirildi")


class AttendanceBulkUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def post(self, request):
        if request.user.role in ("student", "vice_head"):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)

        file       = request.FILES.get("file")
        subject_id = request.data.get("subject_id")
        confirm    = request.data.get("confirm", "false").lower() == "true"

        if not file:
            return error("Fayl yuklanmadi")
        if not subject_id:
            return error("subject_id majburiy")

        try:
            subject = Subject.objects.get(pk=subject_id)
        except Subject.DoesNotExist:
            return error("Fan topilmadi", status_code=status.HTTP_404_NOT_FOUND)

        if request.user.role == "teacher" and subject.teacher != request.user:
            return error("Bu fan sizga tegishli emas", status_code=status.HTTP_403_FORBIDDEN)

        preview, errors = parse_attendance_file(file, subject)

        if errors:
            return Response(
                {"success": False, "errors": errors, "preview": []},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not confirm:
            preview_data = [
                {"student_id": r["student_id"], "date": str(r["date"]), "status": r["status"]}
                for r in preview
            ]
            return success({"preview": preview_data, "count": len(preview)}, "Tasdiqlashdan oldin tekshiring")

        saved = save_attendance_bulk(preview, subject, request.user)
        return success({"saved": saved}, f"{saved} ta davomat saqlandi")