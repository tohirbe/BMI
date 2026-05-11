import React from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/ui/PageHeader";

const PAYMENTS = [
  { id: 1, type: "Stipendiya", amount: "612,450", date: "2024-04-05", status: "tushgan" },
  { id: 2, type: "Stipendiya", amount: "612,450", date: "2024-03-05", status: "tushgan" },
  { id: 3, type: "Moddiy yordam", amount: "1,200,000", date: "2024-02-15", status: "tushgan" },
];

export default function ScholarshipPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <PageHeader
        title={t('finance.scholarship', 'Stipendiya hisobi')}
        subtitle={t('finance.scholarship_subtitle', 'Oylik stipendiya va boshqa moddiy to\'lovlar tarixi')}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden"
      >
        <div className="absolute right-[-20px] top-[-20px] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest mb-2">{t('finance.current_payment', 'Joriy oylik to\'lov')}</p>
          <div className="text-4xl md:text-5xl font-black mb-8">612,450 <span className="text-xl">UZS</span></div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <span className="text-sm font-bold text-indigo-50">{t('finance.base_scholarship', 'Bazaviy stipendiya')}</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <span className="text-sm text-indigo-100">{t('finance.grade_indicator', 'Baho ko\'rsatkichi')}: A'lo</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-premium overflow-hidden shadow-sm"
      >
        <div className="p-6 border-b border-[var(--color-border)]">
          <h3 className="font-black text-[var(--color-text-primary)]">{t('finance.payment_history', 'To\'lovlar tarixi')}</h3>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {PAYMENTS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="p-6 flex items-center justify-between hover:bg-[var(--color-bg-primary)]/80 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                  <ArrowDownRight size={20} />
                </div>
                <div>
                  <h4 className="font-black text-[var(--color-text-primary)]">{p.type}</h4>
                  <p className="text-xs text-[var(--color-text-secondary)] opacity-40 font-bold">{p.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-[var(--color-text-primary)]">+{p.amount} <span className="text-[10px] text-[var(--color-text-secondary)] opacity-40 font-normal">UZS</span></p>
                <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">{t('finance.successful', 'Muvaffaqiyatli')}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
