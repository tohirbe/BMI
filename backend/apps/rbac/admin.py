from django.contrib import admin
from .models import MenuItem, Role, RolePermission


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display  = ("key", "label", "url_path", "order", "is_active")
    list_filter   = ("is_active",)
    ordering      = ("order",)


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display  = ("name", "slug", "is_active", "created_at")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(RolePermission)
class RolePermissionAdmin(admin.ModelAdmin):
    list_display  = ("role", "menu_item", "can_view", "can_add", "can_edit", "can_delete")
    list_filter   = ("role",)