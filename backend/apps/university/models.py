from django.db import models
from django.conf import settings


class Faculty(models.Model):
    name       = models.CharField(max_length=200)
    short_name = models.CharField(max_length=20)
    dean       = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="dean_of_faculty",
        limit_choices_to={"role": "dean"},
    )

    class Meta:
        verbose_name = "Fakultet"
        verbose_name_plural = "Fakultetlar"
        ordering = ["name"]

    def __str__(self):
        return self.short_name


class Department(models.Model):
    name       = models.CharField(max_length=200)
    short_name = models.CharField(max_length=20)
    faculty    = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name="departments")
    head       = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="head_of_department",
        limit_choices_to={"role": "head"},
    )
    vice_head  = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="vice_head_of_department",
        limit_choices_to={"role": "vice_head"},
    )

    class Meta:
        verbose_name = "Kafedra"
        verbose_name_plural = "Kafedralar"
        ordering = ["name"]

    def __str__(self):
        return self.short_name


class AcademicYear(models.Model):
    name       = models.CharField(max_length=20)  # "2024-2025"
    start_date = models.DateField()
    end_date   = models.DateField()
    is_current = models.BooleanField(default=False)

    class Meta:
        verbose_name = "O'quv yili"
        verbose_name_plural = "O'quv yillari"
        ordering = ["-start_date"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.is_current:
            AcademicYear.objects.exclude(pk=self.pk).update(is_current=False)
        super().save(*args, **kwargs)


class Group(models.Model):
    name          = models.CharField(max_length=50)  # "CS-21-1"
    department    = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="groups")
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE, related_name="groups")
    semester      = models.PositiveSmallIntegerField()  # 1-8
    course        = models.PositiveSmallIntegerField()  # 1-4

    class Meta:
        verbose_name = "Guruh"
        verbose_name_plural = "Guruhlar"
        ordering = ["name"]

    def __str__(self):
        return self.name


class StudentProfile(models.Model):
    user          = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_profile",
        limit_choices_to={"role": "student"},
    )
    group         = models.ForeignKey(
        Group, on_delete=models.SET_NULL, null=True, blank=True, related_name="students"
    )
    student_id    = models.CharField(max_length=50, unique=True)
    date_of_birth = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name = "Talaba profili"
        verbose_name_plural = "Talaba profillari"

    def __str__(self):
        return f"{self.user.full_name} — {self.student_id}"


class TeacherProfile(models.Model):
    user       = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="teacher_profile",
        limit_choices_to={"role": "teacher"},
    )
    department = models.ForeignKey(
        Department, on_delete=models.SET_NULL, null=True, blank=True, related_name="teachers"
    )
    position   = models.CharField(max_length=100, blank=True)  # "Dotsent", "Professor"

    class Meta:
        verbose_name = "O'qituvchi profili"
        verbose_name_plural = "O'qituvchi profillari"

    def __str__(self):
        return f"{self.user.full_name} — {self.position}"