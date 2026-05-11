import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, ChevronRight, BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/ui/PageHeader";

const EXAM_RESULTS = [
  { id: 1, subject: "Algoritmlar", type: "midterm", score: 14.5, max: 15, date: "2024-03-12", status: "passed" },
  { id: 2, subject: "Ma'lumotlar bazasi", type: "midterm", score: 12.0, max: 15, date: "2024-03-15", status: "passed" },
  { id: 3, subject: "Web dasturlash", type: "midterm", score: 5.5, max: 15, date: "2024-03-20", status: "failed" },
  { id: 4, subject: "Sun'iy intellekt", type: "midterm", score: 28, max: 30, date: "2024-04-05", status: "passed" },
  { id: 5, subject: "Kiberxavfsizlik", type: "final", score: 36, max: 40, date: "2024-05-10", status: "passed" },
];

export default function ExamsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader 
        title={t('nav.exams')} 
        subtitle="O'tkazilgan nazoratlar va ularning batafsil natijalari"
      />

      <div className="grid grid-cols-1 gap-6">
        {EXAM_RESULTS.map((exam, i) => (
          <motion.div
            key={exam.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group card-premium p-8 flex flex-col md:flex-row md:items-center justify-between hover:border-indigo-600/30 shadow-sm group active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-8 mb-4 md:mb-0">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                exam.status === 'passed' ? 'bg-emerald-600/10 text-emerald-600 shadow-emerald-600/5' : 'bg-rose-600/10 text-rose-600 shadow-rose-600/5'
              }`}>
                {exam.status === 'passed' ? <CheckCircle size={32} /> : <XCircle size={32} />}
              </div>
              <div>
                <h4 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight mb-1 group-hover:text-indigo-600 transition-colors">{exam.subject}</h4>
                <div className="flex items-center gap-3 text-[10px] text-[var(--color-text-secondary)] font-black uppercase tracking-[0.2em] opacity-40">
                  <span>{t(`academic.exam_types.${exam.type}`)}</span>
                  <span>•</span>
                  <span>{exam.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-12">
              <div className="text-right">
                <p className="text-3xl font-black text-[var(--color-text-primary)] tracking-tighter mb-1">
                  {exam.score} <span className="text-sm text-[var(--color-text-secondary)] font-black opacity-30">/ {exam.max}</span>
                </p>
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg inline-block border ${
                  exam.status === 'passed' 
                    ? 'bg-emerald-600/5 text-emerald-600 border-emerald-600/10' 
                    : 'bg-rose-600/5 text-rose-600 border-rose-600/10'
                }`}>
                  {exam.status === 'passed' ? t('common.success') : t('common.error')}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] opacity-20 group-hover:opacity-100 group-hover:text-indigo-600 group-hover:border-indigo-600/30 transition-all shadow-inner group-hover:shadow-none">
                 <ChevronRight size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card-premium p-10 bg-indigo-600/5 border-dashed border-2 border-indigo-600/20 flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
               <BarChart3 size={28} />
            </div>
            <div className="space-y-1">
               <h4 className="text-xl font-black text-[var(--color-text-primary)] tracking-tight">Umumiy statistika</h4>
               <p className="text-sm text-[var(--color-text-secondary)] font-bold opacity-60">Imtihon natijalari asosida shakllantirilgan tahliliy hisobotlar</p>
            </div>
         </div>
         <button className="h-14 px-10 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-black text-sm hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95">
            Tahlilni ko'rish
         </button>
      </div>
    </div>
  );
}
