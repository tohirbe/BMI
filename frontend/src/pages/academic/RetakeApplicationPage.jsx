import React from "react";
import { motion } from "framer-motion";
import { FileText, Plus, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import toast from "react-hot-toast";

const APPLICATIONS = [
  { id: 1, subject: "Algoritmlar", semester: 3, date: "2024-04-10", status: "approved", fee: "450,000" },
  { id: 2, subject: "Ma'lumotlar bazasi", semester: 3, date: "2024-05-02", status: "pending", fee: "450,000" },
];

export default function RetakeApplicationPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <PageHeader
        title={t('academic.retake_title', 'Qayta o\'qish arizalari')}
        subtitle={t('academic.retake_subtitle', 'Fanlarni qayta o\'zlashtirish uchun arizalar ro\'yxati')}
        actions={
          <Button 
            variant="primary" 
            icon={<Plus size={18} />}
            onClick={() => toast.success(t('academic.new_application_loading', 'Yangi ariza shakli yuklanmoqda...'))}
            className="h-12 px-6 rounded-2xl font-black text-xs uppercase tracking-widest"
          >
            {t('academic.new_application', 'Yangi ariza')}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6">
        {APPLICATIONS.map((app, i) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-premium p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
          >
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                app.status === 'approved' ? 'bg-emerald-600/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
              }`}>
                {app.status === 'approved' ? <CheckCircle size={28} /> : <Clock size={28} />}
              </div>
              <div>
                <h3 className="text-lg font-black text-[var(--color-text-primary)] tracking-tight">{app.subject}</h3>
                <p className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest font-black opacity-40">
                  {app.semester}-{t('academic.semester', 'semestr')} • {app.date}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] text-[var(--color-text-secondary)] uppercase font-black tracking-widest opacity-40 mb-1">{t('academic.payment_amount', 'To\'lov summasi')}</p>
                <p className="text-xl font-black text-[var(--color-text-primary)]">{app.fee} <span className="text-[10px]">UZS</span></p>
              </div>
              <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                app.status === 'approved' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
              }`}>
                {app.status === 'approved' ? t('academic.approved', 'Tasdiqlangan') : t('academic.pending', 'Kutilmoqda')}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card-premium p-8 flex items-start gap-4 border-indigo-600/10 shadow-sm">
        <AlertCircle className="text-indigo-600 shrink-0" size={24} />
        <div>
          <p className="font-black text-[var(--color-text-primary)] mb-1">{t('academic.retake_note_title', 'Muhim eslatma')}</p>
          <p className="text-sm text-[var(--color-text-secondary)] font-bold opacity-60">
            {t('academic.retake_note', 'Qayta o\'qish uchun ariza topshirish muddati semestr boshlanishidan kamida 2 hafta oldin yakunlanadi.')}
          </p>
        </div>
      </div>
    </div>
  );
}
