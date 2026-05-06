from django.contrib import admin
from .models import Subject, Grade, Attendance


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display  = ("name", "short_name", "department", "group", "teacher", "credit_hours")
    list_filter   = ("department", "group")
    search_fields = ("name",)


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display  = ("student", "subject", "grade_type", "score", "date", "entered_by")
    list_filter   = ("grade_type", "subject")
    search_fields = ("student__email",)


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display  = ("student", "subject", "date", "status", "entered_by")
    list_filter   = ("status", "subject")
    search_fields = ("student__email",)