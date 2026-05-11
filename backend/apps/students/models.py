from django.db import models
from django.conf import settings

class Resume(models.Model):
    student = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="resume")
    file    = models.FileField(upload_to="resumes/")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Rezyume"
        verbose_name_plural = "Rezyumelar"


class Order(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    title   = models.CharField(max_length=255)
    file    = models.FileField(upload_to="orders/")
    date    = models.DateField()

    class Meta:
        verbose_name = "Buyruq"
        verbose_name_plural = "Buyruqlar"


class Contract(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="student_contracts")
    number  = models.CharField(max_length=100)
    file    = models.FileField(upload_to="contracts/")
    amount  = models.DecimalField(max_digits=12, decimal_places=2)
    date    = models.DateField()

    class Meta:
        verbose_name = "Shartnoma"
        verbose_name_plural = "Shartnomalar"


class Certificate(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="certificates")
    title   = models.CharField(max_length=255)
    file    = models.FileField(upload_to="certificates/")
    issued_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Ma'lumotnoma"
        verbose_name_plural = "Ma'lumotnomalar"


class GraduationSheet(models.Model):
    student = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    file    = models.FileField(upload_to="graduation/")
    is_ready = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Bitiruv varaqa"
        verbose_name_plural = "Bitiruv varaqalari"


class PlagiarismReport(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title   = models.CharField(max_length=255)
    percent = models.DecimalField(max_digits=5, decimal_places=2)
    file    = models.FileField(upload_to="plagiarism/")

    class Meta:
        verbose_name = "Plagiat ma'lumoti"
        verbose_name_plural = "Plagiat ma'lumotlari"


class Thesis(models.Model):
    student = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title   = models.CharField(max_length=500)
    advisor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="advised_theses")
    file    = models.FileField(upload_to="theses/")
    status  = models.CharField(max_length=50, default="Draft")

    class Meta:
        verbose_name = "Bitiruv ishi"
        verbose_name_plural = "Bitiruv ishlari"


class SocialActivity(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title   = models.CharField(max_length=255)
    description = models.TextField()
    date    = models.DateField()
    certificate = models.FileField(upload_to="social/", blank=True, null=True)

    class Meta:
        verbose_name = "Ijtimoiy faollik"
        verbose_name_plural = "Ijtimoiy faolliklar"
