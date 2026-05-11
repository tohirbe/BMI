from rest_framework import serializers
from .models import Resume, Order, Contract, Certificate, GraduationSheet, PlagiarismReport, Thesis, SocialActivity

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = "__all__"

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"

class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"

class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = "__all__"

class ThesisSerializer(serializers.ModelSerializer):
    advisor_name = serializers.CharField(source="advisor.full_name", read_only=True)
    class Meta:
        model = Thesis
        fields = "__all__"
