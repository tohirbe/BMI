from django.core.management.base import BaseCommand
from apps.rbac.models import MenuItem, Role, RolePermission

class Command(BaseCommand):
    help = "Seeds the menu items based on HEMIS screenshots"

    def handle(self, *args, **options):
        # Top-level items
        structure = [
            {
                "key": "curriculum_parent",
                "label": "O'quv reja",
                "icon": "book_open",
                "url_path": "#",
                "order": 10,
                "children": [
                    {"key": "curriculum",        "label": "O'quv reja",         "url_path": "/academic/curriculum",   "order": 1},
                    {"key": "schedule",          "label": "Dars jadvali",       "url_path": "/academic/schedule",     "order": 2},
                    {"key": "exam_schedule",     "label": "Nazorat jadvali",    "url_path": "/academic/exams/schedule", "order": 3},
                    {"key": "resources",         "label": "Fanlar resurslari",  "url_path": "/academic/resources",    "order": 4},
                    {"key": "attendance",        "label": "Davomat",            "url_path": "/academic/attendance",   "order": 5},
                    {"key": "attendance_report", "label": "Davomat hisoboti",   "url_path": "/academic/attendance/report", "order": 6},
                    {"key": "grades",            "label": "O'zlashtirish",      "url_path": "/academic/grades",       "order": 7},
                    {"key": "personal_record",   "label": "Shaxsiy qaydnoma",   "url_path": "/academic/personal-record", "order": 8},
                    {"key": "exams",             "label": "Imtihonlar",         "url_path": "/academic/exams",        "order": 9},
                    {"key": "rating_book",       "label": "Reyting daftarcha", "url_path": "/academic/rating-book",  "order": 10},
                    {"key": "subject_selection", "label": "Fan tanlovi",       "url_path": "/academic/subject-selection", "order": 11},
                ]
            },
            {
                "key": "retake_parent",
                "label": "Qayta o'qish",
                "icon": "refresh_cw",
                "url_path": "#",
                "order": 20,
                "children": [
                    {"key": "retake_app",      "label": "Ariza qayta o'qish", "url_path": "/academic/retake/app",      "order": 1},
                    {"key": "retake_schedule", "label": "Q.O'qish mashg'ulotlari", "url_path": "/academic/retake/schedule", "order": 2},
                    {"key": "retake_exams",    "label": "Q.O'qish nazorat jadvali", "url_path": "/academic/retake/exams",    "order": 3},
                    {"key": "retake_grades",   "label": "Q.O'qish o'zlashtirish", "url_path": "/academic/retake/grades",   "order": 4},
                ]
            },
            {
                "key": "student_info_parent",
                "label": "Talaba ma'lumoti",
                "icon": "user",
                "url_path": "#",
                "order": 30,
                "children": [
                    {"key": "resume",         "label": "Rezyume",            "url_path": "/student/resume",         "order": 1},
                    {"key": "orders",         "label": "Buyruqlar",          "url_path": "/student/orders",         "order": 2},
                    {"key": "contracts",      "label": "Shartnomalar",       "url_path": "/student/contracts",      "order": 3},
                    {"key": "certificates",   "label": "Ma'lumotnomalar",    "url_path": "/student/certificates",   "order": 4},
                    {"key": "documents",      "label": "Talaba hujjati",      "url_path": "/student/documents",      "order": 5},
                    {"key": "grad_sheet",     "label": "Bitiruv varaqa",     "url_path": "/student/grad-sheet",     "order": 6},
                    {"key": "gpa",            "label": "Talaba GPA bali",    "url_path": "/student/gpa",            "order": 7},
                    {"key": "cert_list",      "label": "Fan sertifikatlari", "url_path": "/student/certificates-list", "order": 8},
                    {"key": "plagiarism",     "label": "Plagiat ma'lumotlari", "url_path": "/student/plagiarism",     "order": 9},
                    {"key": "personal_info",  "label": "Shaxsiy ma'lumotlar", "url_path": "/student/personal-info",  "order": 10},
                    {"key": "thesis",         "label": "Bitiruv ishi",       "url_path": "/student/thesis",         "order": 11},
                    {"key": "social",         "label": "Ijtimoiy faollik",   "url_path": "/student/social",         "order": 12},
                ]
            },
            {
                "key": "finance_parent",
                "label": "Moliyaviy to'lov",
                "icon": "dollar_sign",
                "url_path": "#",
                "order": 40,
                "children": [
                    {"key": "fin_contracts", "label": "Kontraktlar ro'yxati", "url_path": "/finance/contracts", "order": 1},
                    {"key": "scholarship",   "label": "Stipendiya hisobi",   "url_path": "/finance/scholarship", "order": 2},
                ]
            },
            {
                "key": "messages_parent",
                "label": "Xabarlar",
                "icon": "mail",
                "url_path": "#",
                "order": 50,
                "children": [
                    {"key": "my_messages",   "label": "Mening xabarlarim",   "url_path": "/messages/list",   "order": 1},
                    {"key": "create_message", "label": "Xabar yaratish",      "url_path": "/messages/create", "order": 2},
                ]
            },
            {
                "key": "system_parent",
                "label": "Tizim",
                "icon": "settings",
                "url_path": "#",
                "order": 60,
                "children": [
                    {"key": "profile",         "label": "Profil",            "url_path": "/profile",           "order": 1},
                    {"key": "hemis_survey",    "label": "Hemis so'rovnoma",  "url_path": "/system/hemis-survey", "order": 2},
                    {"key": "global_survey",   "label": "Global so'rovnoma", "url_path": "/system/global-survey","order": 3},
                    {"key": "login_history",   "label": "Kirish tarixi",     "url_path": "/system/login-history","order": 4},
                ]
            },
            {
                "key": "university_parent",
                "label": "Tuzilma",
                "icon": "layers",
                "url_path": "#",
                "order": 5,
                "children": [
                    {"key": "students", "label": "Talabalar", "url_path": "/university/students", "order": 1},
                    {"key": "groups",   "label": "Guruhlar",   "url_path": "/university/groups",   "order": 2},
                    {"key": "subjects", "label": "Fanlar",     "url_path": "/university/subjects", "order": 3},
                ]
            }
        ]

        # Clear existing to avoid duplicates if re-running
        # MenuItem.objects.all().delete() 

        for parent_data in structure:
            children = parent_data.pop("children", [])
            parent, _ = MenuItem.objects.update_or_create(
                key=parent_data["key"],
                defaults=parent_data
            )
            for child_data in children:
                child_data["parent"] = parent
                MenuItem.objects.update_or_create(
                    key=child_data["key"],
                    defaults=child_data
                )

        self.stdout.write(self.style.SUCCESS("Successfully seeded menu items"))

        # Grant permissions to student and teacher roles if they exist
        student_role = Role.objects.filter(slug="student").first()
        teacher_role = Role.objects.filter(slug="teacher").first()

        if student_role:
            for item in MenuItem.objects.all():
                RolePermission.objects.update_or_create(
                    role=student_role,
                    menu_item=item,
                    defaults={"can_view": True}
                )
        
        if teacher_role:
            for item in MenuItem.objects.all():
                RolePermission.objects.update_or_create(
                    role=teacher_role,
                    menu_item=item,
                    defaults={"can_view": True, "can_add": True, "can_edit": True}
                )
