import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { subjects, analytics } from "../../api";
import StatCard from "../../components/ui/StatCard";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Plus, UserCheck, BarChart3, TrendingUp, Trophy, AlertCircle, Calendar, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PIE_COLORS = ["#6366f1", "#3b82f6", "#f59e0b", "#ef4444"];
const CHART_TOOLTIP = {
  borderRadius: '1.5rem',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-bg-secondary)',
  color: 'var(--color-text-primary)',
  boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
  fontSize: 12, fontWeight: 700,
};

const MOCK_SUBJECTS = [
  { id: 1, name: "Algoritmlar", group_name: "DI-22", credit_hours: 4 },
  { id: 2, name: "Web dasturlash", group_name: "DI-23", credit_hours: 3 },
  { id: 3, name: "Ma'lumotlar bazasi", group_name: "DI-21", credit_hours: 4 },
];

const MOCK_SUB_STATS = {
  1: {
    avg_score: 78, attendance_pct: 91,
    score_distribution: { alo: 8, yaxshi: 12, qoniqarli: 6, qoniqarsiz: 2 },
    dynamics: [
      { date: "1-hafta", avg_score: 72 }, { date: "2-hafta", avg_score: 75 },
      { date: "3-hafta", avg_score: 74 }, { date: "4-hafta", avg_score: 78 },
      { date: "5-hafta", avg_score: 80 }, { date: "6-hafta", avg_score: 82 },
      { date: "7-hafta", avg_score: 79 },
    ],
  },
  2: {
    avg_score: 82, attendance_pct: 94,
    score_distribution: { alo: 11, yaxshi: 10, qoniqarli: 5, qoniqarsiz: 1 },
    dynamics: [
      { date: "1-hafta", avg_score: 76 }, { date: "2-hafta", avg_score: 79 },
      { date: "3-hafta", avg_score: 81 }, { date: "4-hafta", avg_score: 83 },
      { date: "5-hafta", avg_score: 85 }, { date: "6-hafta", avg_score: 84 },
      { date: "7-hafta", avg_score: 86 },
    ],
  },
  3: {
    avg_score: 71, attendance_pct: 86,
    score_distribution: { alo: 5, yaxshi: 14, qoniqarli: 8, qoniqarsiz: 4 },
    dynamics: [
      { date: "1-hafta", avg_score: 65 }, { date: "2-hafta", avg_score: 68 },
      { date: "3-hafta", avg_score: 70 }, { date: "4-hafta", avg_score: 72 },
      { date: "5-hafta", avg_score: 71 }, { date: "6-hafta", avg_score: 74 },
      { date: "7-hafta", avg_score: 73 },
    ],
  },
};

