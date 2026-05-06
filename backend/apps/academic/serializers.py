from rest_framework import serializers
from .models import Subject, Grade, Attendance


class SubjectSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name",      read_only=True)
    teacher_name    = serializers.CharField(source="teacher.full_name",    read_only=True, default=None)
    group_name      = serializers.CharField(source="group.name",           read_only=True)

    class Meta:
        model  = Subject
        fields = (
            "id", "name", "short_name",
            "department", "department_name",
            "teacher", "teacher_name",
            "group", "group_name",
            "credit_hours",
        )


class SubjectWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Subject
        fields = ("name", "short_name", "department", "teacher", "group", "credit_hours")


class GradeSerializer(serializers.ModelSerializer):
    student_name   = serializers.CharField(source="student.full_name",    read_only=True)
    subject_name   = serializers.CharField(source="subject.name",         read_only=True)
    entered_by_name = serializers.CharField(source="entered_by.full_name", read_only=True, default=None)
    letter_grade   = serializers.SerializerMethodField()

    class Meta:
        model  = Grade
        fields = (
            "id",
            "student", "student_name",
            "subject", "subject_name",
            "grade_type", "score", "date",
            "entered_by", "entered_by_name",
            "note", "letter_grade",
        )
        read_only_fields = ("entered_by",)

    def get_letter_grade(self, obj):
        total = Grade.get_total_score(obj.student, obj.subject)
        return Grade.get_letter_grade(total)


class GradeWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Grade
        fields = ("student", "subject", "grade_type", "score", "date", "note")

    def validate(self, attrs):
        grade_type = attrs.get("grade_type")
        score      = attrs.get("score")
        max_score  = Grade.MAX_SCORES.get(grade_type, 0)
        if score is not None and (score < 0 or score > max_score):
            raise serializers.ValidationError(
                {"score": f"{grade_type} uchun ball 0–{max_score} orasida bo'lishi kerak"}
            )
        return attrs

    def validate_subject(self, value):
        request = self.context.get("request")
        if request and request.user.role == "teacher":
            if value.teacher != request.user:
                raise serializers.ValidationError("Bu fan sizga tegishli emas")
        return value


class AttendanceSerializer(serializers.ModelSerializer):
    student_name    = serializers.CharField(source="student.full_name",    read_only=True)
    subject_name    = serializers.CharField(source="subject.name",         read_only=True)
    entered_by_name = serializers.CharField(source="entered_by.full_name", read_only=True, default=None)

    class Meta:
        model  = Attendance
        fields = (
            "id",
            "student", "student_name",
            "subject", "subject_name",
            "date", "status",
            "entered_by", "entered_by_name",
            "note",
        )
        read_only_fields = ("entered_by",)


class AttendanceWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Attendance
        fields = ("student", "subject", "date", "status", "note")

    def validate_subject(self, value):
        request = self.context.get("request")
        if request and request.user.role == "teacher":
            if value.teacher != request.user:
                raise serializers.ValidationError("Bu fan sizga tegishli emas")
        return value


class BulkGradeRowSerializer(serializers.Serializer):
    student_id = serializers.CharField()
    grade_type = serializers.ChoiceField(choices=Grade.GradeType.choices)
    score      = serializers.DecimalField(max_digits=5, decimal_places=2)
    date       = serializers.DateField()


class BulkAttendanceRowSerializer(serializers.Serializer):
    student_id = serializers.CharField()
    date       = serializers.DateField()
    status     = serializers.ChoiceField(choices=Attendance.Status.choices)