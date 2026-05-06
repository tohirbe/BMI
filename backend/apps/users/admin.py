from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ("email", "full_name", "role", "is_active", "created_at")
    list_filter   = ("role", "is_active", "is_staff")
    search_fields = ("email", "first_name", "last_name")
    ordering      = ("email",)

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Shaxsiy ma'lumot", {"fields": ("first_name", "last_name", "middle_name", "phone", "avatar")}),
        ("Rol va ruxsatlar", {"fields": ("role", "is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "first_name", "last_name", "role", "password1", "password2"),
        }),
    )