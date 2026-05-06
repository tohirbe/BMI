from django.urls import path
from .views import (
    MenuItemListCreateView,
    MenuItemDetailView,
    RoleListCreateView,
    RoleDetailView,
    RolePermissionView,
    MyPermissionsView,
)

urlpatterns = [
    path("menu-items/",              MenuItemListCreateView.as_view(), name="menu-item-list"),
    path("menu-items/<int:pk>/",     MenuItemDetailView.as_view(),     name="menu-item-detail"),

    path("roles/",                   RoleListCreateView.as_view(),     name="role-list"),
    path("roles/<int:pk>/",          RoleDetailView.as_view(),         name="role-detail"),
    path("roles/<int:pk>/permissions/", RolePermissionView.as_view(),  name="role-permissions"),

    path("my-permissions/",          MyPermissionsView.as_view(),      name="my-permissions"),
]