import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/ui/PageHeader";

const GRADES = [
  { id: 1, subject: "Algoritmlar", joriy: 28.5, oraliq: 26, yakuniy: 35, total: 89.5, letter: "A'lo (Excellent)" },
  { id: 2, subject: "Ma'lumotlar bazasi", joriy: 25.0, oraliq: 24, yakuniy: 30, total: 79, letter: "Yaxshi (Good)" },
  { id: 3, subject: "Web dasturlash", joriy: 22.0, oraliq: 20, yakuniy: 25, total: 67, letter: "Qoniqarli (Satisfactory)" },
  { id: 4, subject: "Kiberxavfsizlik", joriy: 29.0, oraliq: 28, yakuniy: 38, total: 95, letter: "A'lo (Excellent)" },
];

export default function RatingBookPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader 
        title={t('academic.rating_title')} 
        subtitle={t('academic.semester_summary')}
        actions={
          <div className="flex items-center gap-4 px-8 py-4 bg-indigo-600 rounded-[1.5rem] text-white shadow-2xl shadow-indigo-600/30">
            <Star size={24} fill="currentColor" className="text-amber-400" />
            <span className="font-black text-2xl tracking-tighter">GPA: 3.82</span>
          </div>
        }
      />

      <div className="card-premium overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-bg-primary)]/40 border-b border-[var(--color-border)]">
                <th className="px-8 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">{t('academic.subject_attendance').split(' ')[0]}</th>
                <th className="px-8 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-center">{t('academic.joriy')}</th>
                <th className="px-8 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-center">{t('academic.oraliq')}</th>
                <th className="px-8 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-center">{t('academic.yakuniy')}</th>
                <th className="px-8 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-center">{t('academic.total')}</th>
                <th className="px-8 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-right">{t('academic.letter_grade')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {GRADES.map((grade, i) => (
                <motion.tr
                  key={grade.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-[var(--color-bg-primary)]/60 transition-colors group"
                >
                  <td className="px-8 py-6 font-black text-[var(--color-text-primary)] tracking-tight text-sm group-hover:text-indigo-600 transition-colors">{grade.subject}</td>
                  <td className="px-8 py-6 text-center text-sm font-bold text-[var(--color-text-secondary)] opacity-60">{grade.joriy}</td>
                  <td className="px-8 py-6 text-center text-sm font-bold text-[var(--color-text-secondary)] opacity-60">{grade.oraliq}</td>
                  <td className="px-8 py-6 text-center text-sm font-bold text-[var(--color-text-secondary)] opacity-60">{grade.yakuniy}</td>
                  <td className="px-8 py-6 text-center">
                    <span className="px-5 py-2 rounded-xl bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-black text-sm border border-[var(--color-border)] shadow-inner">
                      {grade.total}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      grade.letter.includes('Excellent') || grade.letter.includes("A'lo") 
                        ? 'bg-emerald-600/10 text-emerald-600 border-emerald-600/20' 
                        : grade.letter.includes('Good') || grade.letter.includes('Yaxshi') 
                        ? 'bg-blue-600/10 text-blue-600 border-blue-600/20' 
                        : grade.letter.includes('Fail') || grade.letter.includes('Qoniqarsiz') 
                        ? 'bg-rose-600/10 text-rose-600 border-rose-600/20' 
                        : 'bg-amber-600/10 text-amber-600 border-amber-600/20'
                    }`}>
                      {grade.letter}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
