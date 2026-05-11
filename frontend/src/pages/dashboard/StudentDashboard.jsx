import { useState, useEffect } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { analytics } from "../../api";
import { selectUser } from "../../store/authSlice";
import { letterGradeColor } from "../../utils/helpers";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import { motion } from "framer-motion";

const MOCK_STATS = {
  full_name: "Karimov Sherzod Alisher o'g'li",
  gpa: 3.62,
  subjects: [
    { subject_id: 1, subject_name: "Algoritmlar", joriy_1: 13, joriy_2: 14, oraliq: 25, yakuniy: 36, total: 88, letter_grade: "A'lo (Excellent)", attendance_pct: 95 },
    { subject_id: 2, subject_name: "Web dasturlash", joriy_1: 12, joriy_2: 13, oraliq: 27, yakuniy: 34, total: 86, letter_grade: "A'lo (Excellent)", attendance_pct: 92 },
    { subject_id: 3, subject_name: "Ma'lumotlar bazasi", joriy_1: 10, joriy_2: 11, oraliq: 22, yakuniy: 30, total: 73, letter_grade: "Yaxshi (Good)", attendance_pct: 88 },
    { subject_id: 4, subject_name: "Kiberxavfsizlik", joriy_1: 14, joriy_2: 14, oraliq: 28, yakuniy: 38, total: 94, letter_grade: "A'lo (Excellent)", attendance_pct: 97 },
    { subject_id: 5, subject_name: "Sun'iy intellekt", joriy_1: 11, joriy_2: 12, oraliq: 20, yakuniy: 25, total: 68, letter_grade: "Yaxshi (Good)", attendance_pct: 85 },
    { subject_id: 6, subject_name: "Kompyuter tarmoqlari", joriy_1: 8, joriy_2: 9, oraliq: 18, yakuniy: 22, total: 57, letter_grade: "Qoniqarli (Satisfactory)", attendance_pct: 78 },
  ],
};

export default function StudentDashboard() {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setStats(MOCK_STATS); setLoading(false); return; }
    analytics.student(user.id)
      .then((r) => {
        const d = r.data.data;
        setStats(d && d.subjects?.length > 0 ? d : MOCK_STATS);
      })
      .catch(() => setStats(MOCK_STATS))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <Spinner />;
  const s = stats || MOCK_STATS;

  const radarData = s.subjects.map((sub) => ({
    subject: sub.subject_name.length > 14 ? sub.subject_name.slice(0, 14) + "…" : sub.subject_name,
    ball: sub.total,
  }));

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader 
        title={t('dashboard.welcome')} 
        subtitle={s.full_name || user?.full_name} 
      />

      {/* Subject Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {s.subjects.map((sub, idx) => (
          <motion.div 
            key={sub.subject_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="card-premium p-6 flex flex-col relative overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            style={{ borderTop: `4px solid ${letterGradeColor(sub.letter_grade)}` }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-black text-sm text-[var(--color-text-primary)] leading-tight flex-1 mr-2">
                {sub.subject_name}
              </h3>
              <span 
                className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shrink-0"
                style={{ backgroundColor: `${letterGradeColor(sub.letter_grade)}20`, color: letterGradeColor(sub.letter_grade) }}
              >
                {sub.letter_grade?.split(' ')[0]}
              </span>
            </div>

            <div className="space-y-3 flex-1">
              {[
                [t('grades.types.joriy_1'),  sub.joriy_1,  15],
                [t('grades.types.joriy_2'),  sub.joriy_2,  15],
                [t('grades.types.oraliq'),   sub.oraliq,   30],
                [t('grades.types.yakuniy'),  sub.yakuniy,  40],
              ].map(([lbl, val, max]) => (
                <div key={lbl} className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-[var(--color-text-secondary)] opacity-60 w-14 uppercase tracking-tighter truncate">
                    {lbl}
                  </span>
                  <div className="flex-1 h-1.5 bg-[var(--color-bg-primary)] rounded-full overflow-hidden border border-[var(--color-border)]">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${((val ?? 0) / max) * 100}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.05 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: letterGradeColor(sub.letter_grade) }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-[var(--color-text-primary)] w-10 text-right">
                    {val ?? "0"}/{max}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
              <span className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest opacity-60">{t('dashboard.total')}</span>
              <strong className="text-lg font-black" style={{ color: letterGradeColor(sub.letter_grade) }}>
                {sub.total}/100
              </strong>
            </div>

            <div className="mt-2 text-[10px] font-black text-[var(--color-text-secondary)] opacity-40 uppercase tracking-widest">
              {t('dashboard.attendance')}: <span className="text-[var(--color-text-primary)] opacity-100">{sub.attendance_pct}%</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Radar Chart */}
      {radarData.length > 2 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-premium p-8 lg:p-10 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-10">
            <span className="w-2 h-8 bg-indigo-600 rounded-full" />
            <h3 className="text-lg font-black text-[var(--color-text-primary)] tracking-tight">{t('dashboard.subject_comparison')}</h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontWeight: 700 }} />
                <Radar name={t('grades.score')} dataKey="ball" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: '1px solid var(--color-border)', 
                    backgroundColor: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-primary)',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    fontSize: 12, fontWeight: 700,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
}