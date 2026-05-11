from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResumeViewSet, OrderViewSet, ContractViewSet, ThesisViewSet

router = DefaultRouter()
router.register(r"resumes", ResumeViewSet)
router.register(r"orders", OrderViewSet)
router.register(r"contracts", ContractViewSet)
router.register(r"theses", ThesisViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
