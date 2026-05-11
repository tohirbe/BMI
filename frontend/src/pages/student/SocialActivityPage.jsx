import React from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Users, Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/ui/PageHeader";

const ACTIVITIES = [
  { id: 1, title: "Universitet voleybol jamoasi a'zosi", type: "Sport", date: "2023-hozigacha", points: 15 },
  { id: 2, title: "Zakovat intellektual o'yini g'olibi", type: "Intellektual", date: "2024-03-12", points: 20 },
  { id: 3, title: "Volontyorlik faoliyati (Xayriya tadbiri)", type: "Ijtimoiy", date: "2023-12-15", points: 10 },
];

export default function SocialActivityPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader 
        title={t('nav.social', 'Ijtimoiy faollik')} 
        subtitle="Talabaning darsdan tashqari faoliyati va erishgan yutuqlari monitoringi"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Umumiy ball", value: "45 ball", icon: <Trophy size={28} />, color: "bg-amber-600 shadow-amber-600/20" },
          { label: "Tadbirlar soni", value: "12 ta", icon: <Star size={28} />, color: "bg-indigo-600 shadow-indigo-600/20" },
          { label: "Reyting (Fakultet)", value: "Top 5%", icon: <Users size={28} />, color: "bg-emerald-600 shadow-emerald-600/20" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-premium p-8 flex items-center gap-6 shadow-sm group hover:scale-[1.02] transition-all duration-300"
          >
            <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] text-[var(--color-text-secondary)] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {ACTIVITIES.map((act, i) => (
          <motion.div
            key={act.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-premium p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-indigo-600/30 transition-all shadow-sm border-l-[6px] border-l-indigo-600"
          >
            <div className="flex items-center gap-8">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-bg-primary)] flex items-center justify-center text-[var(--color-text-secondary)] group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 border border-[var(--color-border)] shadow-inner">
                <Award size={28} />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-lg text-[var(--color-text-primary)] tracking-tight">{act.title}</h4>
                <div className="flex items-center gap-3">
                   <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest bg-indigo-600/5 px-3 py-1 rounded-lg border border-indigo-600/10">{act.type}</span>
                   <span className="text-[10px] text-[var(--color-text-secondary)] font-black uppercase tracking-widest opacity-40">{act.date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] text-[var(--color-text-secondary)] font-black uppercase tracking-widest opacity-40 mb-1">To'plangan ball</p>
                <span className="px-6 py-2.5 rounded-2xl bg-emerald-600/10 text-emerald-600 text-sm font-black border border-emerald-600/20 shadow-sm">
                  +{act.points} ball
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
