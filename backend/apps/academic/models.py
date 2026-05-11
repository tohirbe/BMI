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


class Curriculum(models.Model):
    group         = models.ForeignKey("university.Group", on_delete=models.CASCADE, related_name="curriculums")
    subject       = models.ForeignKey(Subject, on_delete=models.CASCADE)
    semester      = models.PositiveSmallIntegerField()
    total_hours   = models.PositiveIntegerField(default=30)
    credit_points = models.DecimalField(max_digits=4, decimal_places=1, default=5.0)

    class Meta:
        verbose_name = "O'quv reja"
        verbose_name_plural = "O'quv rejalari"
        unique_together = ("group", "subject", "semester")

    def __str__(self):
        return f"{self.group} - {self.subject} (S{self.semester})"


class Schedule(models.Model):
    class WeekDay(models.TextChoices):
        MONDAY    = "mon", "Dushanba"
        TUESDAY   = "tue", "Seshanba"
        WEDNESDAY = "wed", "Chorshanba"
        THURSDAY  = "thu", "Payshanba"
        FRIDAY    = "fri", "Juma"
        SATURDAY  = "sat", "Shanba"

    group     = models.ForeignKey("university.Group", on_delete=models.CASCADE, related_name="schedules")
    subject   = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher   = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    weekday   = models.CharField(max_length=3, choices=WeekDay.choices)
    pair_number = models.PositiveSmallIntegerField()  # 1-6
    room      = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Dars jadvali"
        verbose_name_plural = "Dars jadvallari"

    def __str__(self):
        return f"{self.get_weekday_display()} - {self.pair_number}-para: {self.subject}"


class ExamSchedule(models.Model):
    class ExamType(models.TextChoices):
        ORALIQ  = "oraliq", "Oraliq"
        YAKUNIY = "yakuniy", "Yakuniy"

    group    = models.ForeignKey("university.Group", on_delete=models.CASCADE)
    subject  = models.ForeignKey(Subject, on_delete=models.CASCADE)
    date     = models.DateField()
    time     = models.TimeField()
    room     = models.CharField(max_length=50)
    exam_type = models.CharField(max_length=10, choices=ExamType.choices)

    class Meta:
        verbose_name = "Nazorat jadvali"
        verbose_name_plural = "Nazorat jadvallari"


class SubjectResource(models.Model):
    subject     = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="resources")
    title       = models.CharField(max_length=255)
    file        = models.FileField(upload_to="resources/")
    description = models.TextField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Fan resursi"
        verbose_name_plural = "Fanlar resurslari"


class Exam(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    date    = models.DateField()
    score   = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    passed  = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Imtihon"
        verbose_name_plural = "Imtihonlar"


class SubjectSelection(models.Model):
    student    = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    subjects   = models.ManyToManyField(Subject)
    semester   = models.PositiveSmallIntegerField()
    is_approved = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Fan tanlovi"
        verbose_name_plural = "Fan tanlovlari"


class RetakeApplication(models.Model):
    class Status(models.TextChoices):
        PENDING  = "pending", "Kutilmoqda"
        APPROVED = "approved", "Tasdiqlandi"
        REJECTED = "rejected", "Rad etildi"

    student    = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    subject    = models.ForeignKey(Subject, on_delete=models.CASCADE)
    reason     = models.TextField()
    status     = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Qayta o'qish arizasi"
        verbose_name_plural = "Qayta o'qish arizalari"