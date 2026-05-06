from rest_framework import serializers
from .models import Notification, NotificationRead


class NotificationSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.full_name", read_only=True)
    is_read     = serializers.SerializerMethodField()

    class Meta:
        model  = Notification
        fields = (
            "id", "sender", "sender_name",
            "title", "body", "level",
            "target_faculty", "target_department", "target_group", "target_user",
            "created_at", "is_read",
        )

    def get_is_read(self, obj):
        request = self.context.get("request")
        if not request:
            return False
        return NotificationRead.objects.filter(notification=obj, user=request.user).exists()


class NotificationWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Notification
        fields = (
            "title", "body", "level",
            "target_faculty", "target_department", "target_group", "target_user",
        )

    def validate(self, attrs):
        level = attrs.get("level")
        errors = {}

        if level == "faculty" and not attrs.get("target_faculty"):
            errors["target_faculty"] = "Fakultet tanlang"
        if level == "department" and not attrs.get("target_department"):
            errors["target_department"] = "Kafedra tanlang"
        if level == "group" and not attrs.get("target_group"):
            errors["target_group"] = "Guruh tanlang"
        if level == "personal" and not attrs.get("target_user"):
            errors["target_user"] = "Foydalanuvchi tanlang"

        if errors:
            raise serializers.ValidationError(errors)
        return attrs