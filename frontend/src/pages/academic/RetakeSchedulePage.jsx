import React from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, User, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/ui/PageHeader";

const RETAKE_CLASSES = [
  { id: 1, subject: "Algoritmlar", day: "Shanba", time: "14:00 - 15:20", room: "302-A", teacher: "A. Karimov" },
  { id: 2, subject: "Ma'lumotlar bazasi", day: "Shanba", time: "15:30 - 16:50", room: "201-B", teacher: "S. Olimov" },
];

export default function RetakeSchedulePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <PageHeader
        title={t('academic.retake_schedule', 'Q.O\'qish mashg\'ulotlari')}
        subtitle={t('academic.retake_schedule_subtitle', 'Qayta o\'qish fanlari uchun dars jadvali')}
        icon={<RefreshCw size={24} className="text-indigo-600" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {RETAKE_CLASSES.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="card-premium p-8 shadow-sm group hover:border-indigo-600/30 transition-all"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest">
                {item.day}
              </span>
            </div>
            
            <h3 className="text-xl font-black text-[var(--color-text-primary)] mb-6 group-hover:text-indigo-600 transition-colors tracking-tight">
              {item.subject}
            </h3>

            <div className="space-y-4">
              {[
                { icon: <Clock size={18} className="text-indigo-600" />, label: t('academic.time', 'Vaqt'), value: item.time },
                { icon: <MapPin size={18} className="text-rose-500" />, label: t('academic.room', 'Auditoriya'), value: item.room },
                { icon: <User size={18} className="text-emerald-500" />, label: t('dashboard.teachers', 'O\'qituvchi'), value: item.teacher },
              ].map((row, j) => (
                <div key={j} className="flex items-center gap-4 text-[var(--color-text-secondary)]">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-primary)] flex items-center justify-center border border-[var(--color-border)]">
                    {row.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest opacity-40">{row.label}</p>
                    <p className="font-bold text-[var(--color-text-primary)]">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
