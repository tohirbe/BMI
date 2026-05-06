from rest_framework.permissions import BasePermission
from .models import Role, RolePermission


class HasMenuPermission(BasePermission):
    """
    ViewSet da ishlatish:
        permission_classes = [IsAuthenticated, HasMenuPermission]
        required_menu   = "grades"
        required_action = "can_view"
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.user.is_superuser:
            return True

        required_menu   = getattr(view, "required_menu",   None)
        required_action = getattr(view, "required_action", "can_view")

        if not required_menu:
            return True

        try:
            role = Role.objects.get(slug=request.user.role, is_active=True)
            perm = RolePermission.objects.get(role=role, menu_item__key=required_menu)
            return getattr(perm, required_action, False)
        except (Role.DoesNotExist, RolePermission.DoesNotExist):
            return False


class IsOwnerOrManagement(BasePermission):
    """
    Talaba faqat o'z ma'lumotini ko'radi.
    Teacher faqat o'z fanini tahrirlaydi.
    Dean/Head/Rector barchani ko'radi.
    """

    MANAGEMENT_ROLES = ("superuser", "rector", "dean", "head", "vice_head")

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        user = request.user

        if user.is_superuser or user.role in self.MANAGEMENT_ROLES:
            return True

        # Ob'ektning egasi
        owner_field = getattr(obj, "student", None) or getattr(obj, "user", None)
        if owner_field and owner_field == user:
            return True

        # Teacher o'z subjectini tahrirlaydi
        if hasattr(obj, "teacher") and obj.teacher == user:
            return True

        return False


class IsManagement(BasePermission):
    """Faqat rector, dean, head, vice_head va superuser."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.is_superuser or request.user.role in (
            "rector", "dean", "head", "vice_head"
        )


class IsAdminOrRector(BasePermission):
    """Faqat superuser yoki rector."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.is_superuser or request.user.role == "rector"


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in ("GET", "HEAD", "OPTIONS")