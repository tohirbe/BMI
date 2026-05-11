import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Search, Filter, Plus, User, Clock, ChevronRight, ArrowLeft, Trash2, Send } from "lucide-react";
import Button from "../../components/ui/Button";

const MESSAGES = [
  { id: 1, sender: "Dekanat", subject: "Semestr yakuniy nazorati haqida", text: "Hurmatli talabalar, semestr yakuniy nazoratlari 20-maydan boshlanishini ma'lum qilamiz. Iltimos, barcha qarzlaringizni yopishingizni so'raymiz.", date: "14:20", unread: true },
  { id: 2, sender: "A. Karimov", subject: "Algoritmlar fanidan topshiriq", text: "Topshiriqlarni 15-maygacha topshirishingiz lozim. Kechikkan ishlar qabul qilinmaydi va ball kamaytiriladi.", date: "Kecha", unread: false },
  { id: 3, sender: "Tizim", subject: "Parol o'zgartirildi", text: "Sizning akkauntingiz paroli muvaffaqiyatli o'zgartirildi. Agar bu siz bo'lmasangiz, darhol qo'llab-quvvatlash xizmatiga murojaat qiling.", date: "10-may", unread: false },
];

export default function MessageListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedMsg, setSelectedMsg] = React.useState(null);

  if (selectedMsg) {
    return (
      <div className="space-y-8 animate-fade-in pb-12 px-6 pt-6">
        <button 
          onClick={() => setSelectedMsg(null)}
          className="flex items-center gap-3 text-[var(--color-text-secondary)] hover:text-indigo-600 transition-all font-black uppercase text-[10px] tracking-[0.2em] mb-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center group-hover:bg-indigo-600/10 shadow-sm">
             <ArrowLeft size={18} />
          </div>
          {t('messages.back')}
        </button>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-12 shadow-md relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] rotate-12">
             <Mail size={240} />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/20">
                <User size={40} />
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight">{selectedMsg.sender}</h2>
                <div className="flex items-center gap-3 text-[var(--color-text-secondary)] font-black uppercase text-[10px] tracking-widest opacity-40">
                   <Clock size={14} />
                   {selectedMsg.date}
                </div>
              </div>
            </div>
            <div className="flex gap-4">
               <Button variant="secondary" className="h-14 px-8 rounded-2xl font-black text-rose-500 border-rose-500/10 hover:bg-rose-500/10" icon={<Trash2 size={20} />}>
                  {t('common.delete')}
               </Button>
               <Button variant="primary" className="h-14 px-10 rounded-2xl font-black shadow-xl shadow-indigo-600/20" icon={<Send size={20} />}>
                  {t('messages.reply')}
               </Button>
            </div>
          </div>
          
          <div className="relative z-10 space-y-8">
             <h1 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight bg-[var(--color-bg-primary)]/40 p-6 rounded-2xl border border-[var(--color-border)]">{selectedMsg.subject}</h1>
             <div className="p-10 rounded-[2rem] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] leading-relaxed text-lg border border-[var(--color-border)] shadow-inner">
                {selectedMsg.text}
             </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-12 px-6 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-[var(--color-text-primary)] tracking-tighter leading-none mb-3">{t('messages.title')}</h1>
          <p className="text-[var(--color-text-secondary)] font-black uppercase tracking-[0.2em] text-xs opacity-40">{t('messages.subtitle')}</p>
        </div>
        <Button 
          variant="primary" 
          icon={<Plus size={22} />}
          onClick={() => navigate("/messages/create")}
          className="h-16 px-10 rounded-2xl shadow-2xl shadow-indigo-600/30 font-black uppercase tracking-widest text-xs"
        >
          {t('messages.new_message')}
        </Button>
      </div>

      <div className="card-premium overflow-hidden shadow-md">
        <div className="p-8 border-b border-[var(--color-border)] flex flex-wrap items-center gap-6 bg-[var(--color-bg-primary)]/30">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-600 opacity-40" size={20} />
            <input 
              type="text" 
              placeholder={t('messages.search_placeholder')}
              className="w-full h-14 bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border)] rounded-2xl pl-14 pr-6 font-bold text-[var(--color-text-primary)] placeholder:opacity-40 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
            />
          </div>
          <button className="w-14 h-14 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-indigo-600 bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border)] rounded-2xl hover:border-indigo-600 transition-all shadow-sm">
            <Filter size={22} />
          </button>
        </div>

        <div className="divide-y divide-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <AnimatePresence mode="popLayout">
            {MESSAGES.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`
                  p-10 flex items-center justify-between hover:bg-[var(--color-bg-primary)]/40 transition-all cursor-pointer group relative
                  ${msg.unread ? 'border-l-4 border-indigo-600 bg-indigo-600/[0.02]' : 'border-l-4 border-transparent'}
                `}
                onClick={() => setSelectedMsg(msg)}
              >
                <div className="flex items-center gap-8 overflow-hidden">
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 ${
                    msg.unread ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/40 scale-110' : 'bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] shadow-inner opacity-40'
                  }`}>
                    <User size={32} />
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-4 mb-2">
                      <h4 className={`text-xl font-black tracking-tight ${msg.unread ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                        {msg.sender}
                      </h4>
                      {msg.unread && (
                        <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20">
                           NEW
                        </span>
                      )}
                    </div>
                    <h5 className="text-base font-bold text-[var(--color-text-primary)] truncate mb-1">{msg.subject}</h5>
                    <p className="text-sm text-[var(--color-text-secondary)] font-medium truncate opacity-40 group-hover:opacity-60 transition-opacity">{msg.text}</p>
                  </div>
                </div>

                <div className="flex items-center gap-10 shrink-0">
                  <span className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] opacity-30 group-hover:opacity-60 transition-opacity">{msg.date}</span>
                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] flex items-center justify-center group-hover:text-indigo-600 group-hover:border-indigo-600 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 shadow-inner">
                     <ChevronRight size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
