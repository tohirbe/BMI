import { useState, useEffect } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { useSelector }         from "react-redux";
import toast                   from "react-hot-toast";
import { analytics }           from "../../api";
import { selectUser }          from "../../store/authSlice";
import { letterGradeColor }    from "../../utils/helpers";
import Spinner                 from "../../components/ui/Spinner";
import PageHeader              from "../../components/ui/PageHeader";

export default function StudentDashboard() {
  const user             = useSelector(selectUser);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    analytics.student(user.id)
      .then((r) => setStats(r.data.data))
      .catch(() => toast.error("Ma'lumot yuklanmadi"))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <Spinner />;
  if (!stats)  return <p style={{ color: "#64748b" }}>Ma'lumot topilmadi</p>;

  const radarData = stats.subjects.map((s) => ({
    subject: s.subject_name.length > 12 ? s.subject_name.slice(0, 12) + "…" : s.subject_name,
    ball:    s.total,
  }));

  return (
    <div>
      <PageHeader title="Mening ko'rsatkichlarim" subtitle={stats.full_name} />

      {/* Har bir fan kartochkasi */}
      <div style={s.grid}>
        {stats.subjects.map((sub) => (
          <div key={sub.subject_id} style={{ ...s.card, borderTop: `4px solid ${letterGradeColor(sub.letter_grade)}` }}>
            <div style={s.subName}>{sub.subject_name}</div>
            <div style={s.badge(letterGradeColor(sub.letter_grade))}>{sub.letter_grade}</div>

            <div style={s.scores}>
              {[
                ["Joriy 1",  sub.joriy_1,  15],
                ["Joriy 2",  sub.joriy_2,  15],
                ["Oraliq",   sub.oraliq,   30],
                ["Yakuniy",  sub.yakuniy,  40],
              ].map(([lbl, val, max]) => (
                <div key={lbl} style={s.scoreRow}>
                  <span style={s.scoreLabel}>{lbl}</span>
                  <div style={s.progressWrap}>
                    <div style={{ ...s.progress, width: `${((val ?? 0) / max) * 100}%` }} />
                  </div>
                  <span style={s.scoreVal}>{val ?? "—"}/{max}</span>
                </div>
              ))}
            </div>

            <div style={s.totalRow}>
              <span>Jami</span>
              <strong style={{ color: letterGradeColor(sub.letter_grade) }}>{sub.total}/100</strong>
            </div>

            <div style={s.attendance}>
              Davomat: <strong>{sub.attendance_pct}%</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Radar chart */}
      {radarData.length > 2 && (
        <div style={s.radarBox}>
          <h3 style={s.radarTitle}>Fanlar bo'yicha solishtirma</h3>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar dataKey="ball" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

const s = {
  grid:       { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 24 },
  card:       { background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  subName:    { fontWeight: 700, fontSize: 14, color: "#1e293b", marginBottom: 8 },
  badge:      (color) => ({
    display: "inline-block", padding: "2px 10px", borderRadius: 99,
    background: color + "20", color, fontSize: 12, fontWeight: 600, marginBottom: 12,
  }),
  scores:     { display: "flex", flexDirection: "column", gap: 6 },
  scoreRow:   { display: "flex", alignItems: "center", gap: 8 },
  scoreLabel: { fontSize: 11, color: "#64748b", width: 54, flexShrink: 0 },
  progressWrap: { flex: 1, height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" },
  progress:   { height: "100%", background: "#3b82f6", borderRadius: 3, transition: "width 0.4s" },
  scoreVal:   { fontSize: 11, color: "#374151", width: 40, textAlign: "right", flexShrink: 0 },
  totalRow:   { display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 14, borderTop: "1px solid #f1f5f9", paddingTop: 10 },
  attendance: { fontSize: 12, color: "#64748b", marginTop: 6 },
  radarBox:   { background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  radarTitle: { fontSize: 15, fontWeight: 600, marginBottom: 12, color: "#1e293b" },
};