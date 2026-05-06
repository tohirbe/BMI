import { useState, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useSelector }         from "react-redux";
import toast                   from "react-hot-toast";
import { analytics, departments } from "../../api";
import { selectUser }          from "../../store/authSlice";
import StatCard                from "../../components/ui/StatCard";
import Spinner                 from "../../components/ui/Spinner";
import FilterBar               from "../../components/ui/FilterBar";
import PageHeader              from "../../components/ui/PageHeader";

const PIE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];

export default function DeanDashboard() {
  const user              = useSelector(selectUser);
  const [stats,  setStats]   = useState(null);
  const [depts,  setDepts]   = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [facId,   setFacId]   = useState(null);

  useEffect(() => {
    departments.list()
      .then((r) => {
        const list = r.data.data ?? [];
        setDepts(list);
        if (list.length > 0) setFacId(list[0].faculty);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!facId) { setLoading(false); return; }
    setLoading(true);
    analytics.faculty(facId, filters)
      .then((r) => setStats(r.data.data))
      .catch(() => toast.error("Ma'lumot yuklanmadi"))
      .finally(() => setLoading(false));
  }, [facId, filters]);

  if (loading) return <Spinner />;
  if (!stats)  return <p style={{ color: "#64748b" }}>Ma'lumot topilmadi</p>;

  const pieData = [
    { name: "A'lo",       value: stats.score_distribution.alo },
    { name: "Yaxshi",      value: stats.score_distribution.yaxshi },
    { name: "Qoniqarli",   value: stats.score_distribution.qoniqarli },
    { name: "Qoniqarsiz",  value: stats.score_distribution.qoniqarsiz },
  ];

  return (
    <div>
      <PageHeader title="Dekan paneli" subtitle={stats.faculty_name} />
      <FilterBar onChange={setFilters} />

      <div style={s.cards}>
        <StatCard label="O'rtacha ball"  value={stats.avg_score}             color="#3b82f6" icon="📊" />
        <StatCard label="Davomat %"      value={`${stats.attendance_pct}%`}  color="#22c55e" icon="📅" />
        <StatCard label="Kafedralar"     value={stats.department_breakdown?.length} color="#8b5cf6" icon="🏛️" />
      </div>

      <div style={s.charts}>
        <div style={s.box}>
          <h3 style={s.boxTitle}>Kafedralar bo'yicha o'rtacha ball</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.department_breakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="avg_score" name="O'rtacha ball" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={s.box}>
          <h3 style={s.boxTitle}>Baho taqsimoti</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const s = {
  cards:    { display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" },
  charts:   { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  box:      { background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  boxTitle: { fontSize: 15, fontWeight: 600, color: "#1e293b", marginBottom: 16 },
};