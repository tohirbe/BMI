import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import toast                   from "react-hot-toast";
import { attendance, subjects, studentProfiles } from "../../api";
import { statusLabel, statusColor } from "../../utils/helpers";
import Spinner                 from "../../components/ui/Spinner";
import PageHeader              from "../../components/ui/PageHeader";

const STATUSES = ["present","absent","excused","late"];

export default function AttendanceDailyPage() {
  const navigate             = useNavigate();
  const [subList,  setSubList]  = useState([]);
  const [subId,    setSubId]    = useState("");
  const [date,     setDate]     = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [grid,     setGrid]     = useState({}); // { userId: status }
  const [existing, setExisting] = useState({}); // { userId: attendanceId }
  const [loading,  setLoading]  = useState(false);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    subjects.list().then((r) => setSubList(r.data.data ?? [])).catch(() => {});
  }, []);

  // Fan yoki sana o'zgarganda talabalar va mavjud davomat yuklanadi
  useEffect(() => {
    if (!subId) return;
    const sub = subList.find((s) => s.id === Number(subId));
    if (!sub?.group) return;

    setLoading(true);
    Promise.all([
      studentProfiles.list({ group: sub.group }),
      attendance.list({ subject: subId, date }),
    ])
      .then(([spRes, attRes]) => {
        const spList  = spRes.data.data ?? [];
        const attList = attRes.data.results ?? [];

        setStudents(spList);

        const gridInit = {};
        const existInit = {};
        spList.forEach((sp) => { gridInit[sp.user] = "present"; });
        attList.forEach((a)  => {
          gridInit[a.student]   = a.status;
          existInit[a.student]  = a.id;
        });
        setGrid(gridInit);
        setExisting(existInit);
      })
      .catch(() => toast.error("Ma'lumot yuklanmadi"))
      .finally(() => setLoading(false));
  }, [subId, date, subList]);

  const setStatus = (userId, status) => setGrid((g) => ({ ...g, [userId]: status }));

  const handleSave = async () => {
    if (!subId) { toast.error("Fan tanlang"); return; }
    if (students.length === 0) { toast.error("Talabalar topilmadi"); return; }

    setSaving(true);
    const entries = Object.entries(grid);
    let saved = 0, errors = 0;

    for (const [userId, status] of entries) {
      try {
        if (existing[userId]) {
          await attendance.update(existing[userId], { status });
        } else {
          await attendance.create({ student: userId, subject: subId, date, status });
        }
        saved++;
      } catch {
        errors++;
      }
    }
    setSaving(false);

    if (errors === 0) {
      toast.success(`${saved} ta davomat saqlandi`);
      navigate("/attendance");
    } else {
      toast.error(`${errors} ta yozuvda xato yuz berdi`);
    }
  };

  return (
    <div>
      <PageHeader title="Kunlik davomat kiritish" />

      <div style={s.topBar}>
        <div style={s.field}>
          <label style={s.label}>Fan *</label>
          <select value={subId} onChange={(e) => setSubId(e.target.value)} style={s.select}>
            <option value="">Fan tanlang</option>
            {subList.map((sub) => <option key={sub.id} value={sub.id}>{sub.name} — {sub.group_name}</option>)}
          </select>
        </div>
        <div style={s.field}>
          <label style={s.label}>Sana *</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={s.select} />
        </div>
      </div>

      {loading ? <Spinner /> : subId && students.length > 0 && (
        <div style={s.card}>
          <div style={s.legend}>
            {STATUSES.map((st) => (
              <span key={st} style={s.legendItem(statusColor(st))}>{statusLabel(st)}</span>
            ))}
          </div>

          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>#</th>
                <th style={s.th}>Talaba</th>
                <th style={s.th}>ID</th>
                {STATUSES.map((st) => (
                  <th key={st} style={{ ...s.th, textAlign: "center" }}>
                    <span style={s.legendItem(statusColor(st))}>{statusLabel(st)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((sp, i) => (
                <tr key={sp.user} style={{ ...s.tr, background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                  <td style={s.td}>{i + 1}</td>
                  <td style={{ ...s.td, fontWeight: 500 }}>{sp.full_name}</td>
                  <td style={{ ...s.td, color: "#64748b" }}>{sp.student_id}</td>
                  {STATUSES.map((st) => (
                    <td key={st} style={{ ...s.td, textAlign: "center" }}>
                      <input
                        type="radio"
                        name={`att-${sp.user}`}
                        value={st}
                        checked={grid[sp.user] === st}
                        onChange={() => setStatus(sp.user, st)}
                        style={{ cursor: "pointer", accentColor: statusColor(st), width: 18, height: 18 }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tezkor belgilash */}
          <div style={s.quickActions}>
            <span style={{ fontSize: 13, color: "#64748b" }}>Barchasi:</span>
            {STATUSES.map((st) => (
              <button
                key={st}
                onClick={() => setGrid(Object.fromEntries(students.map((sp) => [sp.user, st])))}
                style={s.quickBtn(statusColor(st))}
              >
                {statusLabel(st)}
              </button>
            ))}
          </div>

          <div style={s.footer}>
            <button onClick={() => navigate("/attendance")} style={s.cancelBtn}>Bekor qilish</button>
            <button onClick={handleSave} disabled={saving} style={s.saveBtn}>
              {saving ? "Saqlanmoqda..." : `✓ ${students.length} ta talabani saqlash`}
            </button>
          </div>
        </div>
      )}

      {subId && !loading && students.length === 0 && (
        <p style={{ color: "#94a3b8", marginTop: 24 }}>Bu fanda talabalar topilmadi</p>
      )}
    </div>
  );
}

const s = {
  topBar:     { display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" },
  field:      { display: "flex", flexDirection: "column", gap: 6 },
  label:      { fontSize: 13, fontWeight: 600, color: "#374151" },
  select:     { padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, minWidth: 220 },
  card:       { background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  legend:     { display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" },
  legendItem: (color) => ({ padding: "3px 12px", borderRadius: 99, background: color + "20", color, fontSize: 12, fontWeight: 600 }),
  table:      { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th:         { padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "2px solid #e2e8f0", background: "#f8fafc", whiteSpace: "nowrap" },
  tr:         { borderBottom: "1px solid #f1f5f9" },
  td:         { padding: "9px 14px", color: "#374151", verticalAlign: "middle" },
  quickActions:{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, padding: "12px 0", borderTop: "1px solid #f1f5f9" },
  quickBtn:   (color) => ({ padding: "5px 14px", background: color + "20", color, border: `1px solid ${color}40`, borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }),
  footer:     { display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 20, paddingTop: 16, borderTop: "1px solid #f1f5f9" },
  cancelBtn:  { padding: "10px 24px", background: "#f1f5f9", color: "#374151", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 },
  saveBtn:    { padding: "10px 28px", background: "#22c55e", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 },
};