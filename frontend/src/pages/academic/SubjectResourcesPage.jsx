import React from "react";
import { motion } from "framer-motion";
import { FileText, Download, Folder, ExternalLink, Search, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";

const RESOURCES = [
  { id: 1, subject: "Algoritmlar", title: "Maruzalar matni", type: "PDF", size: "2.4 MB", date: "2024-02-10" },
  { id: 2, subject: "Algoritmlar", title: "Labaratoriya ishlari", type: "ZIP", size: "15 MB", date: "2024-03-01" },
  { id: 3, subject: "Ma'lumotlar bazasi", title: "Syllabus", type: "DOCX", size: "1.2 MB", date: "2024-01-15" },
  { id: 4, subject: "Web dasturlash", title: "Video darsliklar", type: "Link", size: "-", date: "2024-04-05" },
];

export default function SubjectResourcesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader 
        title={t('nav.resources')} 
        subtitle="O'quv materiallari, darsliklar va amaliy topshiriqlar kutubxonasi"
      />

      <div className="card-premium overflow-hidden shadow-sm">
        <div className="p-8 border-b border-[var(--color-border)] flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--color-bg-primary)]/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 shadow-inner">
               <Folder size={24} />
            </div>
            <h2 className="font-black text-xl text-[var(--color-text-primary)] tracking-tight">Mening fanlarim</h2>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] opacity-40" size={18} />
                <input type="text" placeholder="Resursni qidirish..." className="input-premium pl-12 h-12 w-64 text-sm font-bold" />
             </div>
             <Button variant="secondary" className="h-12 w-12 p-0 flex items-center justify-center" icon={<Filter size={20} />} />
          </div>
        </div>
        
        <div className="divide-y divide-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          {RESOURCES.map((res, i) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-8 hover:bg-[var(--color-bg-primary)]/40 flex flex-col md:flex-row md:items-center justify-between transition-all group gap-6"
            >
              <div className="flex items-center gap-6 flex-1">
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 group-hover:scale-110 transition-all duration-300 shadow-inner group-hover:shadow-lg group-hover:shadow-indigo-600/20">
                  {res.type === 'Link' ? <ExternalLink size={24} /> : <FileText size={24} />}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em]">{res.subject}</p>
                  <h4 className="font-black text-lg text-[var(--color-text-primary)] tracking-tight leading-tight">{res.title}</h4>
                  <p className="text-[10px] text-[var(--color-text-secondary)] font-black uppercase tracking-widest opacity-40">
                    {res.type} • {res.size} • {res.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <Button variant="primary" className="h-12 px-6 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/10 active:scale-95" icon={<Download size={18} />}>
                   {res.type === 'Link' ? "Ko'rish" : "Yuklash"}
                 </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
