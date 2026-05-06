from apps.users.models import User


def get_notification_recipients(notification):
    """
    Notification level ga qarab tegishli foydalanuvchilarni qaytaradi.
    """
    level = notification.level

    if level == "university":
        return User.objects.filter(is_active=True).exclude(pk=notification.sender.pk)

    if level == "faculty" and notification.target_faculty:
        faculty = notification.target_faculty
        return User.objects.filter(
            is_active=True,
            teacher_profile__department__faculty=faculty,
        ) | User.objects.filter(
            is_active=True,
            student_profile__group__department__faculty=faculty,
        )

    if level == "department" and notification.target_department:
        dept = notification.target_department
        return User.objects.filter(
            is_active=True,
            teacher_profile__department=dept,
        ) | User.objects.filter(
            is_active=True,
            student_profile__group__department=dept,
        )

    if level == "group" and notification.target_group:
        group = notification.target_group
        return User.objects.filter(
            is_active=True,
            student_profile__group=group,
        )

    if level == "personal" and notification.target_user:
        return User.objects.filter(pk=notification.target_user.pk)

    return User.objects.none()


def can_send_notification(sender, level, target_faculty=None, target_department=None,
                           target_group=None, target_user=None):
    """
    Yuboruvchi o'z doirasida yuborayotganligini tekshiradi.
    True/False qaytaradi.
    """
    role = sender.role

    if sender.is_superuser or role == "rector":
        return True

    if role == "dean":
        if level == "university":
            return False
        if level == "faculty":
            try:
                return target_faculty == sender.dean_of_faculty
            except Exception:
                return False
        if level in ("department", "group", "personal"):
            if target_department:
                try:
                    return target_department.faculty == sender.dean_of_faculty
                except Exception:
                    return False
            return True

    if role in ("head", "vice_head"):
        if level in ("university", "faculty"):
            return False
        if level == "department":
            try:
                dept = sender.head_of_department if role == "head" else sender.vice_head_of_department
                return target_department == dept
            except Exception:
                return False
        if level == "group":
            try:
                dept = sender.head_of_department if role == "head" else sender.vice_head_of_department
                return target_group and target_group.department == dept
            except Exception:
                return False
        if level == "personal":
            return True

    if role == "teacher":
        if level in ("university", "faculty", "department"):
            return False
        if level == "group":
            from apps.academic.models import Subject
            return Subject.objects.filter(teacher=sender, group=target_group).exists()
        if level == "personal":
            return True

    if role == "student":
        if level != "personal":
            return False
        return True

    return False