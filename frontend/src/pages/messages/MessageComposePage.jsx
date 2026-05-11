import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, X, User, Paperclip, Smile, ArrowLeft, Type, AlignLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import toast from "react-hot-toast";

export default function MessageComposePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ to: "", subject: "", body: "" });

  const handleSend = () => {
    if (!form.to || !form.subject || !form.body) {
      toast.error(t('common.fill_all_fields', 'Iltimos, barcha maydonlarni to\'ldiring'));
      return;
    }
    toast.success(t('messages.send_success'));
    setTimeout(() => navigate("/messages/list"), 1500);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20 px-6 pt-6 max-w-5xl mx-auto">
      <PageHeader 
        title={t('messages.new_message')} 
        subtitle="Ma'muriyat yoki o'qituvchiga murojaat yo'llash"
        actions={
          <Button 
            variant="secondary" 
            className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest border-2" 
            icon={<X size={20} />} 
            onClick={() => navigate(-1)}
          >
            {t('common.cancel')}
          </Button>
        }
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-10 md:p-12 shadow-md"
      >
        <div className="space-y-10">
          {/* Recipient */}
          <div className="relative group">
            <label className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] absolute left-6 -top-3 bg-[var(--color-bg-secondary)] px-3 py-1 rounded-lg border-2 border-indigo-600/10 z-10">
              {t('messages.to')}
            </label>
            <div className="flex items-center gap-5 w-full p-6 bg-[var(--color-bg-primary)] border-2 border-[var(--color-border)] rounded-2xl focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-600/5 transition-all shadow-inner group">
              <User size={24} className="text-indigo-600 opacity-40 group-focus-within:opacity-100" />
              <select 
                className="w-full bg-transparent outline-none text-[var(--color-text-primary)] font-black text-lg cursor-pointer appearance-none"
                value={form.to}
                onChange={(e) => setForm({...form, to: e.target.value})}
              >
                <option value="" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>{t('messages.select_recipient')}</option>
                <option value="dekanat" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>Dekanat</option>
                <option value="rectorat" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>Rektorat</option>
                <option value="teacher" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>A. Karimov (O'qituvchi)</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div className="relative group">
            <label className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] absolute left-6 -top-3 bg-[var(--color-bg-secondary)] px-3 py-1 rounded-lg border-2 border-indigo-600/10 z-10">
              {t('messages.subject')}
            </label>
            <div className="flex items-center gap-5 w-full p-6 bg-[var(--color-bg-primary)] border-2 border-[var(--color-border)] rounded-2xl focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-600/5 transition-all shadow-inner group">
               <Type size={24} className="text-indigo-600 opacity-40 group-focus-within:opacity-100" />
               <input 
                 type="text" 
                 placeholder={t('messages.subject_placeholder')}
                 className="w-full bg-transparent outline-none text-[var(--color-text-primary)] font-black text-lg placeholder:opacity-20"
                 value={form.subject}
                 onChange={(e) => setForm({...form, subject: e.target.value})}
               />
            </div>
          </div>

          {/* Body */}
          <div className="relative group">
            <label className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] absolute left-6 -top-3 bg-[var(--color-bg-secondary)] px-3 py-1 rounded-lg border-2 border-indigo-600/10 z-10">
              {t('messages.body')}
            </label>
            <div className="flex items-start gap-5 w-full p-6 bg-[var(--color-bg-primary)] border-2 border-[var(--color-border)] rounded-[2rem] focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-600/5 transition-all shadow-inner group">
              <AlignLeft size={24} className="text-indigo-600 opacity-40 group-focus-within:opacity-100 mt-1" />
              <textarea 
                rows={10}
                placeholder={t('messages.body_placeholder')}
                className="w-full bg-transparent outline-none text-[var(--color-text-primary)] font-bold text-lg placeholder:opacity-20 resize-none leading-relaxed"
                value={form.body}
                onChange={(e) => setForm({...form, body: e.target.value})}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t-2 border-[var(--color-border)]">
            <div className="flex gap-4">
              <button className="w-14 h-14 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-indigo-600 bg-[var(--color-bg-primary)] border-2 border-[var(--color-border)] rounded-2xl hover:border-indigo-600 transition-all shadow-sm">
                <Paperclip size={24} />
              </button>
              <button className="w-14 h-14 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-amber-500 bg-[var(--color-bg-primary)] border-2 border-[var(--color-border)] rounded-2xl hover:border-amber-500 transition-all shadow-sm">
                <Smile size={24} />
              </button>
            </div>
            <Button 
              variant="primary" 
              className="h-18 px-16 text-lg shadow-2xl shadow-indigo-600/30 font-black rounded-2xl w-full md:w-auto uppercase tracking-widest active:scale-95 transition-all"
              icon={<Send size={26} />}
              onClick={handleSend}
            >
              {t('messages.send_button')}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
