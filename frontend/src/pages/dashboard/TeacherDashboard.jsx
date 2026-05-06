import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import toast                       from "react-hot-toast";
import { subjects, grades, analytics } from "../../api";
import { gradeTypeLabel }          from "../../utils/helpers";
import StatCard                    from "../../components/ui/StatCard";
import Spinner                     from "../../components/ui/Spinner";
import PageHeader                  from "../../components/ui/PageHeader";
import { useNavigate }             from "react-router-dom";

export default function TeacherDashboard() {
  const navigate               = useNavigate();
  const [subList,  setSubList] = useState([]);
  const [selSub,   setSelSub]  = useState(null);
  const [subStats, setSubStats] = useState(null);
  const [loading,  setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    subjects.list()
      .then((r) => {
        const list = r.data.data ?? [];
        setSubList(list);
        if (list.length > 0) setSelSub(list[0]);
      })
      .catch(() => toast.error("Fanlar yuklanmadi"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selSub) return;
    setStatsLoading(true);
    analytics.subject(selSub.id)
      .then((r) => setSubStats(r.data.data))
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, [selSub]);

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader
        title="O'qituvchi paneli"
        actions={
          <>
            <button onClick={() => navigate("/grades/new")} style={s.btn("#3b82f6")}>+ Baho kiritish</button>
            <button onClick={() => navigate("/grades/bulk")} style={s.btn("#8b5cf6")}>CSV yuklash</button>
            <button onClick={() => navigate("/attendance/daily")} style={s.btn("#22c55e")}>Davomat kiritish</button>
          </>
        }
      />

      {/* Fan tanlash */}
      <div style={s.subjectCards}>
        {subList.map((sub) => (
          <div
            key={sub.id}
            onClick={() => setSelSub(sub)}
            style={{
              ...s.subCard,
              borderColor: selSub?.id === sub.id ? "#3b82f6" : "#e2e8f0",
              background:  selSub?.id === sub.id ? "#eff6ff" : "#fff",
            }}
          >
            <div style={s.subName}>{sub.name}</div>
            <div style={s.subMeta}>{sub.group_name} • {sub.credit_hours} kredit</div>
          </div>
        ))}
      </div>

      {selSub && (
        <div style={s.detail}>
          <h3 style={s.detailTitle}>{selSub.name} — tahlil</h3>
          {statsLoading ? <Spinner /> : subStats && (
            <>
              <div style={s.cards}>
                <StatCard label="O'rtacha ball" value={subStats.avg_score}              color="#3b82f6" icon="📊" />
                <StatCard label="Davomat %"     value={`${subStats.attendance_pct}%`}   color="#22c55e" icon="📅" />
                <StatCard label="A'lo"          value={subStats.score_distribution.alo} color="#22c55e" icon="🏆" />
                <StatCard label="Qoniqarsiz"    value={subStats.score_distribution.qoniqarsiz} color="#ef4444" icon="⚠️" />
              </div>

              {subStats.dynamics?.length > 0 && (
                <div style={s.chartBox}>
                  <h4 style={s.chartTitle}>Ball dinamikasi</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={subStats.dynamics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="avg_score" name="O'rtacha ball" fill="#3b82f6" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

const s = {
  btn: (bg) => ({
    padding: "8px 16px", background: bg, color: "#fff",
    border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500,
  }),
  subjectCards: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 },
  subCard: {
    padding: "14px 18px", borderRadius: 10, border: "2px solid",
    cursor: "pointer", minWidth: 180, transition: "all 0.15s",
  },
  subName: { fontWeight: 600, fontSize: 14, color: "#1e293b" },
  subMeta: { fontSize: 12, color: "#64748b", marginTop: 4 },
  detail:  { background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  detailTitle: { fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#1e293b" },
  cards:   { display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" },
  chartBox: { marginTop: 16 },
  chartTitle: { fontSize: 14, fontWeight: 600, color: "#334155", marginBottom: 12 },
};