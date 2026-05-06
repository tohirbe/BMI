from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView

from .models import Notification, NotificationRead
from .serializers import NotificationSerializer, NotificationWriteSerializer
from .services import get_notification_recipients, can_send_notification


def success(data=None, message="", status_code=status.HTTP_200_OK):
    return Response({"success": True, "data": data, "message": message}, status=status_code)


def error(message="", details=None, status_code=status.HTTP_400_BAD_REQUEST):
    return Response({"success": False, "error": message, "details": details}, status=status_code)


def _get_user_notifications(user):
    """Foydalanuvchiga tegishli barcha notificationlarni qaytaradi."""
    from django.db.models import Q

    if user.is_superuser or user.role == "rector":
        return Notification.objects.all()

    q = Q(level="university")

    if user.role == "dean":
        try:
            faculty = user.dean_of_faculty
            q |= Q(level="faculty", target_faculty=faculty)
            q |= Q(level="department", target_department__faculty=faculty)
            q |= Q(level="group", target_group__department__faculty=faculty)
        except Exception:
            pass

    if user.role in ("head", "vice_head"):
        try:
            dept = user.head_of_department if user.role == "head" else user.vice_head_of_department
            q |= Q(level="department", target_department=dept)
            q |= Q(level="group", target_group__department=dept)
        except Exception:
            pass

    if user.role == "teacher":
        try:
            from apps.academic.models import Subject
            groups = Subject.objects.filter(teacher=user).values_list("group_id", flat=True)
            depts  = Subject.objects.filter(teacher=user).values_list("department_id", flat=True)
            q |= Q(level="group", target_group_id__in=groups)
            q |= Q(level="department", target_department_id__in=depts)
        except Exception:
            pass

    if user.role == "student":
        try:
            group = user.student_profile.group
            q |= Q(level="group", target_group=group)
            q |= Q(level="department", target_department=group.department)
            q |= Q(level="faculty", target_faculty=group.department.faculty)
        except Exception:
            pass

    q |= Q(level="personal", target_user=user)

    return Notification.objects.filter(q).distinct()


class NotificationListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        return NotificationWriteSerializer if self.request.method == "POST" else NotificationSerializer

    def list(self, request, *args, **kwargs):
        qs = _get_user_notifications(request.user).order_by("-created_at")

        is_read = request.query_params.get("is_read")
        if is_read is not None:
            read_ids = NotificationRead.objects.filter(user=request.user).values_list(
                "notification_id", flat=True
            )
            if is_read.lower() == "false":
                qs = qs.exclude(id__in=read_ids)
            elif is_read.lower() == "true":
                qs = qs.filter(id__in=read_ids)

        page = self.paginate_queryset(qs)
        serializer = NotificationSerializer(page, many=True, context={"request": request})
        return self.get_paginated_response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = NotificationWriteSerializer(data=request.data)
        if not serializer.is_valid():
            return error("Xato", serializer.errors)

        data = serializer.validated_data
        allowed = can_send_notification(
            sender             = request.user,
            level              = data["level"],
            target_faculty     = data.get("target_faculty"),
            target_department  = data.get("target_department"),
            target_group       = data.get("target_group"),
            target_user        = data.get("target_user"),
        )
        if not allowed:
            return error("Bu darajada xabarnoma yuborishga ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)

        notification = serializer.save(sender=request.user)
        return success(
            NotificationSerializer(notification, context={"request": request}).data,
            "Xabarnoma yuborildi",
            status.HTTP_201_CREATED,
        )


class NotificationMarkReadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            notification = Notification.objects.get(pk=pk)
        except Notification.DoesNotExist:
            return error("Xabarnoma topilmadi", status_code=status.HTTP_404_NOT_FOUND)

        user_notifs = _get_user_notifications(request.user)
        if not user_notifs.filter(pk=pk).exists():
            return error("Ruxsat yo'q", status_code=status.HTTP_403_FORBIDDEN)

        NotificationRead.objects.get_or_create(notification=notification, user=request.user)
        return success(message="O'qildi deb belgilandi")


class UnreadCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        all_notifs = _get_user_notifications(request.user)
        read_ids   = NotificationRead.objects.filter(user=request.user).values_list(
            "notification_id", flat=True
        )
        count = all_notifs.exclude(id__in=read_ids).count()
        return success({"count": count})