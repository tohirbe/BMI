import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import toast                   from "react-hot-toast";
import { notifications, faculties, departments, groups, users } from "../../api";
import { useSelector }         from "react-redux";
import { selectUser }          from "../../store/authSlice";
import PageHeader              from "../../components/ui/PageHeader";

const LEVELS = [
  { value: "university", label: "Universitet (barchaga)",  roles: ["superuser","rector"] },
  { value: "faculty",    label: "Fakultet",                roles: ["superuser","rector","dean"] },
  { value: "department", label: "Kafedra",                 roles: ["superuser","rector","dean","head","vice_head"] },
  { value: "group",      label: "Guruh",                   roles: ["superuser","rector","dean","head","vice_head","teacher"] },
  { value: "personal",   label: "Shaxsiy",                 roles: ["superuser","rector","dean","head","vice_head","teacher","student"] },
];

export default function NotifCompose() {
  const navigate     = useNavigate();
  const currentUser  = useSelector(selectUser);

  const [form, setForm] = useState({ title: "", body: "", level: "", target_faculty: "", target_department: "", target_group: "", target_user: "" });
  const [facList,  setFacList]  = useState([]);
  const [deptList, setDeptList] = useState([]);
  const [grpList,  setGrpList]  = useState([]);
  const [userList, setUserList] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const availableLevels = LEVELS.filter((l) =>
    currentUser?.role === "superuser" || l.roles.includes(currentUser?.role)
  );

  useEffect(() => {
    if (form.level === "faculty")    faculties.list().then((r)   => setFacList(r.data.data ?? [])).catch(() => {});
    if (form.level === "department") departments.list().then((r) => setDeptList(r.data.data ?? [])).catch(() => {});
    if (form.level === "group")      groups.list().then((r)      => setGrpList(r.data.data ?? [])).catch(() => {});
    if (form.level === "personal")   users.list().then((r)       => setUserList(r.data.results ?? [])).catch(() => {});
  }, [form.level]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = { title: form.title, body: form.body, level: form.level };
    if (form.level === "faculty"    && form.target_faculty)    payload.target_faculty    = form.target_faculty;
    if (form.level === "department" && form.target_department) payload.target_department = form.target_department;
    if (form.level === "group"      && form.target_group)      payload.target_group      = form.target_group;
    if (form.level === "personal"   && form.target_user)       payload.target_user       = form.target_user;

    try {
      await notifications.create(payload);
      toast.success("Xabarnoma yuborildi");
      navigate("/notifications");
    } catch (err) {
      const details = err.response?.data?.details;
      const msg     = details
        ? Object.values(details).flat()[0]
        : err.response?.data?.error ?? "Xato yuz berdi";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Xabarnoma yuborish" />

      <div style={s.card}>
        <form onSubmit={handleSubmit} style={s.form}>
          {/* Level */}
          <div style={s.field}>
            <label style={s.label}>Yuborish darajasi *</label>
            <div style={s.levelGrid}>
              {availableLevels.map((l) => (
                <div
                  key={l.value}
                  onClick={() => set("level", l.value)}
                  style={{
                    ...s.levelCard,
                    borderColor: form.level === l.value ? "#3b82f6" : "#e2e8f0",
                    background:  form.level === l.value ? "#eff6ff" : "#fff",
                  }}
                >
                  <div style={s.levelLabel}>{l.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Maqsad */}
          {form.level === "faculty" && (
            <div style={s.field}>
              <label style={s.label}>Fakultet *</label>
              <select required value={form.target_faculty} onChange={(e) => set("target_faculty", e.target.value)} style={s.select}>
                <option value="">Fakultet tanlang</option>
                {facList.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
          )}
          {form.level === "department" && (
            <div style={s.field}>
              <label style={s.label}>Kafedra *</label>
              <select required value={form.target_department} onChange={(e) => set("target_department", e.target.value)} style={s.select}>
                <option value="">Kafedra tanlang</option>
                {deptList.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          )}
          {form.level === "group" && (
            <div style={s.field}>
              <label style={s.label}>Guruh *</label>
              <select required value={form.target_group} onChange={(e) => set("target_group", e.target.value)} style={s.select}>
                <option value="">Guruh tanlang</option>
                {grpList.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
          )}
          {form.level === "personal" && (
            <div style={s.field}>
              <label style={s.label}>Foydalanuvchi *</label>
              <select required value={form.target_user} onChange={(e) => set("target_user", e.target.value)} style={s.select}>
                <option value="">Foydalanuvchi tanlang</option>
                {userList.map((u) => <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>)}
              </select>
            </div>
          )}

          {/* Sarlavha */}
          <div style={s.field}>
            <label style={s.label}>Sarlavha *</label>
            <input
              required maxLength={200}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Xabarnoma sarlavhasi"
              style={s.input}
            />
          </div>

          {/* Matn */}
          <div style={s.field}>
            <label style={s.label}>Matn *</label>
            <textarea
              required
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              placeholder="Xabarnoma matni..."
              rows={6}
              style={{ ...s.input, resize: "vertical" }}
            />
          </div>

          <div style={s.actions}>
            <button type="button" onClick={() => navigate("/notifications")} style={s.cancelBtn}>Bekor qilish</button>
            <button type="submit" disabled={submitting || !form.level} style={s.submitBtn}>
              {submitting ? "Yuborilmoqda..." : "Yuborish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const s = {
  card:       { background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", maxWidth: 680 },
  form:       { display: "flex", flexDirection: "column", gap: 20 },
  field:      { display: "flex", flexDirection: "column", gap: 8 },
  label:      { fontSize: 13, fontWeight: 600, color: "#374151" },
  levelGrid:  { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 },
  levelCard:  { padding: "12px 16px", borderRadius: 10, border: "2px solid", cursor: "pointer", transition: "all 0.15s" },
  levelLabel: { fontSize: 13, fontWeight: 600, color: "#1e293b" },
  select:     { padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14 },
  input:      { padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none", width: "100%" },
  actions:    { display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid #f1f5f9" },
  cancelBtn:  { padding: "10px 24px", background: "#f1f5f9", color: "#374151", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 },
  submitBtn:  { padding: "10px 28px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 },
};