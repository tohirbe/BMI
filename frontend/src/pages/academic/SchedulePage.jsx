import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/ui/PageHeader";

const WEEKDAYS = [
  { key: "mon" },
  { key: "tue" },
  { key: "wed" },
  { key: "thu" },
  { key: "fri" },
  { key: "sat" },
];

const SCHEDULE_DATA = {
  mon: [
    { id: 1, subject: "Algoritmlar", type: "lecture", room: "302", teacher: "A. Karimov", time: "08:30 - 09:50", pair: 1 },
    { id: 2, subject: "Algoritmlar", type: "practice", room: "405", teacher: "A. Karimov", time: "10:00 - 11:20", pair: 2 },
  ],
  tue: [
    { id: 3, subject: "Ma'lumotlar bazasi", type: "lecture", room: "201", teacher: "S. Olimov", time: "11:30 - 12:50", pair: 3 },
    { id: 4, subject: "Kiberxavfsizlik", type: "lecture", room: "504", teacher: "B. Azizov", time: "14:00 - 15:20", pair: 4 },
  ],
  wed: [
    { id: 5, subject: "Web dasturlash", type: "practice", room: "Lab-3", teacher: "N. Saidova", time: "08:30 - 09:50", pair: 1 },
    { id: 6, subject: "Web dasturlash", type: "lecture", room: "102", teacher: "N. Saidova", time: "10:00 - 11:20", pair: 2 },
  ],
  thu: [
    { id: 7, subject: "Sun'iy intellekt", type: "lecture", room: "408", teacher: "D. Alimov", time: "11:30 - 12:50", pair: 3 },
  ],
  fri: [
    { id: 8, subject: "Ingliz tili", type: "practice", room: "205", teacher: "M. Jones", time: "08:30 - 09:50", pair: 1 },
    { id: 9, subject: "Falsafa", type: "lecture", room: "Akt zal", teacher: "R. Ergashev", time: "10:00 - 11:20", pair: 2 },
  ],
  sat: [
    { id: 10, subject: "Sport", type: "practice", room: "Sport zal", teacher: "G. Gulyamov", time: "08:30 - 09:50", pair: 1 },
  ],
};

export default function SchedulePage() {
  const { t } = useTranslation();
  const [activeDay, setActiveDay] = React.useState("mon");

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader 
        title={t('nav.schedule')} 
        subtitle={t('academic.schedule_subtitle')}
        actions={
          <div className="flex items-center gap-2 bg-[var(--color-bg-secondary)] p-1.5 rounded-2xl border border-[var(--color-border)] shadow-sm">
            <button className="p-2 hover:bg-[var(--color-bg-primary)] rounded-xl transition-all">
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 font-black text-xs uppercase tracking-widest opacity-60">{t('academic.spring_semester')}, 2024</span>
            <button className="p-2 hover:bg-[var(--color-bg-primary)] rounded-xl transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        }
      />

      {/* Day Selector */}
      <div className="flex flex-wrap gap-4">
        {WEEKDAYS.map((day) => (
          <button
            key={day.key}
            onClick={() => setActiveDay(day.key)}
            className={`
              px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300
              ${activeDay === day.key 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 scale-105' 
                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] border border-[var(--color-border)]'}
            `}
          >
            {t(`academic.weekdays.${day.key}`)}
          </button>
        ))}
      </div>

      {/* Timeline / Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {SCHEDULE_DATA[activeDay]?.length > 0 ? (
          SCHEDULE_DATA[activeDay].map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative group card-premium p-10 hover:border-indigo-600/30 shadow-sm"
            >
              {/* Pair Indicator */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-16 bg-indigo-600 rounded-2xl flex flex-col items-center justify-center text-white shadow-xl shadow-indigo-600/30">
                <span className="text-[9px] font-black uppercase opacity-60 leading-none mb-1">{t('academic.pair').charAt(0)}</span>
                <span className="text-lg font-black leading-none">{item.pair}</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-6 flex-1">
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border ${
                      item.type === 'lecture' ? 'bg-blue-600/10 text-blue-600 border-blue-600/10' : 'bg-orange-600/10 text-orange-600 border-orange-600/10'
                    }`}>
                      {t(`academic.lesson_types.${item.type}`)}
                    </span>
                    <h3 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight group-hover:text-indigo-600 transition-colors">{item.subject}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3 text-[var(--color-text-secondary)] text-sm font-black opacity-60">
                      <Clock size={18} className="text-indigo-600" />
                      <span>{item.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[var(--color-text-secondary)] text-sm font-black opacity-60">
                      <MapPin size={18} className="text-rose-500" />
                      <span>{item.room} {t('academic.room').toLowerCase()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[var(--color-text-secondary)] text-sm font-black opacity-60 pt-2 border-t border-[var(--color-border)]">
                    <User size={18} className="text-emerald-500" />
                    <span>{item.teacher}</span>
                  </div>
                </div>

                <div className="hidden md:block">
                  <div className="w-24 h-24 rounded-[2rem] bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] opacity-10 group-hover:text-indigo-600 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 shadow-inner">
                    <Calendar size={48} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-40 text-center space-y-8 card-premium bg-[var(--color-bg-primary)]/20 border-dashed border-2">
            <div className="w-24 h-24 bg-[var(--color-bg-secondary)] rounded-[2.5rem] flex items-center justify-center mx-auto text-[var(--color-text-secondary)] opacity-10 shadow-inner">
              <Calendar size={56} />
            </div>
            <p className="text-[var(--color-text-secondary)] font-black uppercase tracking-[0.3em] text-sm opacity-40">{t('academic.no_lessons')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
