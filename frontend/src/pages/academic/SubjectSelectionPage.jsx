import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Info, Plus, BookOpen, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";

const AVAILABLE_SUBJECTS = [
  { id: 1, name: "Data Science asoslari", credits: 6, teacher: "D. To'rayev", type: "Tanlov" },
  { id: 2, name: "Mobile Development (Flutter)", credits: 6, teacher: "F. Ahmedov", type: "Tanlov" },
  { id: 3, name: "Bulutli texnologiyalar", credits: 4, teacher: "G. Saidova", type: "Tanlov" },
  { id: 4, name: "Dizayn tizimlari", credits: 4, teacher: "K. Olimov", type: "Tanlov" },
];

export default function SubjectSelectionPage() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const totalCredits = selected.reduce((acc, id) => {
    const sub = AVAILABLE_SUBJECTS.find(s => s.id === id);
    return acc + (sub ? sub.credits : 0);
  }, 0);

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <PageHeader 
        title={t('nav.subject_selection', 'Fan tanlovi')} 
        subtitle="Keyingi o'quv semestri uchun tanlov fanlarini belgilang"
        actions={
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-[var(--color-text-secondary)] uppercase font-black tracking-[0.2em] opacity-40">Tanlangan kreditlar</p>
              <p className={`text-2xl font-black transition-colors ${totalCredits > 12 ? 'text-rose-500' : 'text-indigo-600'}`}>
                {totalCredits} <span className="text-sm opacity-40 text-[var(--color-text-secondary)]">/ 12 ECTS</span>
              </p>
            </div>
            <Button variant="primary" className="h-14 px-10 font-black rounded-2xl shadow-xl shadow-indigo-600/20" disabled={selected.length === 0 || totalCredits > 12}>
              Tasdiqlash
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {AVAILABLE_SUBJECTS.map((sub, i) => {
          const isSelected = selected.includes(sub.id);
          return (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => toggleSelect(sub.id)}
              className={`
                relative cursor-pointer p-10 rounded-[2.5rem] border-2 transition-all duration-500 group shadow-sm
                ${isSelected 
                  ? 'border-indigo-600 bg-indigo-600/5 shadow-indigo-600/5' 
                  : 'border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-indigo-600/30'}
              `}
            >
              {isSelected && (
                <div className="absolute top-6 right-6 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg animate-bounce-subtle">
                  <Check size={20} strokeWidth={4} />
                </div>
              )}
              
              <div className="flex items-start gap-8">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-300 shadow-inner ${
                  isSelected ? 'bg-indigo-600 text-white shadow-none' : 'bg-[var(--color-bg-primary)] text-indigo-600'
                }`}>
                  <BookOpen size={32} />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="font-black text-2xl text-[var(--color-text-primary)] tracking-tight mb-1 group-hover:text-indigo-600 transition-colors">{sub.name}</h3>
                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)] opacity-60 font-bold text-sm">
                       <GraduationCap size={16} /> {sub.teacher}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-2">
                    <span className="px-4 py-1.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">
                      {sub.credits} Kredit
                    </span>
                    <span className="px-4 py-1.5 rounded-xl bg-indigo-600/10 text-indigo-600 border border-indigo-600/10 text-[10px] font-black uppercase tracking-[0.2em]">
                      {sub.type}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-indigo-600 p-10 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-10 shadow-xl shadow-indigo-600/10"
      >
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20">
          <Info size={32} />
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="text-xl font-black tracking-tight">Muhim eslatma:</h4>
          <p className="text-sm text-indigo-100 font-bold opacity-80 leading-relaxed">
            Siz kamida 2 ta tanlov fanini tanlashingiz shart (jami 12 kreditgacha). 
            Tanlov fani tasdiqlangandan so'ng uni o'zgartirish faqat dekanat orqali amalga oshiriladi.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
