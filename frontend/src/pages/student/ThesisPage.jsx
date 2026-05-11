import React from "react";
import { motion } from "framer-motion";
import { BookOpen, User, Calendar, FileText, CheckCircle, Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";

export default function ThesisPage() {
  const { t } = useTranslation();
  const thesis = {
    title: "Sun'iy intellekt tizimlarida ma'lumotlar xavfsizligini ta'minlash algoritmlari",
    advisor: "dots. Alimov Aziziddin",
    status: "Himoya jarayonida",
    deadline: "2024-06-15",
    description: "Ushbu bitiruv malakaviy ishi zamonaviy AI tizimlarida maxfiylikni saqlash va ma'lumotlar sizib chiqishini oldini olish masalalariga bag'ishlangan.",
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12 max-w-5xl mx-auto">
      <PageHeader 
        title={t('student.thesis_title')} 
        subtitle="Bitiruv malakaviy ishi va magistrlik dissertatsiyasi ma'lumotlari"
        actions={
          <div className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20">
            {thesis.status}
          </div>
        }
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-12 relative overflow-hidden group shadow-md"
      >
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
           <BookOpen size={240} className="text-indigo-600" />
        </div>
        
        <h2 className="text-3xl font-black text-[var(--color-text-primary)] mb-10 leading-tight tracking-tight max-w-3xl">
          "{thesis.title}"
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div className="flex items-center gap-6 group/item">
            <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600/10 flex items-center justify-center text-indigo-600 shadow-inner group-hover/item:scale-110 transition-transform">
              <User size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] opacity-40 mb-1">Ilmiy rahbar</p>
              <p className="text-xl font-black text-[var(--color-text-primary)] tracking-tight">{thesis.advisor}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 group/item">
            <div className="w-16 h-16 rounded-[1.5rem] bg-rose-600/10 flex items-center justify-center text-rose-600 shadow-inner group-hover/item:scale-110 transition-transform">
              <Calendar size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] opacity-40 mb-1">Himoya muddati</p>
              <p className="text-xl font-black text-[var(--color-text-primary)] tracking-tight">{thesis.deadline}</p>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[2rem] bg-[var(--color-bg-primary)]/40 border border-[var(--color-border)] mb-12 relative">
          <div className="absolute -top-4 left-8 px-4 py-1 bg-indigo-600 rounded-lg text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-600/20">Annotatsiya</div>
          <p className="text-lg text-[var(--color-text-secondary)] font-bold italic leading-relaxed opacity-80 pt-2">
            {thesis.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <Button variant="primary" className="flex-1 h-16 text-sm font-black rounded-2xl shadow-xl shadow-indigo-600/20" icon={<FileText size={22} />}>
            Ishni yuklash (.pdf)
          </Button>
          <Button variant="secondary" className="flex-1 h-16 text-sm font-black rounded-2xl border-2" icon={<CheckCircle size={22} />}>
            Taqrizni ko'rish
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { label: "Anti-plagiat", value: "92%", icon: <Award className="text-emerald-500" /> },
           { label: "Sahifalar", value: "85", icon: <FileText className="text-indigo-500" /> },
           { label: "Manbalar", value: "42", icon: <BookOpen className="text-rose-500" /> },
         ].map((stat, i) => (
           <motion.div
             key={i}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5 + i * 0.1 }}
             className="card-premium p-8 flex items-center gap-6 shadow-sm"
           >
             <div className="w-14 h-14 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center shadow-inner">
                {stat.icon}
             </div>
             <div>
                <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] opacity-40 mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-[var(--color-text-primary)] tracking-tighter">{stat.value}</p>
             </div>
           </motion.div>
         ))}
      </div>
    </div>
  );
}
