import React from "react";
import { motion } from "framer-motion";
import { FileCheck, Plus, Download, ShieldCheck, FileText, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";

const CERTIFICATES = [
  { id: 1, type: "O'qish joyidan ma'lumotnoma", date: "20.03.2024", status: "Tayyor", code: "C-123456", recipient: "Talab qilingan joyga" },
  { id: 2, type: "Bitiruvchi ma'lumotnomasi", date: "10.05.2024", status: "Jarayonda", code: "-", recipient: "Ish beruvchiga" },
];

export default function StudentCertificatesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader 
        title={t('nav.certificates', "Ma'lumotnomalar")} 
        subtitle="Elektron ma'lumotnomalar olish va ularning holatini kuzatish tizimi"
        actions={
          <Button variant="primary" className="h-14 px-10 font-black rounded-2xl shadow-xl shadow-indigo-600/20" icon={<Plus size={22} />}>
            Yangi so'rov
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {CERTIFICATES.map((cert, i) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-premium p-10 relative overflow-hidden group shadow-md"
          >
            <div className="absolute -top-10 -right-10 p-10 opacity-[0.03] transition-transform group-hover:scale-110 duration-700">
              <FileText size={200} className="text-[var(--color-text-primary)]" />
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border ${
                  cert.status === 'Tayyor' 
                    ? 'bg-emerald-600/10 text-emerald-600 border-emerald-600/20' 
                    : 'bg-amber-600/10 text-amber-600 border-amber-600/20'
                }`}>
                  {cert.status}
                </span>
                <div className="flex items-center gap-2 text-[10px] font-black text-[var(--color-text-secondary)] opacity-40 uppercase tracking-widest">
                   {cert.date}
                </div>
              </div>

              <h3 className="text-2xl font-black text-[var(--color-text-primary)] mb-3 tracking-tight">{cert.type}</h3>
              <p className="text-sm font-bold text-[var(--color-text-secondary)] opacity-60 mb-10 flex items-center gap-2">
                 <ExternalLink size={14} /> {cert.recipient}
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                 <div className="p-4 bg-[var(--color-bg-primary)]/50 rounded-2xl border border-[var(--color-border)]">
                    <p className="text-[9px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest opacity-40 mb-1">Hujjat kodi</p>
                    <p className="text-sm font-black text-[var(--color-text-primary)]">{cert.code}</p>
                 </div>
                 <div className="p-4 bg-[var(--color-bg-primary)]/50 rounded-2xl border border-[var(--color-border)]">
                    <p className="text-[9px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest opacity-40 mb-1">Tasdiqlash</p>
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-xs">
                       <ShieldCheck size={14} /> QR-Code
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  variant={cert.status === 'Tayyor' ? 'primary' : 'secondary'} 
                  className="flex-1 font-black h-14 rounded-2xl" 
                  disabled={cert.status !== 'Tayyor'}
                  icon={<Download size={20} />}
                >
                  Hujjatni yuklash
                </Button>
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-bg-primary)] flex items-center justify-center text-[var(--color-text-secondary)] border border-[var(--color-border)] shadow-inner transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600">
                  <ShieldCheck size={28} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
