import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { analytics, faculties as facultyApi } from "../../api";
import StatCard from "../../components/ui/StatCard";
import Spinner from "../../components/ui/Spinner";
import FilterBar from "../../components/ui/FilterBar";
import PageHeader from "../../components/ui/PageHeader";
import { GraduationCap, Users, BarChart3, CalendarDays, TrendingUp, Award, BookOpen, Building2 } from "lucide-react";

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e"];
const CHART_TOOLTIP = {
  borderRadius: '1.5rem',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-bg-secondary)',
  color: 'var(--color-text-primary)',
  boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
  fontSize: 12,
  fontWeight: 700,
};

const MOCK_STATS = {
  total_students: 4285,
  total_teachers: 312,
  avg_score: 76.4,
  attendance_pct: 89.2,
  score_distribution: { alo: 842, yaxshi: 1563, qoniqarli: 1420, qoniqarsiz: 460 },
};

const MOCK_FAC_STATS = [
  { name: "IT", avg_score: 82, attendance_pct: 92 },
  { name: "Iqtisod", avg_score: 74, attendance_pct: 87 },
  { name: "Huquq", avg_score: 71, attendance_pct: 84 },
  { name: "Pedagogika", avg_score: 78, attendance_pct: 90 },
  { name: "Filologiya", avg_score: 69, attendance_pct: 81 },
];

const MOCK_MONTHLY_TREND = [
  { month: "Sen", students: 4100, attendance: 91, gpa: 74 },
  { month: "Okt", students: 4150, attendance: 89, gpa: 75 },
  { month: "Noy", students: 4200, attendance: 86, gpa: 73 },
  { month: "Dek", students: 4220, attendance: 82, gpa: 72 },
  { month: "Yan", students: 4250, attendance: 88, gpa: 76 },
  { month: "Fev", students: 4260, attendance: 90, gpa: 77 },
  { month: "Mar", students: 4285, attendance: 92, gpa: 78 },
];

export default function RectorDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [facStats, setFacStats] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    analytics.university(filters)
      .then((r) => {
        const d = r.data.data;
        setStats(d && d.total_students ? d : MOCK_STATS);
      })
      .catch(() => setStats(MOCK_STATS))
      .finally(() => setLoading(false));

    facultyApi.list().then((r) => {
      const list = r.data.data ?? [];
      if (list.length > 0) {
        Promise.all(list.map((f) => analytics.faculty(f.id, filters)))
          .then((results) => {
            const data = results.map((r, i) => ({
              name: list[i].short_name,
              avg_score: r.data.data?.avg_score ?? 0,
              attendance_pct: r.data.data?.attendance_pct ?? 0,
            }));
            setFacStats(data.some(d => d.avg_score > 0) ? data : MOCK_FAC_STATS);
          })
          .catch(() => setFacStats(MOCK_FAC_STATS));
      } else {
        setFacStats(MOCK_FAC_STATS);
      }
    }).catch(() => setFacStats(MOCK_FAC_STATS));
  }, [filters]);

  if (loading) return <Spinner />;

  const s = stats || MOCK_STATS;
  const pieData = [
    { name: t('grades.alo', "A'lo"), value: s.score_distribution?.alo ?? 842 },
    { name: t('grades.yaxshi', 'Yaxshi'), value: s.score_distribution?.yaxshi ?? 1563 },
    { name: t('grades.qoniqarli', 'Qoniqarli'), value: s.score_distribution?.qoniqarli ?? 1420 },
    { name: t('grades.qoniqarsiz', 'Qoniqarsiz'), value: s.score_distribution?.qoniqarsiz ?? 460 },
  ];

  return (
    <div className="space-y-10 pb-12 animate-fade-in">
      <PageHeader 
        title={t('dashboard.title')} 
        subtitle={t('dashboard.subtitle')}
        actions={
          <button className="h-12 px-6 rounded-2xl bg-indigo-600 text-white font-black flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all text-sm">
            <TrendingUp size={18} /> {t('dashboard.download_report')}
          </button>
        }
      />
      
      <div className="card-premium p-6 shadow-sm">
        <FilterBar onChange={setFilters} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard label={t('dashboard.total_students')} value={s.total_students?.toLocaleString()} color="#6366f1" icon={<GraduationCap size={24} />} trend={2.4} />
        <StatCard label={t('dashboard.teachers')} value={s.total_teachers} color="#8b5cf6" icon={<Users size={24} />} trend={1.1} />
        <StatCard label={t('dashboard.avg_performance')} value={s.avg_score} color="#ec4899" icon={<BarChart3 size={24} />} trend={3.2} />
        <StatCard label={t('dashboard.attendance')} value={`${s.attendance_pct}%`} color="#22c55e" icon={<CalendarDays size={24} />} trend={4.1} />
      </div>

      {/* Charts Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Faculty Performance Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-10 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                <Building2 size={20} />
              </div>
              <h3 className="text-lg font-black text-[var(--color-text-primary)] tracking-tight">{t('dashboard.faculty_performance')}</h3>
            </div>
            <div className="text-[9px] uppercase font-black text-[var(--color-text-secondary)] tracking-widest bg-[var(--color-bg-primary)] px-3 py-1 rounded-full border border-[var(--color-border)]">{t('dashboard.avg_scores')}</div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 11, fontWeight: 800 }} dy={10} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontWeight: 800 }} />
                <Tooltip cursor={{ fill: 'var(--color-bg-primary)', opacity: 0.5 }} contentStyle={CHART_TOOLTIP} />
                <Bar dataKey="avg_score" name={t('dashboard.avg_performance')} fill="#6366f1" radius={[12, 12, 4, 4]} barSize={36} />
                <Bar dataKey="attendance_pct" name={t('dashboard.attendance')} fill="#22c55e" radius={[12, 12, 4, 4]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Grade Distribution Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-premium p-10 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600/10 flex items-center justify-center text-purple-600">
                <Award size={20} />
              </div>
              <h3 className="text-lg font-black text-[var(--color-text-primary)] tracking-tight">{t('dashboard.performance_share')}</h3>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-64 w-full md:w-3/5">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={6} stroke="none">
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={CHART_TOOLTIP} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-2/5 space-y-3">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-[var(--color-bg-primary)]/60 border border-[var(--color-border)]">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                    <span className="text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-wider">{d.name}</span>
                  </div>
                  <span className="text-sm font-black text-[var(--color-text-primary)]">{d.value?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Monthly Trends - full width */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-premium p-10 shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-600">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-[var(--color-text-primary)] tracking-tight">{t('dashboard.attendance_by_faculty')}</h3>
              <p className="text-xs text-[var(--color-text-secondary)] font-bold opacity-60 mt-0.5">{t('dashboard.attendance_comparison')}</p>
            </div>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_MONTHLY_TREND} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 11, fontWeight: 800 }} dy={10} />
              <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontWeight: 800 }} />
              <Tooltip contentStyle={CHART_TOOLTIP} />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 16, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
              <Area type="monotone" dataKey="attendance" name={t('dashboard.attendance')} stroke="#6366f1" strokeWidth={3} fill="url(#colorAtt)" dot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="gpa" name={t('dashboard.avg_performance')} stroke="#22c55e" strokeWidth={3} fill="url(#colorGpa)" dot={{ r: 4, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}