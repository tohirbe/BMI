import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/ui/PageHeader";

const ATTENDANCE_DATA = [
  { subject: "Algoritmlar", total: 32, present: 28, absent: 4, percent: 87.5 },
  { subject: "Ma'lumotlar bazasi", total: 24, present: 24, absent: 0, percent: 100 },
  { subject: "Web dasturlash", total: 18, present: 14, absent: 4, percent: 77.8 },
  { subject: "Kiberxavfsizlik", total: 30, present: 26, absent: 4, percent: 86.7 },
];

export default function AttendanceReportPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader 
        title={t('academic.attendance_summary')} 
        subtitle={t('academic.subject_attendance')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Subjects List */}
        <div className="space-y-6">
          {ATTENDANCE_DATA.map((item, i) => (
            <motion.div
              key={item.subject}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-premium p-8 shadow-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-lg text-[var(--color-text-primary)] tracking-tight">{item.subject}</h3>
                <span className={`text-lg font-black ${item.percent < 75 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {item.percent}%
                </span>
              </div>
              
              <div className="w-full h-3 bg-[var(--color-bg-primary)] rounded-full overflow-hidden mb-6 border border-[var(--color-border)] shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percent}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  className={`h-full ${item.percent < 75 ? 'bg-rose-500' : 'bg-emerald-500'} shadow-lg`}
                />
              </div>

              <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] opacity-60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{t('academic.present')}: {item.present}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>{t('academic.absent')}: {item.absent}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-text-secondary)]" />
                  <span>{t('academic.total')}: {item.total}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden group"
          >
            <TrendingUp className="absolute right-[-40px] bottom-[-40px] w-64 h-64 opacity-10 rotate-12 transition-transform group-hover:scale-110 duration-700" />
            <div className="relative z-10">
              <h2 className="text-2xl font-black mb-3 tracking-tight">{t('academic.summary')}</h2>
              <p className="text-indigo-100 text-sm font-medium mb-8 max-w-[280px]">{t('academic.norm_status')}</p>
              <div className="text-7xl font-black mb-3 tracking-tighter">89.4%</div>
              <p className="text-[10px] uppercase tracking-[0.3em] font-black opacity-60">{t('academic.current_semester')}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium p-8 flex items-start gap-6 shadow-md border-l-[6px] border-l-amber-500"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-inner">
              <AlertTriangle size={32} />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-xl text-[var(--color-text-primary)] mb-2 tracking-tight">{t('academic.note')}</h4>
              <p className="text-sm text-[var(--color-text-secondary)] font-medium leading-relaxed">
                {t('academic.attendance_warning')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
