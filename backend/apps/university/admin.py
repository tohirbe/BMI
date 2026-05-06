from django.contrib import admin
from .models import Faculty, Department, AcademicYear, Group, StudentProfile, TeacherProfile


@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display  = ("name", "short_name", "dean")
    search_fields = ("name", "short_name")


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display  = ("name", "short_name", "faculty", "head")
    list_filter   = ("faculty",)
    search_fields = ("name", "short_name")


@admin.register(AcademicYear)
class AcademicYearAdmin(admin.ModelAdmin):
    list_display = ("name", "start_date", "end_date", "is_current")


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display  = ("name", "department", "academic_year", "course", "semester")
    list_filter   = ("department", "academic_year", "course")
    search_fields = ("name",)


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display  = ("user", "student_id", "group")
    search_fields = ("student_id", "user__email")


@admin.register(TeacherProfile)
class TeacherProfileAdmin(admin.ModelAdmin):
    list_display  = ("user", "department", "position")
    search_fields = ("user__email",)