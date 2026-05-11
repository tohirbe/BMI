import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShieldOff, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";

export default function Page403() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-24 h-24 bg-rose-600/10 rounded-3xl flex items-center justify-center text-rose-600 mb-8"
      >
        <ShieldOff size={48} />
      </motion.div>

      <h1 className="text-7xl font-black text-rose-600 mb-4 tracking-tighter">403</h1>
      <p className="text-[var(--color-text-secondary)] max-w-md mb-8 font-bold opacity-60">
        {t('common.forbidden')}
      </p>
      <Button
        variant="secondary"
        icon={<ArrowLeft size={18} />}
        onClick={() => navigate(-1)}
        className="rounded-2xl h-12 px-8 font-black text-xs uppercase tracking-widest border-2"
      >
        {t('common.go_back_short')}
      </Button>
    </div>
  );
}