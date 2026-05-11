import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, FileText, Download, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/ui/PageHeader";

const REPORTS = [
  { id: 1, title: "BMI Birinchi bob", date: "2024-04-15", similarity: 12, status: "passed", type: "Dissertatsiya" },
  { id: 2, title: "Kurs ishi - Algoritmlar", date: "2024-03-10", similarity: 45, status: "warning", type: "Kurs ishi" },
];

export default function PlagiarismInfoPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader 
        title={t('nav.plagiarism', 'Plagiat nazorati')} 
        subtitle="Ilmiy ishlar va topshiriqlarni originallikka tekshirish tizimi natijalari"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {REPORTS.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-premium p-10 relative overflow-hidden group shadow-md"
          >
            <div className={`absolute -top-6 -right-6 p-10 transition-transform group-hover:scale-110 duration-500 opacity-5 ${report.status === 'passed' ? 'text-emerald-500' : 'text-amber-500'}`}>
              {report.status === 'passed' ? <ShieldCheck size={160} /> : <ShieldAlert size={160} />}
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-10">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-xl ${
                  report.status === 'passed' ? 'bg-emerald-600 text-white shadow-emerald-600/20' : 'bg-amber-600 text-white shadow-amber-600/20'
                }`}>
                  <FileText size={32} />
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
                  report.status === 'passed' ? 'bg-emerald-600/10 text-emerald-600 border-emerald-600/20' : 'bg-amber-600/10 text-amber-600 border-amber-600/20'
                }`}>
                  {report.status === 'passed' ? 'Taqdim etildi' : 'Qayta ishlash kerak'}
                </div>
              </div>

              <div className="space-y-2 mb-12">
                <h3 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">{report.title}</h3>
                <div className="flex items-center gap-3">
                   <span className="text-[10px] text-[var(--color-text-secondary)] font-black uppercase tracking-widest opacity-40">{report.type}</span>
                   <span className="text-[10px] text-[var(--color-text-secondary)] font-black uppercase tracking-widest opacity-20">•</span>
                   <span className="text-[10px] text-[var(--color-text-secondary)] font-black uppercase tracking-widest opacity-40">{report.date}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10 bg-[var(--color-bg-primary)]/50 p-8 rounded-[2rem] border border-[var(--color-border)] mb-10">
                <div>
                  <p className="text-[10px] text-[var(--color-text-secondary)] font-black uppercase tracking-widest mb-3 opacity-60">Originallik</p>
                  <p className={`text-5xl font-black tracking-tighter ${report.status === 'passed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {100 - report.similarity}%
                  </p>
                </div>
                <div className="border-l border-[var(--color-border)] pl-10">
                  <p className="text-[10px] text-[var(--color-text-secondary)] font-black uppercase tracking-widest mb-3 opacity-60">O'xshashlik</p>
                  <p className="text-3xl font-black text-[var(--color-text-primary)] opacity-80">{report.similarity}%</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 h-14 rounded-2xl bg-indigo-600 text-white font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-3">
                  <FileText size={20} />
                  To'liq hisobot
                </button>
                <button className="w-14 h-14 rounded-2xl bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] flex items-center justify-center border border-[var(--color-border)] hover:bg-indigo-600 hover:text-white transition-all shadow-inner group-hover:shadow-none">
                  <Download size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card-premium p-10 bg-indigo-600/5 border-dashed border-2 border-indigo-600/20 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="space-y-2 text-center md:text-left">
            <h4 className="text-xl font-black text-[var(--color-text-primary)]">Yangi hujjatni tekshirish</h4>
            <p className="text-sm text-[var(--color-text-secondary)] font-bold opacity-60">Faylingizni yuklang va plagiat tizimi orqali tekshirib ko'ring</p>
         </div>
         <button className="h-14 px-10 rounded-2xl bg-indigo-600 text-white font-black text-sm shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all">
            Hujjatni yuklash
         </button>
      </div>
    </div>
  );
}
