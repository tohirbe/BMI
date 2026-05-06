from django.urls import path
from .views import (
    NotificationListCreateView,
    NotificationMarkReadView,
    UnreadCountView,
)

urlpatterns = [
    path("",                    NotificationListCreateView.as_view(), name="notification-list"),
    path("<int:pk>/read/",      NotificationMarkReadView.as_view(),   name="notification-read"),
    path("unread-count/",       UnreadCountView.as_view(),            name="notification-unread-count"),
]