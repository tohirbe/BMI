import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { notifications } from "../../api";
import { useNotifications } from "../../hooks/useNotifications";
import { usePermissions } from "../../hooks/usePermissions";
import { formatDate } from "../../utils/helpers";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { Bell, Send, ChevronDown, ChevronUp, User, Clock, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LEVEL_COLORS = {
  university: "#6366f1",
  faculty: "#8b5cf6",
  department: "#f59e0b",
  group: "#22c55e",
  personal: "#64748b",
};

export default function NotifPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { markRead, refresh } = useNotifications();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRead, setIsRead] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expanded, setExpanded] = useState(null);

  const filters = useMemo(() => [
    { val: "", label: t('notifications.all_messages') },
    { val: "false", label: t('notifications.unread') },
    { val: "true", label: t('notifications.read') },
  ], [t]);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page };
    if (isRead !== "") params.is_read = isRead;
    notifications.list(params)
      .then((r) => {
        setList(r.data.results ?? []);
        setTotalPages(Math.ceil((r.data.count ?? 0) / 20));
      })
      .catch(() => toast.error(t('common.error')))
      .finally(() => setLoading(false));
  }, [page, isRead, t]);

  useEffect(() => { load(); }, [load]);

  const handleExpand = async (notif) => {
    if (expanded?.id === notif.id) { setExpanded(null); return; }
    setExpanded(notif);
    if (!notif.is_read) {
      try {
        await markRead(notif.id);
        setList((prev) => prev.map((n) => n.id === notif.id ? { ...n, is_read: true } : n));
        refresh();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <PageHeader
        title={t('notifications.title')}
        subtitle={t('notifications.subtitle')}
        actions={
          can("notifications", "can_add") && (
            <Button 
              className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20"
              icon={<Send size={20} />} 
              onClick={() => navigate("/notifications/compose")}
            >
              {t('notifications.new_notif')}
            </Button>
          )
        }
      />

      {/* Filter Tabs */}
      <div className="flex bg-[var(--color-bg-primary)]/50 p-1.5 rounded-[1.5rem] w-fit border border-[var(--color-border)] shadow-sm">
        {filters.map((f) => (
          <button
            key={f.val}
            onClick={() => { setIsRead(f.val); setPage(1); }}
            className={`
              px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
              ${isRead === f.val 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                : 'text-[var(--color-text-secondary)] hover:text-indigo-600 opacity-60 hover:opacity-100'}
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {list.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-premium p-32 text-center space-y-8 flex flex-col items-center"
              >
                 <div className="w-24 h-24 bg-[var(--color-bg-primary)] rounded-[2.5rem] flex items-center justify-center text-[var(--color-text-secondary)] opacity-10 shadow-inner">
                    <Bell size={56} />
                 </div>
                 <p className="text-[var(--color-text-primary)] font-black text-xl uppercase tracking-[0.2em] opacity-40">{t('notifications.no_notifications')}</p>
              </motion.div>
            ) : list.map((n, idx) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleExpand(n)}
                className={`
                  group cursor-pointer rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden
                  ${n.is_read 
                    ? 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] hover:border-indigo-600/20 shadow-sm' 
                    : 'bg-indigo-600/[0.03] border-indigo-600/20 hover:border-indigo-600/40 shadow-xl shadow-indigo-600/5'}
                `}
              >
                <div className="p-8 md:p-10 flex items-center justify-between gap-8">
                   <div className="flex items-center gap-8 flex-1 min-w-0">
                      <div className="relative">
                         <div 
                           className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-110 duration-500"
                           style={{ backgroundColor: LEVEL_COLORS[n.level] ?? "#64748b" }}
                         >
                            <Info size={32} />
                         </div>
                         {!n.is_read && (
                           <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 border-4 border-[var(--color-bg-secondary)] rounded-full animate-pulse shadow-lg" />
                         )}
                      </div>
                      
                      <div className="space-y-2 flex-1 min-w-0">
                         <div className="flex items-center gap-4">
                            <span 
                              className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg border shadow-sm"
                              style={{ color: LEVEL_COLORS[n.level], backgroundColor: `${LEVEL_COLORS[n.level]}10`, borderColor: `${LEVEL_COLORS[n.level]}20` }}
                            >
                               {t(`notifications.levels.${n.level}`)}
                            </span>
                            <span className="text-[10px] font-black text-[var(--color-text-secondary)] opacity-40 flex items-center gap-2 uppercase tracking-widest">
                               <Clock size={14} className="text-indigo-600" />
                               {formatDate(n.created_at)}
                            </span>
                         </div>
                         <h3 className={`text-2xl font-black tracking-tight truncate ${n.is_read ? 'text-[var(--color-text-primary)] opacity-70' : 'text-[var(--color-text-primary)]'}`}>
                            {n.title}
                         </h3>
                      </div>
                   </div>

                   <div className="flex items-center gap-12">
                      <div className="hidden lg:flex flex-col items-end">
                         <span className="text-[9px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] opacity-40 mb-1">{t('notifications.sender')}</span>
                         <span className="text-base font-black text-[var(--color-text-primary)] flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-primary)] flex items-center justify-center text-indigo-600 border border-[var(--color-border)] shadow-inner">
                               <User size={16} />
                            </div>
                            {n.sender_name}
                         </span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-500 shadow-inner">
                         {expanded?.id === n.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                      </div>
                   </div>
                </div>

                <AnimatePresence>
                  {expanded?.id === n.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t-2 border-[var(--color-border)] bg-[var(--color-bg-primary)]/40"
                    >
                       <div className="p-10 text-[var(--color-text-primary)] leading-relaxed text-lg font-bold opacity-80 whitespace-pre-wrap">
                          {n.body}
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {totalPages > 1 && (
            <div className="pt-16 flex items-center justify-center gap-8">
              <Button 
                variant="secondary" 
                className="h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest border-2"
                disabled={page === 1} 
                onClick={() => { setPage(p => p - 1); window.scrollTo(0, 0); }}
                icon={<ChevronLeft size={18} />}
              >
                {t('common.previous')}
              </Button>
              <span className="text-[11px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.3em] opacity-40">
                {t('common.page', 'Sahifa')} <span className="text-[var(--color-text-primary)] opacity-100">{page}</span> / <span className="text-[var(--color-text-primary)] opacity-100">{totalPages}</span>
              </span>
              <Button 
                variant="secondary" 
                className="h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest border-2"
                disabled={page === totalPages} 
                onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}
                icon={<ChevronRight size={18} />}
                iconPosition="right"
              >
                {t('common.next')}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}