from django.db.models import Avg, Sum, Count, Q
from apps.academic.models import Grade, Attendance, Subject
from apps.university.models import Group, Faculty, Department, StudentProfile


def _score_distribution(grades_qs):
    """Grade queryset dan A'lo/Yaxshi/Qoniqarli/Qoniqarsiz taqsimotini hisoblaydi."""
    dist = {"alo": 0, "yaxshi": 0, "qoniqarli": 0, "qoniqarsiz": 0}

    student_subject_pairs = (
        grades_qs.values("student", "subject").distinct()
    )
    for pair in student_subject_pairs:
        total = grades_qs.filter(
            student_id=pair["student"], subject_id=pair["subject"]
        ).aggregate(t=Sum("score"))["t"] or 0
        total = float(total)
        if total >= 86:
            dist["alo"] += 1
        elif total >= 71:
            dist["yaxshi"] += 1
        elif total >= 56:
            dist["qoniqarli"] += 1
        else:
            dist["qoniqarsiz"] += 1
    return dist


def _attendance_pct(attendance_qs):
    total   = attendance_qs.count()
    if total == 0:
        return 0.0
    present = attendance_qs.filter(status__in=["present", "late"]).count()
    return round(present / total * 100, 1)


def _avg_score(grades_qs):
    result = grades_qs.aggregate(avg=Avg("score"))["avg"]
    return round(float(result), 2) if result else 0.0


def _apply_filters(subjects_qs, academic_year=None, semester=None):
    if academic_year:
        subjects_qs = subjects_qs.filter(group__academic_year__name=academic_year)
    if semester:
        subjects_qs = subjects_qs.filter(group__semester=semester)
    return subjects_qs


# ── University ────────────────────────────────────────────────────────────────

def university_stats(academic_year=None, semester=None):
    subjects = _apply_filters(Subject.objects.all(), academic_year, semester)
    grades   = Grade.objects.filter(subject__in=subjects)
    attends  = Attendance.objects.filter(subject__in=subjects)

    total_students = StudentProfile.objects.count()
    from apps.users.models import User
    total_teachers = User.objects.filter(role="teacher", is_active=True).count()

    return {
        "total_students":      total_students,
        "total_teachers":      total_teachers,
        "avg_score":           _avg_score(grades),
        "attendance_pct":      _attendance_pct(attends),
        "score_distribution":  _score_distribution(grades),
    }


# ── Faculty ───────────────────────────────────────────────────────────────────

def faculty_stats(faculty, academic_year=None, semester=None):
    subjects = _apply_filters(
        Subject.objects.filter(department__faculty=faculty), academic_year, semester
    )
    grades  = Grade.objects.filter(subject__in=subjects)
    attends = Attendance.objects.filter(subject__in=subjects)

    departments = Department.objects.filter(faculty=faculty)
    dept_breakdown = []
    for dept in departments:
        dept_subjects = subjects.filter(department=dept)
        dept_grades   = grades.filter(subject__in=dept_subjects)
        dept_attends  = attends.filter(subject__in=dept_subjects)
        dept_breakdown.append({
            "id":             dept.id,
            "name":           dept.name,
            "avg_score":      _avg_score(dept_grades),
            "attendance_pct": _attendance_pct(dept_attends),
            "student_count":  StudentProfile.objects.filter(
                group__department=dept
            ).count(),
        })

    return {
        "faculty_id":         faculty.id,
        "faculty_name":       faculty.name,
        "avg_score":          _avg_score(grades),
        "attendance_pct":     _attendance_pct(attends),
        "score_distribution": _score_distribution(grades),
        "department_breakdown": dept_breakdown,
    }


# ── Department ────────────────────────────────────────────────────────────────

def department_stats(department, academic_year=None, semester=None):
    subjects = _apply_filters(
        Subject.objects.filter(department=department), academic_year, semester
    )
    grades  = Grade.objects.filter(subject__in=subjects)
    attends = Attendance.objects.filter(subject__in=subjects)

    groups = Group.objects.filter(department=department)
    if academic_year:
        groups = groups.filter(academic_year__name=academic_year)
    if semester:
        groups = groups.filter(semester=semester)

    group_breakdown = []
    for group in groups:
        g_subjects = subjects.filter(group=group)
        g_grades   = grades.filter(subject__in=g_subjects)
        g_attends  = attends.filter(subject__in=g_subjects)
        group_breakdown.append({
            "id":             group.id,
            "name":           group.name,
            "avg_score":      _avg_score(g_grades),
            "attendance_pct": _attendance_pct(g_attends),
            "student_count":  group.students.count(),
        })

    return {
        "department_id":      department.id,
        "department_name":    department.name,
        "avg_score":          _avg_score(grades),
        "attendance_pct":     _attendance_pct(attends),
        "score_distribution": _score_distribution(grades),
        "group_breakdown":    group_breakdown,
    }


