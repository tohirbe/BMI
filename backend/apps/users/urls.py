from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import LoginView, MeView, UserListCreateView, UserDetailView

urlpatterns = [
    path("login/",   LoginView.as_view(),        name="auth-login"),
    path("refresh/", TokenRefreshView.as_view(),  name="auth-refresh"),
    path("me/",      MeView.as_view(),            name="auth-me"),
]

# /api/users/ ga ham qo'shamiz (config/urls.py da users uchun alohida include kerak)
user_urlpatterns = [
    path("",        UserListCreateView.as_view(), name="user-list"),
    path("<int:pk>/", UserDetailView.as_view(),   name="user-detail"),
]