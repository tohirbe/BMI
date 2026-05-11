import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/ui/PageHeader";

const EXAMS = [
  { id: 1, subject: "Algoritmlar", type: "midterm", date: "2024-05-15", time: "10:00", room: "302-A" },
  { id: 2, subject: "Ma'lumotlar bazasi", type: "final", date: "2024-06-20", time: "14:00", room: "Katta zal" },
  { id: 3, subject: "Web dasturlash", type: "midterm", date: "2024-05-22", time: "09:00", room: "405-lab" },
];

export default function ExamSchedulePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader 
        title={t('nav.exam_schedule')} 
        subtitle="Oraliq va yakuniy nazoratlar o'tkazilish jadvali"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {EXAMS.map((exam, i) => (
          <motion.div
            key={exam.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group card-premium p-10 relative overflow-hidden group hover:border-indigo-600/30 transition-all duration-500 shadow-sm"
          >
            <div className={`absolute top-0 left-0 w-full h-1.5 ${exam.type === 'final' ? 'bg-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.4)]' : 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]'}`}></div>
            
            <div className="flex items-center justify-between mb-8">
              <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border ${
                exam.type === 'final' 
                  ? 'bg-rose-600/10 text-rose-600 border-rose-600/10' 
                  : 'bg-indigo-600/10 text-indigo-600 border-indigo-600/10'
              }`}>
                {t(`academic.exam_types.${exam.type}`)}
              </span>
              <AlertCircle size={20} className="text-[var(--color-text-secondary)] opacity-20 group-hover:opacity-100 group-hover:text-indigo-600 transition-all" />
            </div>

            <h3 className="text-2xl font-black mb-8 text-[var(--color-text-primary)] tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">{exam.subject}</h3>

            <div className="space-y-5 pt-8 border-t border-[var(--color-border)]">
              <div className="flex items-center gap-4 text-[var(--color-text-secondary)] text-sm font-black opacity-60">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-primary)] flex items-center justify-center text-indigo-600 shadow-inner">
                   <Calendar size={18} />
                </div>
                <span>{exam.date}</span>
              </div>
              <div className="flex items-center gap-4 text-[var(--color-text-secondary)] text-sm font-black opacity-60">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-primary)] flex items-center justify-center text-emerald-600 shadow-inner">
                   <Clock size={18} />
                </div>
                <span>{exam.time}</span>
              </div>
              <div className="flex items-center gap-4 text-[var(--color-text-secondary)] text-sm font-black opacity-60">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-primary)] flex items-center justify-center text-rose-600 shadow-inner">
                   <MapPin size={18} />
                </div>
                <span>{exam.room} {t('academic.room').toLowerCase()}</span>
              </div>
            </div>

            <button className="w-full mt-10 py-4 rounded-2xl bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-black text-xs uppercase tracking-widest border border-[var(--color-border)] hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300 active:scale-95">
               Eslatma qo'shish
            </button>
          </motion.div>
        ))}
      </div>

      <div className="bg-indigo-600 p-12 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
         <div className="absolute right-[-20px] top-[-20px] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
         <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl">
            <Calendar size={40} className="text-white" />
         </div>
         <div className="flex-1 space-y-2 relative z-10">
            <h4 className="text-2xl font-black tracking-tight">Taqvim bilan integratsiya</h4>
            <p className="text-indigo-100 font-bold opacity-80 leading-relaxed">Imtihonlar jadvalini Google Calendar yoki boshqa taqvim ilovalariga avtomatik ravishda sinxronizatsiya qilishingiz mumkin.</p>
         </div>
         <button className="px-10 py-5 bg-white text-indigo-600 rounded-[1.5rem] font-black text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all relative z-10">
            Sinxronlash
         </button>
      </div>
    </div>
  );
}
