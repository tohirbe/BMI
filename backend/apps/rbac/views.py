from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from .models import MenuItem, Role, RolePermission
from .serializers import (
    MenuItemSerializer,
    RoleSerializer,
    RolePermissionSerializer,
    RolePermissionWriteSerializer,
    MyPermissionSerializer,
)
from .permissions import IsAdminOrRector


def success(data=None, message="", status_code=status.HTTP_200_OK):
    return Response({"success": True, "data": data, "message": message}, status=status_code)


def error(message="", details=None, status_code=status.HTTP_400_BAD_REQUEST):
    return Response({"success": False, "error": message, "details": details}, status=status_code)


# ── MenuItem ────────────────────────────────────────────────────────────────

class MenuItemListCreateView(ListCreateAPIView):
    queryset           = MenuItem.objects.filter(parent=None, is_active=True).order_by("order")
    serializer_class   = MenuItemSerializer
    permission_classes = [IsAuthenticated, IsAdminOrRector]

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return success(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        serializer.save()
        return success(serializer.data, "Menyu elementi yaratildi", status.HTTP_201_CREATED)


class MenuItemDetailView(RetrieveUpdateDestroyAPIView):
    queryset           = MenuItem.objects.all()
    serializer_class   = MenuItemSerializer
    permission_classes = [IsAuthenticated, IsAdminOrRector]

    def retrieve(self, request, *args, **kwargs):
        return success(self.get_serializer(self.get_object()).data)

    def update(self, request, *args, **kwargs):
        partial    = kwargs.pop("partial", False)
        serializer = self.get_serializer(self.get_object(), data=request.data, partial=partial)
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        serializer.save()
        return success(serializer.data, "Yangilandi")

    def destroy(self, request, *args, **kwargs):
        self.get_object().delete()
        return success(message="O'chirildi")


# ── Role ─────────────────────────────────────────────────────────────────────

class RoleListCreateView(ListCreateAPIView):
    queryset           = Role.objects.all()
    serializer_class   = RoleSerializer
    permission_classes = [IsAuthenticated, IsAdminOrRector]

    def list(self, request, *args, **kwargs):
        return success(self.get_serializer(self.get_queryset(), many=True).data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        serializer.save()
        return success(serializer.data, "Rol yaratildi", status.HTTP_201_CREATED)


class RoleDetailView(RetrieveUpdateDestroyAPIView):
    queryset           = Role.objects.all()
    serializer_class   = RoleSerializer
    permission_classes = [IsAuthenticated, IsAdminOrRector]

    def retrieve(self, request, *args, **kwargs):
        return success(self.get_serializer(self.get_object()).data)

    def update(self, request, *args, **kwargs):
        partial    = kwargs.pop("partial", False)
        serializer = self.get_serializer(self.get_object(), data=request.data, partial=partial)
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        serializer.save()
        return success(serializer.data, "Yangilandi")

    def destroy(self, request, *args, **kwargs):
        self.get_object().delete()
        return success(message="O'chirildi")


# ── RolePermission ────────────────────────────────────────────────────────────

class RolePermissionView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrRector]

    def get(self, request, pk):
        try:
            role = Role.objects.get(pk=pk)
        except Role.DoesNotExist:
            return error("Rol topilmadi", status_code=status.HTTP_404_NOT_FOUND)
        perms = RolePermission.objects.filter(role=role).select_related("menu_item")
        return success(RolePermissionSerializer(perms, many=True).data)

    def post(self, request, pk):
        try:
            role = Role.objects.get(pk=pk)
        except Role.DoesNotExist:
            return error("Rol topilmadi", status_code=status.HTTP_404_NOT_FOUND)
        serializer = RolePermissionWriteSerializer(
            data=request.data, context={"role": role}
        )
        if not serializer.is_valid():
            return error("Xato", serializer.errors)
        perm = serializer.save()
        return success(RolePermissionSerializer(perm).data, "Ruxsat saqlandi", status.HTTP_201_CREATED)


# ── My Permissions ────────────────────────────────────────────────────────────

class MyPermissionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.is_superuser:
            items = MenuItem.objects.filter(parent=None, is_active=True).order_by("order")
            serializer = MenuItemSerializer(items, many=True)
            # Add implicit permissions for superuser
            data = self._add_superuser_perms(serializer.data)
            return success(data)

        try:
            role = Role.objects.get(slug=user.role, is_active=True)
        except Role.DoesNotExist:
            return success([])

        # Get all permissions for this role
        perms = RolePermission.objects.filter(
            role=role, can_view=True, menu_item__is_active=True
        ).select_related("menu_item")
        
        perm_map = {p.menu_item_id: p for p in perms}
        
        # Build nested structure
        top_level_items = MenuItem.objects.filter(parent=None, is_active=True).order_by("order")
        data = []
        for item in top_level_items:
            item_data = self._build_item_data(item, perm_map)
            if item_data:
                data.append(item_data)
        
        return success(data)

    def _add_superuser_perms(self, items):
        for item in items:
            item["can_view"] = True
            item["can_add"] = True
            item["can_edit"] = True
            item["can_delete"] = True
            if item.get("children"):
                self._add_superuser_perms(item["children"])
        return items

    def _build_item_data(self, item, perm_map):
        perm = perm_map.get(item.id)
        if not perm and item.key != "dashboard": # Allow dashboard or check if any child has perm
            children_data = []
            for child in item.children.filter(is_active=True).order_by("order"):
                child_data = self._build_item_data(child, perm_map)
                if child_data:
                    children_data.append(child_data)
            
            if not children_data:
                return None
            
            return {
                "key": item.key,
                "label": item.label,
                "url_path": item.url_path,
                "icon": item.icon,
                "order": item.order,
                "can_view": True,
                "children": children_data
            }
        
        # If item itself has perm
        children_data = []
        for child in item.children.filter(is_active=True).order_by("order"):
            child_data = self._build_item_data(child, perm_map)
            if child_data:
                children_data.append(child_data)
        
        return {
            "key": item.key,
            "label": item.label,
            "url_path": item.url_path,
            "icon": item.icon,
            "order": item.order,
            "can_view": True,
            "can_add": perm.can_add if perm else True,
            "can_edit": perm.can_edit if perm else True,
            "can_delete": perm.can_delete if perm else True,
            "children": children_data
        }