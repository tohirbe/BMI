from django.db import models


class MenuItem(models.Model):
    key      = models.CharField(max_length=50, unique=True)
    label    = models.CharField(max_length=100)
    icon     = models.CharField(max_length=50, blank=True)
    url_path = models.CharField(max_length=100)
    parent   = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )
    order    = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Menyu elementi"
        verbose_name_plural = "Menyu elementlari"
        ordering = ["order"]

    def __str__(self):
        return f"{self.label} ({self.key})"


class Role(models.Model):
    name        = models.CharField(max_length=100, unique=True)
    slug        = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    is_active   = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Rol"
        verbose_name_plural = "Rollar"
        ordering = ["name"]

    def __str__(self):
        return self.name


class RolePermission(models.Model):
    role       = models.ForeignKey(Role, on_delete=models.CASCADE, related_name="permissions")
    menu_item  = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name="role_permissions")
    can_view   = models.BooleanField(default=False)
    can_add    = models.BooleanField(default=False)
    can_edit   = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Rol ruxsati"
        verbose_name_plural = "Rol ruxsatlari"
        unique_together = ("role", "menu_item")

    def __str__(self):
        return f"{self.role} — {self.menu_item}"