import { useState, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { analytics, departments } from "../../api";
import { selectUser } from "../../store/authSlice";
import StatCard from "../../components/ui/StatCard";
import Spinner from "../../components/ui/Spinner";
import FilterBar from "../../components/ui/FilterBar";
import PageHeader from "../../components/ui/PageHeader";
import { GraduationCap, BarChart3, PieChart as PieIcon, Building2, CalendarDays, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

const PIE_COLORS = ["#6366f1", "#3b82f6", "#f59e0b", "#ef4444"];
const CHART_TOOLTIP = {
  borderRadius: '1.5rem',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-bg-secondary)',
  color: 'var(--color-text-primary)',
  boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
  fontSize: 12, fontWeight: 700,
};

const MOCK_STATS = {
  faculty_name: "Axborot texnologiyalari",
  avg_score: 78.3,
  attendance_pct: 91,
  total_students: 1240,
  score_distribution: { alo: 310, yaxshi: 480, qoniqarli: 340, qoniqarsiz: 110 },
  department_breakdown: [
    { name: "Dasturiy injiniring", avg_score: 82, attendance_pct: 93, student_count: 320 },
    { name: "Kiberxavfsizlik", avg_score: 79, attendance_pct: 90, student_count: 280 },
    { name: "Sun'iy intellekt", avg_score: 85, attendance_pct: 94, student_count: 260 },
    { name: "Kompyuter fanlari", avg_score: 74, attendance_pct: 88, student_count: 380 },
  ],
};

const MOCK_TREND = [
  { month: "Sen", score: 76, attendance: 89 },
  { month: "Okt", score: 77, attendance: 91 },
  { month: "Noy", score: 75, attendance: 87 },
  { month: "Dek", score: 73, attendance: 83 },
  { month: "Yan", score: 78, attendance: 90 },
  { month: "Fev", score: 79, attendance: 92 },
  { month: "Mar", score: 81, attendance: 93 },
];

export default function DeanDashboard() {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    departments.list()
      .then((r) => {
        const list = r.data.data ?? [];
        if (list.length > 0) {
          const facId = list[0].faculty;
          analytics.faculty(facId, filters)
            .then((r) => {
              const d = r.data.data;
              setStats(d && d.avg_score ? d : MOCK_STATS);
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

  const pieData = [
    { name: t('grades.alo', "A'lo"), value: s.score_distribution?.alo ?? 310 },
    { name: t('grades.yaxshi', 'Yaxshi'), value: s.score_distribution?.yaxshi ?? 480 },
    { name: t('grades.qoniqarli', 'Qoniqarli'), value: s.score_distribution?.qoniqarli ?? 340 },
    { name: t('grades.qoniqarsiz', 'Qoniqarsiz'), value: s.score_distribution?.qoniqarsiz ?? 110 },
  ];

  const deptData = s.department_breakdown ?? MOCK_STATS.department_breakdown;

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader 
        title={t('dashboard.faculty_title')} 
        subtitle={`${s.faculty_name || ''} — ${t('dashboard.faculty_subtitle', 'fakultet ko\'rsatkichlari')}`}
      />
      
      <div className="card-premium p-6 shadow-sm">
        <FilterBar onChange={setFilters} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard label={t('dashboard.total_students')} value={s.total_students?.toLocaleString() ?? '1,240'} color="#6366f1" icon={<GraduationCap size={22} />} trend={3.2} />
        <StatCard label={t('dashboard.avg_gpa', 'O\'rtacha GPA')} value={s.avg_score} color="#3b82f6" icon={<BarChart3 size={22} />} trend={2.1} />
        <StatCard label={t('dashboard.attendance')} value={`${s.attendance_pct}%`} color="#22c55e" icon={<CalendarDays size={22} />} trend={4.5} />
        <StatCard label={t('dashboard.dept_count', 'Kafedralar')} value={deptData.length} color="#8b5cf6" icon={<Building2 size={22} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Department Scores */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600"><BarChart3 size={20} /></div>
            <h3 className="text-lg font-black text-[var(--color-text-primary)] tracking-tight">{t('dashboard.scores_by_dept')}</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: 'var(--color-text-secondary)' }} dy={10} interval={0} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: 'var(--color-text-secondary)' }} />
                <Tooltip contentStyle={CHART_TOOLTIP} cursor={{ fill: 'var(--color-bg-primary)', opacity: 0.5 }} />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 16, fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                <Bar dataKey="avg_score" name={t('dashboard.avg_performance')} fill="#6366f1" radius={[10, 10, 2, 2]} barSize={28} />
                <Bar dataKey="attendance_pct" name={t('dashboard.attendance')} fill="#22c55e" radius={[10, 10, 2, 2]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Grade Distribution Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-premium p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/10 flex items-center justify-center text-purple-600"><PieIcon size={20} /></div>
            <h3 className="text-lg font-black text-[var(--color-text-primary)] tracking-tight">{t('dashboard.performance_share')}</h3>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-56 w-full md:w-3/5">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={6} stroke="none">
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
                  <span className="text-sm font-black text-[var(--color-text-primary)]">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Monthly Trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-premium p-10 shadow-sm">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-600"><TrendingUp size={20} /></div>
          <div>
            <h3 className="text-lg font-black text-[var(--color-text-primary)] tracking-tight">{t('dashboard.attendance_by_faculty')}</h3>
            <p className="text-xs text-[var(--color-text-secondary)] font-bold opacity-60 mt-0.5">{t('dashboard.attendance_comparison')}</p>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_TREND} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="deanAtt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="deanScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 11, fontWeight: 800 }} dy={10} />
              <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontWeight: 800 }} />
              <Tooltip contentStyle={CHART_TOOLTIP} />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 16, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
              <Area type="monotone" dataKey="attendance" name={t('dashboard.attendance')} stroke="#6366f1" strokeWidth={3} fill="url(#deanAtt)" dot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="score" name={t('dashboard.avg_performance')} stroke="#22c55e" strokeWidth={3} fill="url(#deanScore)" dot={{ r: 4, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}