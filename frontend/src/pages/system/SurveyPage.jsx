import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronRight, ChevronLeft, Send, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function SurveyPage({ title, titleKey }) {
  const { t } = useTranslation();
  const resolvedTitle = titleKey ? t(titleKey) : title;
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  // Get localized questions from i18n
  const questions = useMemo(() => {
    return t('system.questions', { returnObjects: true }) || [];
  }, [t]);

  const handleSelect = (opt) => {
    setAnswers({ ...answers, [currentIdx]: opt });
  };

  const next = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx(currentIdx + 1);
    else {
      setFinished(true);
      toast.success(t('system.survey_completed'));
    }
  };

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-10 animate-fade-in">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }} 
          animate={{ scale: 1, rotate: 0 }} 
          transition={{ type: "spring", damping: 12, stiffness: 100 }}
          className="w-32 h-32 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center text-white mb-10 shadow-2xl shadow-emerald-600/20"
        >
          <CheckCircle size={56} strokeWidth={2.5} />
        </motion.div>
        <h2 className="text-5xl font-black text-[var(--color-text-primary)] mb-6 tracking-tighter">{t('system.survey_thanks')}</h2>
        <p className="text-[var(--color-text-secondary)] max-w-lg mb-12 text-lg font-bold opacity-80 leading-relaxed">{t('system.survey_thanks_msg')}</p>
        <Button onClick={() => navigate("/")} variant="primary" className="h-16 px-12 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">
          {t('system.back_to_home')}
        </Button>
      </div>
    );
  }

  const q = questions[currentIdx];
  const progress = questions.length > 0 ? ((currentIdx + 1) / questions.length) * 100 : 0;

  if (!q) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in py-12 px-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6 shadow-inner">
           <HelpCircle size={32} />
        </div>
        <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight leading-tight">{resolvedTitle}</h1>
        <p className="text-[var(--color-text-secondary)] font-black uppercase tracking-[0.2em] text-xs opacity-40">{t('system.survey_note')}</p>
      </div>

      <div className="relative h-3 bg-[var(--color-bg-primary)] rounded-full overflow-hidden border border-[var(--color-border)] shadow-inner">
        <motion.div 
          className="absolute left-0 top-0 h-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="card-premium p-12 shadow-md relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] rotate-12">
             <HelpCircle size={240} />
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-8 mb-12 relative z-10">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-600/20">
              {currentIdx + 1}
            </div>
            <h3 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight leading-tight pt-2">{q.text}</h3>
          </div>

          <div className="grid grid-cols-1 gap-5 relative z-10">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                className={`
                  w-full p-8 rounded-3xl border-2 text-left font-black transition-all flex items-center justify-between group active:scale-[0.99]
                  ${answers[currentIdx] === opt 
                    ? 'border-indigo-600 bg-indigo-600/5 text-indigo-600 shadow-lg shadow-indigo-600/5' 
                    : 'border-[var(--color-border)] hover:border-indigo-600/30 text-[var(--color-text-secondary)] bg-[var(--color-bg-primary)]/40'}
                `}
              >
                <span className="text-lg tracking-tight">{opt}</span>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  answers[currentIdx] === opt 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'border-[var(--color-border)] group-hover:border-indigo-600/30'
                }`}>
                  {answers[currentIdx] === opt && <CheckCircle size={20} strokeWidth={3} />}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-16 pt-10 border-t border-[var(--color-border)] relative z-10">
            <button 
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(currentIdx - 1)}
              className="flex items-center gap-3 text-[var(--color-text-secondary)] font-black uppercase tracking-[0.2em] text-[10px] hover:text-indigo-600 disabled:opacity-0 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center group-hover:bg-indigo-600/10">
                <ChevronLeft size={20} />
              </div>
              {t('system.previous')}
            </button>
            <Button 
              disabled={!answers[currentIdx]}
              onClick={next}
              variant="primary"
              className="px-12 h-16 rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/20 active:scale-95"
              icon={currentIdx === questions.length - 1 ? <Send size={22} /> : <ChevronRight size={22} />}
            >
              {currentIdx === questions.length - 1 ? t('system.finish') : t('system.next')}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
