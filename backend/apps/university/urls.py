from django.urls import path
from .views import (
    FacultyListCreateView, FacultyDetailView,
    DepartmentListCreateView, DepartmentDetailView,
    AcademicYearListCreateView, AcademicYearDetailView,
    GroupListCreateView, GroupDetailView,
    StudentProfileListCreateView, StudentProfileDetailView,
    TeacherProfileListCreateView, TeacherProfileDetailView,
)

urlpatterns = [
    path("faculties/",                FacultyListCreateView.as_view(),       name="faculty-list"),
    path("faculties/<int:pk>/",       FacultyDetailView.as_view(),           name="faculty-detail"),

    path("departments/",              DepartmentListCreateView.as_view(),     name="department-list"),
    path("departments/<int:pk>/",     DepartmentDetailView.as_view(),         name="department-detail"),

    path("academic-years/",           AcademicYearListCreateView.as_view(),   name="academic-year-list"),
    path("academic-years/<int:pk>/",  AcademicYearDetailView.as_view(),       name="academic-year-detail"),

    path("groups/",                   GroupListCreateView.as_view(),          name="group-list"),
    path("groups/<int:pk>/",          GroupDetailView.as_view(),              name="group-detail"),

    path("student-profiles/",         StudentProfileListCreateView.as_view(), name="student-profile-list"),
    path("student-profiles/<int:pk>/",StudentProfileDetailView.as_view(),     name="student-profile-detail"),

    path("teacher-profiles/",         TeacherProfileListCreateView.as_view(), name="teacher-profile-list"),
    path("teacher-profiles/<int:pk>/",TeacherProfileDetailView.as_view(),     name="teacher-profile-detail"),
]