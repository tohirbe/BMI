from django.db import models
from django.conf import settings

class FinancialContract(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="financial_contracts")
    academic_year = models.ForeignKey("university.AcademicYear", on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    paid_amount  = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    debt_amount  = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta:
        verbose_name = "Kontrakt"
        verbose_name_plural = "Kontraktlar"


class Scholarship(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="scholarships")
    academic_year = models.ForeignKey("university.AcademicYear", on_delete=models.CASCADE)
    month   = models.PositiveSmallIntegerField()  # 1-12
    amount  = models.DecimalField(max_digits=10, decimal_places=2)
    status  = models.CharField(max_length=20, default="Paid")

    class Meta:
        verbose_name = "Stipendiya"
        verbose_name_plural = "Stipendiyalar"
