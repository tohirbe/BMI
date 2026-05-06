import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast                      from "react-hot-toast";
import { grades, subjects, studentProfiles } from "../../api";
import { gradeTypeLabel }         from "../../utils/helpers";
import Spinner                    from "../../components/ui/Spinner";
import PageHeader                 from "../../components/ui/PageHeader";

const GRADE_TYPES = [
  { value: "joriy_1", max: 15 },
  { value: "joriy_2", max: 15 },
  { value: "oraliq",  max: 30 },
  { value: "yakuniy", max: 40 },
];

export default function GradeFormPage() {
  const navigate       = useNavigate();
  const { id }         = useParams();
  const isEdit         = Boolean(id);

  const [form, setForm] = useState({
    student: "", subject: "", grade_type: "joriy_1", score: "", date: "", note: "",
  });
  const [subList,    setSubList]    = useState([]);
  const [students,   setStudents]   = useState([]);
  const [loading,    setLoading]    = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    subjects.list().then((r) => setSubList(r.data.data ?? [])).catch(() => {});
  }, []);

  // Tanlangan fanga qarab talabalar yuklanadi
  useEffect(() => {
    if (!form.subject) { setStudents([]); return; }
    const sub = subList.find((s) => s.id === Number(form.subject));
    if (!sub?.group) return;
    studentProfiles.list({ group: sub.group })
      .then((r) => setStudents(r.data.data ?? []))
      .catch(() => {});
  }, [form.subject, subList]);

  useEffect(() => {
    if (!isEdit) return;
    grades.get(id)
      .then((r) => {
        const d = r.data.data;
        setForm({
          student:    d.student,
          subject:    d.subject,
          grade_type: d.grade_type,
          score:      d.score,
          date:       d.date,
          note:       d.note ?? "",
        });
      })
      .catch(() => toast.error("Ma'lumot yuklanmadi"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const maxScore = GRADE_TYPES.find((t) => t.value === form.grade_type)?.max ?? 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(form.score) > maxScore) {
      toast.error(`Ball ${maxScore} dan oshmasligi kerak`);
      return;
    }
    setSubmitting(true);
    try {
      if (isEdit) {
        await grades.update(id, form);
        toast.success("Yangilandi");
      } else {
        await grades.create(form);
        toast.success("Baho saqlandi");
      }
      navigate("/grades");
    } catch (err) {
      const detail = err.response?.data?.details;
      const msg    = detail?.score?.[0] ?? detail?.non_field_errors?.[0] ?? err.response?.data?.error ?? "Xato";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title={isEdit ? "Bahoni tahrirlash" : "Baho kiritish"} />

      <div style={s.card}>
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Fan *</label>
              <select required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value, student: "" })} style={s.input}>
                <option value="">Fan tanlang</option>
                {subList.map((sub) => <option key={sub.id} value={sub.id}>{sub.name} — {sub.group_name}</option>)}
              </select>
            </div>

            <div style={s.field}>
              <label style={s.label}>Talaba *</label>
              <select required value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })} style={s.input} disabled={!form.subject}>
                <option value="">Talabani tanlang</option>
                {students.map((sp) => <option key={sp.user} value={sp.user}>{sp.full_name} ({sp.student_id})</option>)}
              </select>
            </div>
          </div>

          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Nazorat turi *</label>
              <select required value={form.grade_type} onChange={(e) => setForm({ ...form, grade_type: e.target.value, score: "" })} style={s.input}>
                {GRADE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{gradeTypeLabel(t.value)} (maks {t.max})</option>
                ))}
              </select>
            </div>

            <div style={s.field}>
              <label style={s.label}>Ball * (0 – {maxScore})</label>
              <input
                type="number" required min={0} max={maxScore} step="0.5"
                value={form.score}
                onChange={(e) => setForm({ ...form, score: e.target.value })}
                style={s.input}
                placeholder={`0 – ${maxScore}`}
              />
            </div>

            <div style={s.field}>
              <label style={s.label}>Sana *</label>
              <input
                type="date" required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                style={s.input}
              />
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Izoh</label>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              style={{ ...s.input, minHeight: 80, resize: "vertical" }}
              placeholder="Ixtiyoriy..."
            />
          </div>

          <div style={s.actions}>
            <button type="button" onClick={() => navigate("/grades")} style={s.cancelBtn}>Bekor qilish</button>
            <button type="submit" disabled={submitting} style={s.submitBtn}>
              {submitting ? "Saqlanmoqda..." : isEdit ? "Yangilash" : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const s = {
  card:      { background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", maxWidth: 720 },
  form:      { display: "flex", flexDirection: "column", gap: 20 },
  row:       { display: "flex", gap: 16, flexWrap: "wrap" },
  field:     { display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 180 },
  label:     { fontSize: 13, fontWeight: 600, color: "#374151" },
  input:     { padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none", width: "100%" },
  actions:   { display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid #f1f5f9" },
  cancelBtn: { padding: "10px 24px", background: "#f1f5f9", color: "#374151", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 },
  submitBtn: { padding: "10px 28px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 },
};