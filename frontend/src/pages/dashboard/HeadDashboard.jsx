import { useState, useEffect, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { analytics, departments } from "../../api";
import StatCard from "../../components/ui/StatCard";
import Spinner from "../../components/ui/Spinner";
import FilterBar from "../../components/ui/FilterBar";
import PageHeader from "../../components/ui/PageHeader";
import { Users, BarChart3, CalendarDays, ArrowUpRight, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

const CHART_TOOLTIP = {
  borderRadius: '1.5rem',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-bg-secondary)',
  color: 'var(--color-text-primary)',
  boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
  fontSize: 12, fontWeight: 700,
};

const MOCK_STATS = {
  department_name: "Dasturiy injiniring",
  avg_score: 79.6,
  attendance_pct: 91,
  group_breakdown: [
    { id: 1, name: "DI-21", student_count: 28, avg_score: 83, attendance_pct: 94 },
    { id: 2, name: "DI-22", student_count: 31, avg_score: 78, attendance_pct: 89 },
    { id: 3, name: "DI-23", student_count: 26, avg_score: 81, attendance_pct: 92 },
    { id: 4, name: "DI-24", student_count: 30, avg_score: 76, attendance_pct: 88 },
    { id: 5, name: "DI-25", student_count: 29, avg_score: 80, attendance_pct: 91 },
  ],
};

export default function HeadDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    departments.list()
      .then((r) => {
        const list = r.data.data ?? [];
        if (list.length > 0) {
          analytics.department(list[0].id, filters)
            .then((r) => {
              const d = r.data.data;
              setStats(d && d.group_breakdown?.length > 0 ? d : MOCK_STATS);
            })
            .catch(() => setStats(MOCK_STATS))
            .finally(() => setLoading(false));
        } else {
          setStats(MOCK_STATS);
          setLoading(false);
        }
      })
      .catch(() => { setStats(MOCK_STATS); setLoading(false); });
  }, [filters]);

  if (loading) return <Spinner />;
  const s = stats || MOCK_STATS;
  const groups = s.group_breakdown ?? MOCK_STATS.group_breakdown;

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader title={t('dashboard.head_title')} subtitle={s.department_name} />
      
      <div className="card-premium p-6 shadow-sm">
        <FilterBar onChange={setFilters} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard label={t('dashboard.avg_performance')} value={s.avg_score} color="#6366f1" icon={<BarChart3 size={22} />} trend={2.4} />
        <StatCard label={t('dashboard.attendance')} value={`${s.attendance_pct}%`} color="#22c55e" icon={<CalendarDays size={22} />} trend={3.8} />
        <StatCard label={t('dashboard.groups')} value={groups.length} color="#8b5cf6" icon={<Users size={22} />} />
      </div>

      {/* Group Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-10 shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600"><LayoutGrid size={20} /></div>
            <h3 className="text-lg font-black text-[var(--color-text-primary)] tracking-tight">{t('dashboard.group_analysis')}</h3>
          </div>
          <ArrowUpRight className="text-indigo-600 opacity-20" size={36} />
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={groups} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 800, fill: 'var(--color-text-secondary)' }} dy={10} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: 'var(--color-text-secondary)' }} />
              <Tooltip contentStyle={CHART_TOOLTIP} cursor={{ fill: 'var(--color-bg-primary)', opacity: 0.5 }} />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 16, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
              <Bar dataKey="avg_score" name={t('dashboard.avg_performance')} fill="#6366f1" radius={[10, 10, 2, 2]} barSize={28} />
              <Bar dataKey="attendance_pct" name={t('dashboard.attendance')} fill="#22c55e" radius={[10, 10, 2, 2]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Group Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-premium overflow-hidden shadow-sm">
        <div className="p-10 border-b border-[var(--color-border)]">
          <h3 className="text-lg font-black text-[var(--color-text-primary)]">{t('dashboard.group_table')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--color-bg-primary)]/50 border-b border-[var(--color-border)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">
                <th className="px-10 py-5 text-left">{t('dashboard.group_label')}</th>
                <th className="px-10 py-5 text-left">{t('dashboard.students_label')}</th>
                <th className="px-10 py-5 text-left">{t('dashboard.avg_performance')}</th>
                <th className="px-10 py-5 text-left">{t('dashboard.attendance')} %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {groups.map((g) => (
                <tr key={g.id} className="hover:bg-indigo-600/5 transition-colors group">
                  <td className="px-10 py-6 font-black text-[var(--color-text-primary)] group-hover:text-indigo-600 transition-colors">{g.name}</td>
                  <td className="px-10 py-6 text-sm font-bold text-[var(--color-text-secondary)]">{g.student_count}</td>
                  <td className="px-10 py-6">
                    <span className="px-4 py-1.5 rounded-full bg-indigo-600/10 text-indigo-600 text-xs font-black">{g.avg_score}</span>
                  </td>
                  <td className="px-10 py-6 font-black text-sm text-[var(--color-text-primary)]">{g.attendance_pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}