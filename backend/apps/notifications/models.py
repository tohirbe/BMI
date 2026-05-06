from django.db import models
from django.conf import settings


class Notification(models.Model):
    class Level(models.TextChoices):
        UNIVERSITY = "university", "Universitet"
        FACULTY    = "faculty",    "Fakultet"
        DEPARTMENT = "department", "Kafedra"
        GROUP      = "group",      "Guruh"
        PERSONAL   = "personal",   "Shaxsiy"

    sender            = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_notifications",
    )
    title             = models.CharField(max_length=200)
    body              = models.TextField()
    level             = models.CharField(max_length=20, choices=Level.choices)
    target_faculty    = models.ForeignKey(
        "university.Faculty",
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name="notifications",
    )
    target_department = models.ForeignKey(
        "university.Department",
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name="notifications",
    )
    target_group      = models.ForeignKey(
        "university.Group",
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name="notifications",
    )
    target_user       = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name="personal_notifications",
    )
    created_at        = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Xabarnoma"
        verbose_name_plural = "Xabarnomalar"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} ({self.level})"


class NotificationRead(models.Model):
    notification = models.ForeignKey(
        Notification, on_delete=models.CASCADE, related_name="reads"
    )
    user         = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notification_reads"
    )
    read_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "O'qilgan xabarnoma"
        verbose_name_plural = "O'qilgan xabarnomalar"
        unique_together = ("notification", "user")

    def __str__(self):
        return f"{self.user} — {self.notification}"