import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Info, GraduationCap, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/ui/PageHeader";

const STEPS = [
  { id: 1, title: "Kafedra qarzi", status: "ok", date: "2024-05-01" },
  { id: 2, title: "Kutubxona qarzi", status: "ok", date: "2024-05-03" },
  { id: 3, title: "Buxgalteriya (Kontrakt)", status: "ok", date: "2024-05-05" },
  { id: 4, title: "Talabalar turar joyi", status: "ok", date: "2024-05-06" },
  { id: 5, title: "Arxiv (Hujjatlar)", status: "pending", date: "-" },
];

export default function GraduationSheetPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader 
        title={t('student.grad_sheet_title')} 
        subtitle="Universitetdan qarzdorlik yo'qligini tasdiqlovchi elektron aylanma varaqa"
      />

      <div className="card-premium overflow-hidden shadow-sm">
        <div className="p-10 bg-indigo-600 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
          <div className="absolute right-[-20px] top-[-20px] w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
          <div className="flex items-center gap-8 relative z-10">
             <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl">
                <ShieldCheck size={32} />
             </div>
             <div>
                <h2 className="text-2xl font-black tracking-tight leading-tight">Aylanma varaqa holati</h2>
                <p className="text-indigo-100 text-sm font-bold opacity-80 mt-1">Bitiruvchi: Karimov Sherzod Alisherovich</p>
             </div>
          </div>
          <div className="text-6xl font-black opacity-30 italic tracking-tighter relative z-10">80%</div>
        </div>

        <div className="p-10 space-y-6 bg-[var(--color-bg-secondary)]">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-[1.5rem] bg-[var(--color-bg-primary)]/40 border border-[var(--color-border)] hover:border-indigo-600/30 transition-all group gap-6"
            >
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  step.status === 'ok' 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] opacity-20 border border-[var(--color-border)]'
                }`}>
                  {step.status === 'ok' ? <CheckCircle2 size={24} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                </div>
                <div>
                  <h4 className="text-lg font-black text-[var(--color-text-primary)] group-hover:text-indigo-600 transition-colors tracking-tight leading-tight">{step.title}</h4>
                  <p className="text-[10px] text-[var(--color-text-secondary)] font-black uppercase tracking-[0.2em] opacity-40 mt-1">{step.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${
                   step.status === 'ok' 
                     ? 'bg-emerald-600/10 text-emerald-600 border-emerald-600/10' 
                     : 'bg-amber-600/10 text-amber-600 border-amber-600/10'
                 }`}>
                   {step.status === 'ok' ? 'Tasdiqlangan' : 'Jarayonda'}
                 </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-10 bg-amber-600/5 border-amber-600/20 border-l-[6px] border-l-amber-600 flex flex-col md:flex-row items-start gap-8 shadow-sm"
      >
        <div className="w-16 h-16 rounded-2xl bg-amber-600/10 flex items-center justify-center text-amber-600 shadow-inner">
           <Info size={32} />
        </div>
        <div className="flex-1 space-y-2">
           <h4 className="text-xl font-black text-amber-700 dark:text-amber-500 tracking-tight">Diqqat! Muhim eslatma</h4>
           <p className="text-sm text-amber-600/80 font-bold leading-relaxed">
             Barcha bo'limlar tasdiqlanganidan so'nggina sizga diplom nusxasi va asl nusxasi beriladi. Hujjatlarni arxivga topshirishni unutmang.
           </p>
        </div>
      </motion.div>
    </div>
  );
}
