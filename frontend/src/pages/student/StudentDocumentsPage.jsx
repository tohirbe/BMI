import React from "react";
import { motion } from "framer-motion";
import { File, Download, Eye, Shield, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/ui/PageHeader";

const DOCUMENTS = [
  { id: 1, title: "Passport nusxasi", type: "PDF", size: "1.2 MB", date: "2021-08-20", verified: true },
  { id: 2, title: "Diplom nusxasi (maktab/litsey)", type: "JPG", size: "2.5 MB", date: "2021-08-20", verified: true },
  { id: 3, title: "Tibbiy ma'lumotnoma (086)", type: "PDF", size: "0.8 MB", date: "2021-08-21", verified: false },
];

export default function StudentDocumentsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader 
        title={t('student.documents_title')} 
        subtitle="Sizning shaxsiy va o'quv hujjatlaringiz xavfsiz arxivi"
        actions={
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 shadow-inner">
            <Shield size={28} />
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {DOCUMENTS.map((doc, i) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="card-premium p-10 relative group hover:border-indigo-600/30 transition-all duration-500 shadow-sm"
          >
            {doc.verified && (
              <div className="absolute top-6 right-6 text-emerald-500" title="Verified">
                <CheckCircle size={20} fill="currentColor" className="text-emerald-500/10" />
              </div>
            )}
            
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] opacity-40 group-hover:bg-indigo-600 group-hover:text-white group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 shadow-inner group-hover:shadow-lg group-hover:shadow-indigo-600/20 mb-8">
              <File size={32} />
            </div>
            
            <h3 className="font-black text-xl text-[var(--color-text-primary)] mb-2 tracking-tight group-hover:text-indigo-600 transition-colors">{doc.title}</h3>
            <p className="text-[10px] text-[var(--color-text-secondary)] font-black opacity-40 mb-10 uppercase tracking-[0.2em]">{doc.type} • {doc.size} • {doc.date}</p>

            <div className="flex gap-4">
              <button className="flex-1 py-4 rounded-2xl bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] text-[10px] font-black uppercase tracking-widest border border-[var(--color-border)] hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95">
                <Eye size={16} /> Ko'rish
              </button>
              <button className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/20 active:scale-95">
                <Download size={16} /> Yuklash
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card-premium p-10 bg-indigo-600/5 border-dashed border-2 border-indigo-600/20 flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
               <Shield size={28} />
            </div>
            <div className="space-y-1">
               <h4 className="text-xl font-black text-[var(--color-text-primary)] tracking-tight">Hujjatlar xavfsizligi</h4>
               <p className="text-sm text-[var(--color-text-secondary)] font-bold opacity-60">Barcha hujjatlar shifrlangan va faqat sizning ruxsatingiz bilan foydalaniladi.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
