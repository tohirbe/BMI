import pandas as pd
from decimal import Decimal, InvalidOperation
from apps.university.models import StudentProfile
from .models import Grade, Attendance


def parse_grades_file(file, subject):
    """
    CSV/Excel faylni o'qib, (preview_rows, errors) qaytaradi.
    errors = [{ row, field, message }]
    """
    errors  = []
    preview = []

    try:
        if file.name.endswith(".csv"):
            df = pd.read_csv(file)
        else:
            df = pd.read_excel(file)
    except Exception as e:
        return [], [{"row": 0, "field": "file", "message": f"Faylni o'qib bo'lmadi: {e}"}]

    required = {"student_id", "grade_type", "score", "date"}
    missing  = required - set(df.columns.str.strip())
    if missing:
        return [], [{"row": 0, "field": "columns", "message": f"Ustunlar yo'q: {missing}"}]

    df.columns = df.columns.str.strip()

    for i, row in df.iterrows():
        row_num = i + 2
        student_id = str(row.get("student_id", "")).strip()
        grade_type = str(row.get("grade_type", "")).strip()
        score_raw  = row.get("score")
        date_raw   = row.get("date")

        try:
            profile = StudentProfile.objects.get(student_id=student_id)
        except StudentProfile.DoesNotExist:
            errors.append({"row": row_num, "field": "student_id", "message": f"'{student_id}' topilmadi"})
            continue

        if grade_type not in Grade.MAX_SCORES:
            errors.append({"row": row_num, "field": "grade_type", "message": f"Noto'g'ri tur: '{grade_type}'"})
            continue

        try:
            score = Decimal(str(score_raw))
        except InvalidOperation:
            errors.append({"row": row_num, "field": "score", "message": f"Ball son emas: '{score_raw}'"})
            continue

        max_score = Grade.MAX_SCORES[grade_type]
        if score < 0 or score > max_score:
            errors.append({
                "row": row_num, "field": "score",
                "message": f"{grade_type} uchun ball 0–{max_score} orasida bo'lishi kerak (berilgan: {score})"
            })
            continue

        try:
            date = pd.to_datetime(date_raw).date()
        except Exception:
            errors.append({"row": row_num, "field": "date", "message": f"Sana noto'g'ri: '{date_raw}'"})
            continue

        preview.append({
            "student_id": student_id,
            "student":    profile.user,
            "grade_type": grade_type,
            "score":      score,
            "date":       date,
        })

    return preview, errors


def save_grades_bulk(preview_rows, subject, entered_by):
    saved = 0
    for row in preview_rows:
        Grade.objects.update_or_create(
            student    = row["student"],
            subject    = subject,
            grade_type = row["grade_type"],
            defaults   = {
                "score":      row["score"],
                "date":       row["date"],
                "entered_by": entered_by,
            },
        )
        saved += 1
    return saved


def parse_attendance_file(file, subject):
    errors  = []
    preview = []

    try:
        if file.name.endswith(".csv"):
            df = pd.read_csv(file)
        else:
            df = pd.read_excel(file)
    except Exception as e:
        return [], [{"row": 0, "field": "file", "message": f"Faylni o'qib bo'lmadi: {e}"}]

    required = {"student_id", "date", "status"}
    missing  = required - set(df.columns.str.strip())
    if missing:
        return [], [{"row": 0, "field": "columns", "message": f"Ustunlar yo'q: {missing}"}]

    df.columns = df.columns.str.strip()
    valid_statuses = {s[0] for s in Attendance.Status.choices}

    for i, row in df.iterrows():
        row_num    = i + 2
        student_id = str(row.get("student_id", "")).strip()
        status     = str(row.get("status", "")).strip()
        date_raw   = row.get("date")

        try:
            profile = StudentProfile.objects.get(student_id=student_id)
        except StudentProfile.DoesNotExist:
            errors.append({"row": row_num, "field": "student_id", "message": f"'{student_id}' topilmadi"})
            continue

        if status not in valid_statuses:
            errors.append({
                "row": row_num, "field": "status",
                "message": f"Noto'g'ri holat: '{status}'. To'g'rilari: {valid_statuses}"
            })
            continue

        try:
            date = pd.to_datetime(date_raw).date()
        except Exception:
            errors.append({"row": row_num, "field": "date", "message": f"Sana noto'g'ri: '{date_raw}'"})
            continue

        preview.append({
            "student_id": student_id,
            "student":    profile.user,
            "date":       date,
            "status":     status,
        })

    return preview, errors


def save_attendance_bulk(preview_rows, subject, entered_by):
    saved = 0
    for row in preview_rows:
        Attendance.objects.update_or_create(
            student = row["student"],
            subject = subject,
            date    = row["date"],
            defaults = {
                "status":     row["status"],
                "entered_by": entered_by,
            },
        )
        saved += 1
    return saved