import React from "react";
import { motion } from "framer-motion";
import { Hammer, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button";

export default function ComingSoonPage({ title }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-24 h-24 bg-indigo-600/10 rounded-3xl flex items-center justify-center text-indigo-600 mb-8"
      >
        <Hammer size={48} />
      </motion.div>
      
      <h1 className="text-3xl font-black text-[var(--color-text-primary)] mb-4 tracking-tight">
        {title || t('common.coming_soon')}
      </h1>
      
      <p className="text-[var(--color-text-secondary)] max-w-md mb-8 font-bold opacity-60">
        {t('common.coming_soon_desc')}
      </p>

      <div className="flex gap-4">
        <Button 
          variant="secondary" 
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate(-1)}
          className="rounded-2xl h-12 px-8 font-black text-xs uppercase tracking-widest border-2"
        >
          {t('common.go_back')}
        </Button>
        <Button 
          variant="primary"
          onClick={() => navigate("/dashboard")}
          className="rounded-2xl h-12 px-8 font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20"
        >
          {t('common.go_home')}
        </Button>
      </div>

      <div className="mt-12 flex items-center gap-4 text-[var(--color-text-secondary)] opacity-30">
        <div className="h-px w-12 bg-[var(--color-border)]"></div>
        <span className="text-xs uppercase tracking-widest font-black italic">{t('common.under_construction')}</span>
        <div className="h-px w-12 bg-[var(--color-border)]"></div>
      </div>
    </div>
  );
}