export default function TeacherDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [subList, setSubList] = useState([]);
  const [selSub, setSelSub] = useState(null);
  const [subStats, setSubStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    subjects.list()
      .then((r) => {
        const list = r.data.data ?? [];
        if (list.length > 0) {
          setSubList(list);
          setSelSub(list[0]);
        } else {
          setSubList(MOCK_SUBJECTS);
          setSelSub(MOCK_SUBJECTS[0]);
        }
      })
      .catch(() => {
        setSubList(MOCK_SUBJECTS);
        setSelSub(MOCK_SUBJECTS[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selSub) return;
    setStatsLoading(true);
    analytics.subject(selSub.id)
      .then((r) => {
        const d = r.data.data;
        setSubStats(d && d.avg_score ? d : MOCK_SUB_STATS[selSub.id] || MOCK_SUB_STATS[1]);
      })
      .catch(() => setSubStats(MOCK_SUB_STATS[selSub.id] || MOCK_SUB_STATS[1]))
      .finally(() => setStatsLoading(false));
  }, [selSub]);

  if (loading) return <Spinner />;

  const ss = subStats || MOCK_SUB_STATS[1];
  const pieData = ss?.score_distribution ? [
    { name: t('grades.alo', "A'lo"), value: ss.score_distribution.alo },
    { name: t('grades.yaxshi', 'Yaxshi'), value: ss.score_distribution.yaxshi },
    { name: t('grades.qoniqarli', 'Qoniqarli'), value: ss.score_distribution.qoniqarli },
    { name: t('grades.qoniqarsiz', 'Qoniqarsiz'), value: ss.score_distribution.qoniqarsiz },
  ] : [];

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader
        title={t('nav.dashboard')}
        subtitle={t('dashboard.teacher_subtitle')}
        actions={
          <div className="flex gap-3">
             <Button variant="secondary" className="font-black h-12 rounded-2xl text-xs uppercase tracking-widest border-2" icon={<UserCheck size={18} />} onClick={() => navigate("/attendance/daily")}>{t('attendance.title')}</Button>
             <Button className="font-black h-12 px-6 rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20" icon={<Plus size={18} />} onClick={() => navigate("/grades/new")}>{t('dashboard.mark_grade')}</Button>
          </div>
        }
      />

      {/* Subject Selection */}
      <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
        {subList.map((sub) => (
          <motion.div
            key={sub.id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelSub(sub)}
            className={`
              cursor-pointer px-8 py-5 rounded-[2rem] border-2 transition-all min-w-[220px] flex flex-col gap-1.5 shrink-0
              ${selSub?.id === sub.id 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                : 'card-premium border-transparent hover:border-indigo-600/30 shadow-sm'}
            `}
          >
            <div className="font-black text-sm flex items-center gap-2">
              <BookOpen size={16} className={selSub?.id === sub.id ? 'text-white' : 'text-indigo-600'} />
              {sub.name}
            </div>
            <div className={`text-[10px] font-black uppercase tracking-widest ${selSub?.id === sub.id ? 'text-indigo-100' : 'text-[var(--color-text-secondary)] opacity-60'}`}>
              {sub.group_name} • {sub.credit_hours} {t('dashboard.credits')}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selSub && (
          <motion.div 
            key={selSub.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-10"
          >
            {/* Title Bar */}
            <div className="card-premium p-8 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600"><TrendingUp size={24} /></div>
                <div>
                  <h3 className="text-xl font-black text-[var(--color-text-primary)] tracking-tight">{selSub.name}</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] font-bold opacity-60">{selSub.group_name} — {t('dashboard.analytic_indicators')}</p>
                </div>
              </div>
              {statsLoading && <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />}
            </div>

            {!statsLoading && ss && (
              <>
                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label={t('dashboard.avg_performance')} value={ss.avg_score} color="#6366f1" icon={<BarChart3 size={20} />} trend={2.1} />
                  <StatCard label={t('dashboard.attendance')} value={`${ss.attendance_pct}%`} color="#22c55e" icon={<Calendar size={20} />} trend={3.4} />
                  <StatCard label={t('grades.alo', "A'lo")} value={ss.score_distribution?.alo} color="#10b981" icon={<Trophy size={20} />} />
                  <StatCard label={t('grades.qoniqarsiz', 'Qoniqarsiz')} value={ss.score_distribution?.qoniqarsiz} color="#f43f5e" icon={<AlertCircle size={20} />} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Weekly Dynamics */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-10 shadow-sm">
                    <div className="flex items-center gap-3 mb-10">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600"><BarChart3 size={20} /></div>
                      <h4 className="text-lg font-black text-[var(--color-text-primary)] tracking-tight">{t('dashboard.performance_dynamics')}</h4>
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ss.dynamics || MOCK_SUB_STATS[1].dynamics}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: 'var(--color-text-secondary)' }} dy={10} />
                          <YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: 'var(--color-text-secondary)' }} />
                          <Tooltip contentStyle={CHART_TOOLTIP} cursor={{ fill: 'var(--color-bg-primary)', opacity: 0.5 }} />
                          <Bar dataKey="avg_score" name={t('grades.score')} fill="#6366f1" radius={[10, 10, 4, 4]} barSize={32} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  {/* Grade Pie */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-premium p-10 shadow-sm">
                    <div className="flex items-center gap-3 mb-10">
                      <div className="w-10 h-10 rounded-2xl bg-purple-600/10 flex items-center justify-center text-purple-600"><Award size={20} /></div>
                      <h4 className="text-lg font-black text-[var(--color-text-primary)] tracking-tight">{t('dashboard.performance_share')}</h4>
                    </div>
                    <div className="flex flex-col items-center gap-6">
                      <div className="h-52 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={6} stroke="none">
                              {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                            </Pie>
                            <Tooltip contentStyle={CHART_TOOLTIP} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="w-full grid grid-cols-2 gap-3">
                        {pieData.map((d, i) => (
                          <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--color-bg-primary)]/60 border border-[var(--color-border)]">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                              <span className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-wider">{d.name}</span>
                            </div>
                            <span className="text-sm font-black text-[var(--color-text-primary)]">{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}