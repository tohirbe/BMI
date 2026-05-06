from django.urls import path
from .views import (
    SubjectListCreateView, SubjectDetailView,
    GradeListCreateView, GradeDetailView, GradeBulkUploadView,
    AttendanceListCreateView, AttendanceDetailView, AttendanceBulkUploadView,
)

urlpatterns = [
    path("subjects/",                  SubjectListCreateView.as_view(),    name="subject-list"),
    path("subjects/<int:pk>/",         SubjectDetailView.as_view(),        name="subject-detail"),

    path("grades/",                    GradeListCreateView.as_view(),      name="grade-list"),
    path("grades/<int:pk>/",           GradeDetailView.as_view(),          name="grade-detail"),
    path("grades/bulk-upload/",        GradeBulkUploadView.as_view(),      name="grade-bulk-upload"),

    path("attendance/",                AttendanceListCreateView.as_view(), name="attendance-list"),
    path("attendance/<int:pk>/",       AttendanceDetailView.as_view(),     name="attendance-detail"),
    path("attendance/bulk-upload/",    AttendanceBulkUploadView.as_view(), name="attendance-bulk-upload"),
]