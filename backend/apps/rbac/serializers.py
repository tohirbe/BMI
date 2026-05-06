from rest_framework import serializers
from .models import MenuItem, Role, RolePermission


class MenuItemSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model  = MenuItem
        fields = ("id", "key", "label", "icon", "url_path", "parent", "order", "is_active", "children")

    def get_children(self, obj):
        qs = obj.children.filter(is_active=True).order_by("order")
        return MenuItemSerializer(qs, many=True).data


class RolePermissionSerializer(serializers.ModelSerializer):
    menu_item_key   = serializers.CharField(source="menu_item.key",   read_only=True)
    menu_item_label = serializers.CharField(source="menu_item.label", read_only=True)

    class Meta:
        model  = RolePermission
        fields = (
            "id", "menu_item", "menu_item_key", "menu_item_label",
            "can_view", "can_add", "can_edit", "can_delete",
        )


class RolePermissionWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = RolePermission
        fields = ("menu_item", "can_view", "can_add", "can_edit", "can_delete")

    def create(self, validated_data):
        role = self.context["role"]
        obj, _ = RolePermission.objects.update_or_create(
            role=role,
            menu_item=validated_data["menu_item"],
            defaults={
                "can_view":   validated_data.get("can_view",   False),
                "can_add":    validated_data.get("can_add",    False),
                "can_edit":   validated_data.get("can_edit",   False),
                "can_delete": validated_data.get("can_delete", False),
            },
        )
        return obj


class RoleSerializer(serializers.ModelSerializer):
    permissions = RolePermissionSerializer(many=True, read_only=True)

    class Meta:
        model  = Role
        fields = ("id", "name", "slug", "description", "is_active", "created_at", "permissions")
        read_only_fields = ("id", "created_at")


class MyPermissionSerializer(serializers.Serializer):
    """GET /api/rbac/my-permissions/ uchun — faqat can_view=True bo'lganlar."""
    key        = serializers.CharField()
    label      = serializers.CharField()
    url_path   = serializers.CharField()
    icon       = serializers.CharField()
    order      = serializers.IntegerField()
    can_view   = serializers.BooleanField()
    can_add    = serializers.BooleanField()
    can_edit   = serializers.BooleanField()
    can_delete = serializers.BooleanField()