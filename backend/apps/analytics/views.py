from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.university.models import Faculty, Department, Group
from apps.users.models import User
from .services import (
    university_stats,
    faculty_stats,
    department_stats,
    group_stats,
    subject_stats,
    student_stats,
)


def success(data=None, message="", status_code=status.HTTP_200_OK):
    return Response({"success": True, "data": data, "message": message}, status=status_code)


def error(message="", details=None, status_code=status.HTTP_400_BAD_REQUEST):
    return Response({"success": False, "error": message, "details": details}, status=status_code)


def _get_filters(request):
    return {
        "academic_year": request.query_params.get("academic_year"),
        "semester":      request.query_params.get("semester"),
    }


class UniversityAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not (request.user.is_superuser or request.user.role in ("rector",)):
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        data = university_stats(**_get_filters(request))
        return success(data)


class FacultyAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            faculty = Faculty.objects.get(pk=pk)
        except Faculty.DoesNotExist:
            return error("Fakultet topilmadi", status_code=status.HTTP_404_NOT_FOUND)

        user = request.user
        if not (user.is_superuser or user.role == "rector"):
            if user.role == "dean":
                try:
                    if user.dean_of_faculty != faculty:
                        return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
                except Exception:
                    return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
            else:
                return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)

        data = faculty_stats(faculty, **_get_filters(request))
        return success(data)


class DepartmentAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            department = Department.objects.get(pk=pk)
        except Department.DoesNotExist:
            return error("Kafedra topilmadi", status_code=status.HTTP_404_NOT_FOUND)

        user = request.user
        if not (user.is_superuser or user.role == "rector"):
            if user.role == "dean":
                try:
                    if department.faculty != user.dean_of_faculty:
                        return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
                except Exception:
                    return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
            elif user.role in ("head", "vice_head"):
                try:
                    dept = user.head_of_department if user.role == "head" else user.vice_head_of_department
                    if dept != department:
                        return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
                except Exception:
                    return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
            else:
                return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)

        data = department_stats(department, **_get_filters(request))
        return success(data)


class GroupAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            group = Group.objects.get(pk=pk)
        except Group.DoesNotExist:
            return error("Guruh topilmadi", status_code=status.HTTP_404_NOT_FOUND)

        user = request.user
        if not (user.is_superuser or user.role in ("rector", "dean", "head", "vice_head")):
            if user.role == "teacher":
                from apps.academic.models import Subject
                if not Subject.objects.filter(teacher=user, group=group).exists():
                    return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
            elif user.role == "student":
                try:
                    if user.student_profile.group != group:
                        return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
                except Exception:
                    return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
            else:
                return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)

        data = group_stats(group, **_get_filters(request))
        return success(data)


class SubjectAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        from apps.academic.models import Subject
        try:
            subject = Subject.objects.get(pk=pk)
        except Subject.DoesNotExist:
            return error("Fan topilmadi", status_code=status.HTTP_404_NOT_FOUND)

        user = request.user
        if user.role == "teacher" and subject.teacher != user:
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
        if user.role == "student":
            try:
                if user.student_profile.group != subject.group:
                    return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
            except Exception:
                return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)

        data = subject_stats(subject)
        return success(data)


class StudentAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            student = User.objects.get(pk=pk, role="student")
        except User.DoesNotExist:
            return error("Talaba topilmadi", status_code=status.HTTP_404_NOT_FOUND)

        user = request.user
        if not (user.is_superuser or user.role in ("rector", "dean", "head", "vice_head")):
            if user.role == "teacher":
                from apps.academic.models import Subject
                try:
                    group = student.student_profile.group
                    if not Subject.objects.filter(teacher=user, group=group).exists():
                        return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
                except Exception:
                    return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
            elif user.role == "student":
                if user.pk != student.pk:
                    return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)
            else:
                return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)

        data = student_stats(student, **_get_filters(request))
        return success(data)