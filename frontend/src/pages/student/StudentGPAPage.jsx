import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Award, BarChart3, Star, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import PageHeader from "../../components/ui/PageHeader";

const GPA_HISTORY = [
  { semester: "1-sem", gpa: 3.5 },
  { semester: "2-sem", gpa: 3.7 },
  { semester: "3-sem", gpa: 3.6 },
  { semester: "4-sem", gpa: 3.82 },
];

export default function StudentGPAPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader 
        title={t('nav.gpa', 'GPA Holati')} 
        subtitle="Akademik o'zlashtirish ko'rsatkichlari va ballar dinamikasi tahlili"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Joriy GPA", value: "3.82", icon: <Star size={28} />, color: "bg-indigo-600 shadow-indigo-600/20" },
          { label: "Reyting holati", value: "A'lo", icon: <Award size={28} />, color: "bg-emerald-600 shadow-emerald-600/20" },
          { label: "Guruhda o'rni", value: "2-o'rin", icon: <TrendingUp size={28} />, color: "bg-amber-500 shadow-amber-500/20" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-premium p-8 flex items-center gap-6 shadow-sm"
          >
            <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] text-[var(--color-text-secondary)] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-10 shadow-sm"
      >
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-xl font-black text-[var(--color-text-primary)] flex items-center gap-4 tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
               <BarChart3 size={24} />
            </div>
            GPA O'zgarish dinamikasi
          </h3>
          <div className="flex items-center gap-3 bg-[var(--color-bg-primary)] px-4 py-2 rounded-xl border border-[var(--color-border)]">
             <div className="w-2 h-2 rounded-full bg-indigo-600" />
             <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Semestrlar kesimida</span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={GPA_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis 
                dataKey="semester" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: 'var(--color-text-secondary)', fontSize: 11, fontWeight: 900}} 
                dy={10}
              />
              <YAxis 
                domain={[0, 4]} 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: 'var(--color-text-secondary)', fontSize: 11, fontWeight: 900}} 
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '1.5rem', 
                  border: '1px solid var(--color-border)', 
                  backgroundColor: 'var(--color-bg-secondary)',
                  color: 'var(--color-text-primary)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.1)' 
                }}
              />
              <Line 
                type="monotone" 
                dataKey="gpa" 
                stroke="#6366f1" 
                strokeWidth={5} 
                dot={{ r: 8, fill: '#6366f1', strokeWidth: 4, stroke: 'var(--color-bg-secondary)' }}
                activeDot={{ r: 10, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="bg-indigo-600 p-10 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-indigo-600/10">
         <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20">
            <Info size={32} />
         </div>
         <div className="flex-1 space-y-1">
            <h4 className="text-xl font-black tracking-tight">GPA qanday hisoblanadi?</h4>
            <p className="text-sm text-indigo-100 font-bold opacity-80">GPA balingiz har bir fandan olingan baholar va ularning kredit miqdori asosida o'rtacha hisoblanadi. Bu ko'rsatkich sizning umumiy akademik natijangizni ifodalaydi.</p>
         </div>
         <button className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm shadow-lg hover:scale-105 transition-all shrink-0">Batafsil ma'lumot</button>
      </div>
    </div>
  );
}
