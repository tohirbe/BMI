export const ROLE_DASHBOARD = {
  superuser: "/dashboard/rector",
  rector:    "/dashboard/rector",
  dean:      "/dashboard/dean",
  head:      "/dashboard/head",
  vice_head: "/dashboard/head",
  teacher:   "/dashboard/teacher",
  student:   "/dashboard/student",
};

export function getDashboardPath(role) {
  return ROLE_DASHBOARD[role] ?? "/dashboard";
}

export function letterGradeColor(grade) {
  const map = {
    "A'lo":        "#22c55e",
    "Excellent":   "#22c55e",
    "Yaxshi":      "#3b82f6",
    "Good":        "#3b82f6",
    "Qoniqarli":   "#f59e0b",
    "Satisfactory":"#f59e0b",
    "Qoniqarsiz":  "#ef4444",
    "Fail":        "#ef4444",
  };
  return map[grade] ?? "#6b7280";
}

export function getGradeLabel(score) {
  if (score >= 86) return "A'lo (Excellent)";
  if (score >= 71) return "Yaxshi (Good)";
  if (score >= 56) return "Qoniqarli (Satisfactory)";
  return "Qoniqarsiz (Fail)";
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("uz-UZ");
}

export function gradeTypeLabel(type) {
  const map = {
    joriy_1: "Joriy 1",
    joriy_2: "Joriy 2",
    oraliq:  "Oraliq",
    yakuniy: "Yakuniy",
  };
  return map[type] ?? type;
}

export function statusLabel(status) {
  const map = {
    present: "Keldi",
    absent:  "Kelmadi",
    excused: "Uzrli",
    late:    "Kech keldi",
  };
  return map[status] ?? status;
}

export function statusColor(status) {
  const map = {
    present: "#22c55e",
    absent:  "#ef4444",
    excused: "#f59e0b",
    late:    "#3b82f6",
  };
  return map[status] ?? "#6b7280";
}