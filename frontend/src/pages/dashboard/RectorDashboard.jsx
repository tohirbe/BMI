import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import toast          from "react-hot-toast";
import { analytics, faculties } from "../../api";
import StatCard       from "../../components/ui/StatCard";
import Spinner        from "../../components/ui/Spinner";
import FilterBar      from "../../components/ui/FilterBar";
import PageHeader     from "../../components/ui/PageHeader";

const PIE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];

export default function RectorDashboard() {
  const [stats,      setStats]      = useState(null);
  const [facList,    setFacList]    = useState([]);
  const [facStats,   setFacStats]   = useState([]);
  const [filters,    setFilters]    = useState({});
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    faculties.list().then((r) => setFacList(r.data.data ?? [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    analytics.university(filters)
      .then((r) => setStats(r.data.data))
      .catch(() => toast.error("Ma'lumot yuklanmadi"))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    Promise.all(facList.map((f) => analytics.faculty(f.id, filters)))
      .then((results) =>
        setFacStats(results.map((r, i) => ({
          name:           facList[i].short_name,
          avg_score:      r.data.data.avg_score,
          attendance_pct: r.data.data.attendance_pct,
        })))
      )
      .catch(() => {});
  }, [facList, filters]);

  if (loading) return <Spinner />;

  const pieData = stats
    ? [
        { name: "A'lo",        value: stats.score_distribution.alo },
        { name: "Yaxshi",       value: stats.score_distribution.yaxshi },
        { name: "Qoniqarli",    value: stats.score_distribution.qoniqarli },
        { name: "Qoniqarsiz",   value: stats.score_distribution.qoniqarsiz },
      ]
    : [];

  return (
    <div>
      <PageHeader title="Rektor paneli" subtitle="Universitet bo'yicha umumiy statistika" />
      <FilterBar onChange={setFilters} />

      <div style={s.cards}>
        <StatCard label="Jami talabalar"   value={stats?.total_students}   color="#3b82f6" icon="🎓" />
        <StatCard label="O'qituvchilar"    value={stats?.total_teachers}   color="#8b5cf6" icon="👨‍🏫" />
        <StatCard label="O'rtacha ball"    value={stats?.avg_score}        color="#22c55e" icon="📊" />
        <StatCard label="Davomat %"        value={`${stats?.attendance_pct ?? 0}%`} color="#f59e0b" icon="📅" />
      </div>

      <div style={s.charts}>
        {/* Fakultetlar solishtirmasi */}
        <div style={s.chartBox}>
          <h3 style={s.chartTitle}>Fakultetlar bo'yicha o'rtacha ball</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={facStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="avg_score" name="O'rtacha ball" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Baho taqsimoti */}
        <div style={s.chartBox}>
          <h3 style={s.chartTitle}>Baho taqsimoti</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Davomat */}
        <div style={{ ...s.chartBox, gridColumn: "1 / -1" }}>
          <h3 style={s.chartTitle}>Fakultetlar bo'yicha davomat %</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={facStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="attendance_pct" name="Davomat" fill="#22c55e" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const s = {
  cards:      { display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" },
  charts:     { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  chartBox:   { background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  chartTitle: { fontSize: 15, fontWeight: 600, color: "#1e293b", marginBottom: 16 },
};