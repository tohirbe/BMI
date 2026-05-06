from django.urls import path
from .views import (
    UniversityAnalyticsView,
    FacultyAnalyticsView,
    DepartmentAnalyticsView,
    GroupAnalyticsView,
    SubjectAnalyticsView,
    StudentAnalyticsView,
)

urlpatterns = [
    path("university/",          UniversityAnalyticsView.as_view(),  name="analytics-university"),
    path("faculty/<int:pk>/",    FacultyAnalyticsView.as_view(),     name="analytics-faculty"),
    path("department/<int:pk>/", DepartmentAnalyticsView.as_view(),  name="analytics-department"),
    path("group/<int:pk>/",      GroupAnalyticsView.as_view(),       name="analytics-group"),
    path("subject/<int:pk>/",    SubjectAnalyticsView.as_view(),     name="analytics-subject"),
    path("student/<int:pk>/",    StudentAnalyticsView.as_view(),     name="analytics-student"),
]