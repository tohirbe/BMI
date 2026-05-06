from django.db import models
from django.db.models import Sum
from django.core.exceptions import ValidationError
from django.conf import settings


class Subject(models.Model):
    name         = models.CharField(max_length=200)
    short_name   = models.CharField(max_length=50, blank=True)
    department   = models.ForeignKey(
        "university.Department", on_delete=models.CASCADE, related_name="subjects"
    )
    teacher      = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="subjects",
        limit_choices_to={"role": "teacher"},
    )
    group        = models.ForeignKey(
        "university.Group", on_delete=models.CASCADE, related_name="subjects"
    )
    credit_hours = models.PositiveSmallIntegerField(default=2)

    class Meta:
        verbose_name = "Fan"
        verbose_name_plural = "Fanlar"
        unique_together = ("name", "group", "teacher")
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.group})"


class Grade(models.Model):
    class GradeType(models.TextChoices):
        JORIY_1 = "joriy_1", "Joriy nazorat 1"
        JORIY_2 = "joriy_2", "Joriy nazorat 2"
        ORALIQ  = "oraliq",  "Oraliq nazorat"
        YAKUNIY = "yakuniy", "Yakuniy nazorat"

    MAX_SCORES = {
        "joriy_1": 15,
        "joriy_2": 15,
        "oraliq":  30,
        "yakuniy": 40,
    }

    student    = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="grades",
        limit_choices_to={"role": "student"},
    )
    subject    = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="grades")
    grade_type = models.CharField(max_length=10, choices=GradeType.choices)
    score      = models.DecimalField(max_digits=5, decimal_places=2)
    date       = models.DateField()
    entered_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="entered_grades",
    )
    note       = models.TextField(blank=True)

    class Meta:
        verbose_name = "Baho"
        verbose_name_plural = "Baholar"
        unique_together = ("student", "subject", "grade_type")
        ordering = ["-date"]

    def __str__(self):
        return f"{self.student} — {self.subject} — {self.grade_type}: {self.score}"

    def clean(self):
        max_score = self.MAX_SCORES.get(self.grade_type, 0)
        if self.score < 0 or self.score > max_score:
            raise ValidationError(
                {"score": f"{self.grade_type} uchun ball 0 va {max_score} orasida bo'lishi kerak"}
            )

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    @classmethod
    def get_total_score(cls, student, subject):
        total = cls.objects.filter(student=student, subject=subject).aggregate(
            total=Sum("score")
        )["total"]
        return float(total or 0)

    @classmethod
    def get_letter_grade(cls, total):
        if total >= 86:
            return "A'lo"
        elif total >= 71:
            return "Yaxshi"
        elif total >= 56:
            return "Qoniqarli"
        return "Qoniqarsiz"


class Attendance(models.Model):
    class Status(models.TextChoices):
        PRESENT = "present",  "Keldi"
        ABSENT  = "absent",   "Kelmadi"
        EXCUSED = "excused",  "Uzrli"
        LATE    = "late",     "Kech keldi"

    student    = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="attendances",
        limit_choices_to={"role": "student"},
    )
    subject    = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="attendances")
    date       = models.DateField()
    status     = models.CharField(max_length=10, choices=Status.choices)
    entered_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="entered_attendances",
    )
    note       = models.TextField(blank=True)

    class Meta:
        verbose_name = "Davomat"
        verbose_name_plural = "Davomat"
        unique_together = ("student", "subject", "date")
        ordering = ["-date"]

    def __str__(self):
        return f"{self.student} — {self.subject} — {self.date}: {self.status}"

    @classmethod
    def get_attendance_percent(cls, student, subject):
        qs = cls.objects.filter(student=student, subject=subject)
        total = qs.count()
        if total == 0:
            return 0.0
        present = qs.filter(status__in=[cls.Status.PRESENT, cls.Status.LATE]).count()
        return round((present / total) * 100, 1)