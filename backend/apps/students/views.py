from rest_framework import viewsets, permissions
from .models import Resume, Order, Contract, Certificate, Thesis
from .serializers import ResumeSerializer, OrderSerializer, ContractSerializer, CertificateSerializer, ThesisSerializer

class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    def get_queryset(self):
        return self.queryset.filter(student=self.request.user)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    def get_queryset(self):
        return self.queryset.filter(student=self.request.user)

class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    def get_queryset(self):
        return self.queryset.filter(student=self.request.user)

class ThesisViewSet(viewsets.ModelViewSet):
    queryset = Thesis.objects.all()
    serializer_class = ThesisSerializer
    def get_queryset(self):
        if self.request.user.role == "student":
            return self.queryset.filter(student=self.request.user)
        return self.queryset