# ── Group ─────────────────────────────────────────────────────────────────────

def group_stats(group, academic_year=None, semester=None):
    subjects = _apply_filters(
        Subject.objects.filter(group=group), academic_year, semester
    )
    grades  = Grade.objects.filter(subject__in=subjects)
    attends = Attendance.objects.filter(subject__in=subjects)

    students = StudentProfile.objects.filter(group=group).select_related("user")
    student_summary = []
    for sp in students:
        s_grades  = grades.filter(student=sp.user)
        s_attends = attends.filter(student=sp.user)
        total     = float(s_grades.aggregate(t=Sum("score"))["t"] or 0)
        student_summary.append({
            "student_id":     sp.student_id,
            "full_name":      sp.user.full_name,
            "avg_score":      round(total, 2),
            "letter_grade":   Grade.get_letter_grade(total),
            "attendance_pct": _attendance_pct(s_attends),
        })

    return {
        "group_id":           group.id,
        "group_name":         group.name,
        "avg_score":          _avg_score(grades),
        "attendance_pct":     _attendance_pct(attends),
        "score_distribution": _score_distribution(grades),
        "students":           student_summary,
    }


# ── Subject ───────────────────────────────────────────────────────────────────

def subject_stats(subject):
    grades  = Grade.objects.filter(subject=subject)
    attends = Attendance.objects.filter(subject=subject)

    # Dinamika: sanaga qarab o'rtacha ball
    dynamics = (
        grades.values("date")
        .annotate(avg=Avg("score"))
        .order_by("date")
    )
    dynamics_data = [
        {"date": str(d["date"]), "avg_score": round(float(d["avg"]), 2)}
        for d in dynamics
    ]

    return {
        "subject_id":         subject.id,
        "subject_name":       subject.name,
        "avg_score":          _avg_score(grades),
        "attendance_pct":     _attendance_pct(attends),
        "score_distribution": _score_distribution(grades),
        "dynamics":           dynamics_data,
    }


# ── Student ───────────────────────────────────────────────────────────────────

def student_stats(student, academic_year=None, semester=None):
    subjects = Subject.objects.filter(
        grades__student=student
    ).distinct()

    if academic_year:
        subjects = subjects.filter(group__academic_year__name=academic_year)
    if semester:
        subjects = subjects.filter(group__semester=semester)

    subject_data = []
    for subj in subjects:
        subj_grades = Grade.objects.filter(student=student, subject=subj)
        scores = {g.grade_type: float(g.score) for g in subj_grades}
        total  = sum(scores.values())
        att_pct = Attendance.get_attendance_percent(student, subj)
        subject_data.append({
            "subject_id":    subj.id,
            "subject_name":  subj.name,
            "joriy_1":       scores.get("joriy_1", None),
            "joriy_2":       scores.get("joriy_2", None),
            "oraliq":        scores.get("oraliq",  None),
            "yakuniy":       scores.get("yakuniy", None),
            "total":         round(total, 2),
            "letter_grade":  Grade.get_letter_grade(total),
            "attendance_pct": att_pct,
        })

    # Semestr dinamikasi — semestrga qarab o'rtacha jami ball
    all_grades = Grade.objects.filter(student=student, subject__in=subjects)
    semester_dynamics = (
        all_grades
        .values("subject__group__semester")
        .annotate(avg=Avg("score"))
        .order_by("subject__group__semester")
    )
    dynamics_data = [
        {"semester": d["subject__group__semester"], "avg_score": round(float(d["avg"]), 2)}
        for d in semester_dynamics
    ]

    return {
        "student_id":  student.id,
        "full_name":   student.full_name,
        "subjects":    subject_data,
        "dynamics":    dynamics_data,
    }