import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, ShieldCheck, Calendar, Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/ui/PageHeader";

const CERTIFICATES = [
  { id: 1, name: "IELTS 7.5", issuer: "British Council", date: "2023-11-10", score: "7.5", type: "Til sertifikati" },
  { id: 2, name: "Oracle SQL Expert", issuer: "Oracle Academy", date: "2024-02-15", score: "92/100", type: "Professional" },
  { id: 3, name: "Google Data Analytics", issuer: "Coursera / Google", date: "2024-04-01", score: "Passed", type: "Online Course" },
];

export default function SubjectCertificatesListPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader 
        title={t('nav.cert_list')} 
        subtitle="O'quv fanlaridan olingan va tasdiqlangan xalqaro sertifikatlar ro'yxati"
        actions={
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 shadow-inner">
            <Award size={28} />
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {CERTIFICATES.map((cert, i) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-premium p-10 relative overflow-hidden group hover:border-indigo-600/30 transition-all duration-500 shadow-sm"
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            
            <div className="flex items-center gap-2 mb-6">
              <span className="px-4 py-1.5 bg-indigo-600/10 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-indigo-600/10">
                {cert.type}
              </span>
            </div>

            <h3 className="text-2xl font-black text-[var(--color-text-primary)] mb-2 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors">{cert.name}</h3>
            <p className="text-sm font-bold text-[var(--color-text-secondary)] opacity-60 mb-8">{cert.issuer}</p>

            <div className="space-y-5 mb-10 pt-8 border-t border-[var(--color-border)]">
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)] opacity-40">
                <Calendar size={18} className="text-indigo-600" />
                <span>Olingan sana: <b className="text-[var(--color-text-primary)] opacity-100">{cert.date}</b></span>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)] opacity-40">
                <ShieldCheck size={18} className="text-emerald-600" />
                <span>Natija: <b className="text-emerald-600 opacity-100">{cert.score}</b></span>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-4 py-4 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-2xl font-black text-xs uppercase tracking-widest border border-[var(--color-border)] hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95">
              Sertifikatni ko'rish <ExternalLink size={18} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
