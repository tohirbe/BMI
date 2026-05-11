import React from "react";
import { motion } from "framer-motion";
import { FileText, Download, CheckCircle, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../components/ui/Button";

const CONTRACTS = [
  { id: 1, number: "2024/001", year: "2023-2024", amount: "12,000,000", paid: "12,000,000", status: "paid" },
  { id: 2, number: "2024/045", year: "2024-2025", amount: "14,500,000", paid: "5,000,000", status: "partial" },
];

export default function FinanceContractsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10 animate-fade-in pb-12 px-6 pt-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight">{t('finance.contracts_title')}</h1>
          <p className="text-[var(--color-text-secondary)] font-bold opacity-60 mt-1">{t('finance.contracts_subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CONTRACTS.map((contract, i) => (
          <motion.div
            key={contract.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="card-premium p-8 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 p-4 ${contract.status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
              {contract.status === 'paid' ? <CheckCircle size={32} opacity={0.2} /> : <Clock size={32} opacity={0.2} />}
            </div>
            
            <div className="mb-6">
              <p className="text-[10px] text-[var(--color-text-secondary)] uppercase font-black tracking-widest mb-1 opacity-40">{t('finance.contract_no')}</p>
              <h3 className="text-xl font-black text-[var(--color-text-primary)] tracking-tight">{contract.number}</h3>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)] font-bold text-sm">{t('finance.academic_year')}:</span>
                <span className="font-black text-[var(--color-text-primary)]">{contract.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)] font-bold text-sm">{t('finance.contract_amount')}:</span>
                <span className="font-black text-[var(--color-text-primary)]">{contract.amount} UZS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)] font-bold text-sm">{t('finance.paid_amount')}:</span>
                <span className="font-black text-emerald-600">{contract.paid} UZS</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="secondary" className="flex-1 h-12 rounded-2xl font-black text-xs uppercase tracking-widest border-2" icon={<Download size={18} />}>
                {t('finance.download_pdf')}
              </Button>
              <Button variant="primary" className="px-6 h-12 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20">
                {t('finance.pay')}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
