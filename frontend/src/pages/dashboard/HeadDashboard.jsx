import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import toast                   from "react-hot-toast";
import { analytics, departments } from "../../api";
import StatCard                from "../../components/ui/StatCard";
import Spinner                 from "../../components/ui/Spinner";
import FilterBar               from "../../components/ui/FilterBar";
import PageHeader              from "../../components/ui/PageHeader";

export default function HeadDashboard() {
  const [stats,   setStats]   = useState(null);
  const [deptId,  setDeptId]  = useState(null);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    departments.list()
      .then((r) => {
        const list = r.data.data ?? [];
        if (list.length > 0) setDeptId(list[0].id);
        else setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!deptId) return;
    setLoading(true);
    analytics.department(deptId, filters)
      .then((r) => setStats(r.data.data))
      .catch(() => toast.error("Ma'lumot yuklanmadi"))
      .finally(() => setLoading(false));
  }, [deptId, filters]);

  if (loading) return <Spinner />;
  if (!stats)  return <p style={{ color: "#64748b" }}>Ma'lumot topilmadi</p>;

  return (
    <div>
      <PageHeader title="Kafedra boshlig'i paneli" subtitle={stats.department_name} />
      <FilterBar onChange={setFilters} />

      <div style={s.cards}>
        <StatCard label="O'rtacha ball"  value={stats.avg_score}              color="#3b82f6" icon="📊" />
        <StatCard label="Davomat %"      value={`${stats.attendance_pct}%`}   color="#22c55e" icon="📅" />
        <StatCard label="Guruhlar"       value={stats.group_breakdown?.length} color="#8b5cf6" icon="👥" />
      </div>

      <div style={s.box}>
        <h3 style={s.boxTitle}>Guruhlar bo'yicha tahlil</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={stats.group_breakdown}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="avg_score"      name="O'rtacha ball" fill="#3b82f6" radius={[4,4,0,0]} />
            <Bar dataKey="attendance_pct" name="Davomat %"     fill="#22c55e" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ ...s.box, marginTop: 20 }}>
        <h3 style={s.boxTitle}>Guruhlar jadvali</h3>
        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              <th>Guruh</th>
              <th>Talabalar</th>
              <th>O'rtacha ball</th>
              <th>Davomat %</th>
            </tr>
          </thead>
          <tbody>
            {stats.group_breakdown.map((g) => (
              <tr key={g.id} style={s.row}>
                <td>{g.name}</td>
                <td>{g.student_count}</td>
                <td>{g.avg_score}</td>
                <td>{g.attendance_pct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const s = {
  cards:    { display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" },
  box:      { background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  boxTitle: { fontSize: 15, fontWeight: 600, color: "#1e293b", marginBottom: 16 },
  table:    { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  thead:    { background: "#f8fafc" },
  row:      { borderBottom: "1px solid #f1f5f9" },
};