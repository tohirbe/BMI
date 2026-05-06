from django.core.management.base import BaseCommand
from apps.rbac.models import MenuItem, Role, RolePermission


MENU_ITEMS = [
    {"key": "dashboard",     "label": "Dashboard",          "url_path": "/dashboard",          "order": 1},
    {"key": "grades",        "label": "Baholar",            "url_path": "/grades",             "order": 2},
    {"key": "attendance",    "label": "Davomat",            "url_path": "/attendance",         "order": 3},
    {"key": "analytics",     "label": "Tahlil",             "url_path": "/analytics",          "order": 4},
    {"key": "students",      "label": "Talabalar",          "url_path": "/students",           "order": 5},
    {"key": "groups",        "label": "Guruhlar",           "url_path": "/groups",             "order": 6},
    {"key": "subjects",      "label": "Fanlar",             "url_path": "/subjects",           "order": 7},
    {"key": "reports",       "label": "Hisobotlar",         "url_path": "/reports",            "order": 8},
    {"key": "notifications", "label": "Xabarnomalar",       "url_path": "/notifications",      "order": 9},
    {"key": "users",         "label": "Foydalanuvchilar",   "url_path": "/admin/users",        "order": 10},
    {"key": "roles",         "label": "Rollar",             "url_path": "/admin/roles",        "order": 11},
    {"key": "permissions",   "label": "Ruxsatlar",          "url_path": "/admin/permissions",  "order": 12},
]

ROLES = [
    {"name": "Rektor",                    "slug": "rector"},
    {"name": "Dekan",                     "slug": "dean"},
    {"name": "Kafedra boshlig'i",         "slug": "head"},
    {"name": "Kafedra boshlig'i o'rinbosari", "slug": "vice_head"},
    {"name": "O'qituvchi",                "slug": "teacher"},
    {"name": "Talaba",                    "slug": "student"},
]

ROLE_PERMISSIONS = {
    "rector": {
        "dashboard":     {"can_view": True},
        "analytics":     {"can_view": True},
        "students":      {"can_view": True},
        "groups":        {"can_view": True},
        "subjects":      {"can_view": True},
        "reports":       {"can_view": True},
        "notifications": {"can_view": True, "can_add": True},
        "users":         {"can_view": True, "can_add": True, "can_edit": True},
        "roles":         {"can_view": True},
        "permissions":   {"can_view": True, "can_edit": True},
    },
    "dean": {
        "dashboard":     {"can_view": True},
        "analytics":     {"can_view": True},
        "students":      {"can_view": True},
        "groups":        {"can_view": True},
        "subjects":      {"can_view": True},
        "reports":       {"can_view": True},
        "notifications": {"can_view": True, "can_add": True},
        "grades":        {"can_view": True},
        "attendance":    {"can_view": True},
    },
    "head": {
        "dashboard":     {"can_view": True},
        "analytics":     {"can_view": True},
        "students":      {"can_view": True},
        "groups":        {"can_view": True},
        "subjects":      {"can_view": True},
        "grades":        {"can_view": True},
        "attendance":    {"can_view": True},
        "notifications": {"can_view": True, "can_add": True},
    },
    "vice_head": {
        "dashboard":     {"can_view": True},
        "analytics":     {"can_view": True},
        "students":      {"can_view": True},
        "groups":        {"can_view": True},
        "subjects":      {"can_view": True},
        "grades":        {"can_view": True},
        "attendance":    {"can_view": True},
        "notifications": {"can_view": True},
    },
    "teacher": {
        "dashboard":     {"can_view": True},
        "grades":        {"can_view": True, "can_add": True, "can_edit": True},
        "attendance":    {"can_view": True, "can_add": True, "can_edit": True},
        "subjects":      {"can_view": True},
        "notifications": {"can_view": True, "can_add": True},
    },
    "student": {
        "dashboard":     {"can_view": True},
        "notifications": {"can_view": True},
    },
}


class Command(BaseCommand):
    help = "Default menyu elementlari, rollar va ruxsatlarni yaratadi"

    def handle(self, *args, **options):
        self.stdout.write("=== seed_rbac boshlandi ===")

        # 1. MenuItem lar
        menu_map = {}
        for item_data in MENU_ITEMS:
            obj, created = MenuItem.objects.get_or_create(
                key=item_data["key"],
                defaults={
                    "label":    item_data["label"],
                    "url_path": item_data["url_path"],
                    "order":    item_data["order"],
                },
            )
            menu_map[obj.key] = obj
            status = "yaratildi" if created else "mavjud"
            self.stdout.write(f"  MenuItem [{obj.key}] — {status}")

        # 2. Rollar
        role_map = {}
        for role_data in ROLES:
            obj, created = Role.objects.get_or_create(
                slug=role_data["slug"],
                defaults={"name": role_data["name"]},
            )
            role_map[obj.slug] = obj
            status = "yaratildi" if created else "mavjud"
            self.stdout.write(f"  Role [{obj.slug}] — {status}")

        # 3. RolePermission lar
        for role_slug, perms in ROLE_PERMISSIONS.items():
            role = role_map.get(role_slug)
            if not role:
                continue
            for menu_key, flags in perms.items():
                menu_item = menu_map.get(menu_key)
                if not menu_item:
                    continue
                RolePermission.objects.update_or_create(
                    role=role,
                    menu_item=menu_item,
                    defaults={
                        "can_view":   flags.get("can_view",   False),
                        "can_add":    flags.get("can_add",    False),
                        "can_edit":   flags.get("can_edit",   False),
                        "can_delete": flags.get("can_delete", False),
                    },
                )
            self.stdout.write(f"  [{role_slug}] — {len(perms)} ta ruxsat saqlandi")

        self.stdout.write(self.style.SUCCESS("=== seed_rbac muvaffaqiyatli tugadi ==="))