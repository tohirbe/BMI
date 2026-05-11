import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Download, Search, Plus, MoreVertical, Filter, Layers, Zap, Clock, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";

export default function CurriculumPage() {
  const { t } = useTranslation();
  const [data] = useState([
    { id: 1, subject: "Algoritmlar va ma'lumotlar tuzilmasi", semester: 4, hours: 60, credits: 6, type: "required" },
    { id: 2, subject: "Ma'lumotlar bazasi tizimlari", semester: 4, hours: 45, credits: 5, type: "required" },
    { id: 3, subject: "Web dasturlash (React)", semester: 4, hours: 30, credits: 4, type: "elective" },
    { id: 4, subject: "Kiberxavfsizlik asoslari", semester: 4, hours: 45, credits: 5, type: "required" },
    { id: 5, subject: "Sun'iy intellekt", semester: 4, hours: 30, credits: 4, type: "elective" },
  ]);

  const stats = useMemo(() => [
    { label: t('curriculum.total_subjects'), value: `12 ${t('curriculum.units')}`, color: "text-blue-500", bg: "bg-blue-500/10", icon: <Book size={28} /> },
    { label: t('curriculum.total_credits'), value: `30 ${t('curriculum.ects')}`, color: "text-indigo-500", bg: "bg-indigo-500/10", icon: <Zap size={28} /> },
    { label: t('curriculum.avg_load'), value: `24 ${t('curriculum.hours_count')}/${t('curriculum.weekly')}`, color: "text-emerald-500", bg: "bg-emerald-500/10", icon: <Clock size={28} /> },
  ], [t]);

  return (
    <div className="space-y-12 animate-fade-in pb-20 px-6 pt-6">
      <PageHeader 
        title={t('curriculum.title')} 
        subtitle={t('curriculum.subtitle')}
        actions={
          <div className="flex gap-4">
            <Button variant="secondary" className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest border-2" icon={<Download size={20} />}>
              PDF
            </Button>
            <Button className="h-14 px-10 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20" icon={<Plus size={20} />}>
              {t('curriculum.add_subject')}
            </Button>
          </div>
        }
      />

      {/* Stats/Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-premium p-10 flex items-center gap-8 shadow-sm group hover:scale-[1.02] transition-all duration-500"
          >
            <div className={`w-20 h-20 ${stat.bg} ${stat.color} rounded-[2rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
              {stat.icon}
            </div>
            <div className="space-y-1">
              <p className="text-[var(--color-text-secondary)] text-[10px] uppercase tracking-[0.3em] font-black opacity-40">{stat.label}</p>
              <p className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight leading-none">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table Section */}
      <div className="card-premium overflow-hidden shadow-md">
        <div className="p-10 border-b border-[var(--color-border)] flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-[var(--color-bg-primary)]/30">
          <div className="relative flex-1 max-w-xl group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-600 opacity-40 group-focus-within:opacity-100 transition-all" size={22} />
            <input
              type="text"
              placeholder={t('common.search')}
              className="w-full h-16 bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border)] rounded-2xl pl-16 pr-6 font-black text-[var(--color-text-primary)] placeholder:opacity-40 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
            />
          </div>
          <Button variant="secondary" className="h-16 px-10 rounded-2xl font-black text-xs uppercase tracking-widest border-2" icon={<Filter size={20} />}>{t('common.filter', 'Filter')}</Button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-bg-primary)]/50 border-b border-[var(--color-border)]">
                <th className="px-10 py-8 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">{t('attendance.subject')}</th>
                <th className="px-10 py-8 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-center">{t('common.semester')}</th>
                <th className="px-10 py-8 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-center">{t('curriculum.avg_load')}</th>
                <th className="px-10 py-8 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-center">{t('common.credits', 'Credit')}</th>
                <th className="px-10 py-8 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-center">{t('common.type', 'Type')}</th>
                <th className="px-10 py-8 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-right">{t('attendance.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-bg-secondary)]">
              <AnimatePresence mode="popLayout">
                {data.map((item, idx) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-[var(--color-bg-primary)]/40 transition-all group"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] font-black text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                          {item.subject.charAt(0)}
                        </div>
                        <span className="font-black text-[var(--color-text-primary)] text-lg tracking-tight leading-none">{item.subject}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                       <span className="px-5 py-2 bg-[var(--color-bg-primary)] rounded-xl text-[10px] font-black text-[var(--color-text-primary)] border border-[var(--color-border)] opacity-60">
                          {item.semester}-{t('curriculum.semester_count')}
                       </span>
                    </td>
                    <td className="px-10 py-8 text-center">
                       <div className="flex flex-col items-center gap-1">
                          <span className="text-lg font-black text-[var(--color-text-primary)] leading-none">{item.hours}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] opacity-40">{t('curriculum.hours_count')}</span>
                       </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className="px-6 py-2.5 rounded-2xl bg-emerald-600/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-600/20 shadow-sm shadow-emerald-600/5">
                        {item.credits} {t('curriculum.ects')}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                        item.type === 'required' 
                          ? 'bg-blue-600/10 text-blue-600 border-blue-600/20 shadow-blue-600/5' 
                          : 'bg-purple-600/10 text-purple-600 border-purple-600/20 shadow-purple-600/5'
                      }`}>
                        {t(`curriculum.type_${item.type}`)}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button className="w-12 h-12 rounded-2xl bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] opacity-20 hover:opacity-100 hover:text-indigo-600 hover:bg-indigo-600/10 transition-all flex items-center justify-center shadow-inner">
                        <MoreVertical size={22} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
