import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { notifications } from "../../api";
import { useNotifications } from "../../hooks/useNotifications";
import { usePermissions } from "../../hooks/usePermissions";
import { formatDate } from "../../utils/helpers";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { Bell, Send, CheckCircle2, Circle, ChevronDown, ChevronUp, User, Clock, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LEVEL_LABELS = {
  university: "University",
  faculty: "Faculty",
  department: "Department",
  group: "Group",
  personal: "Personal",
};

const LEVEL_COLORS = {
  university: "#6366f1",
  faculty: "#8b5cf6",
  department: "#f59e0b",
  group: "#22c55e",
  personal: "#64748b",
};

export default function NotifPage() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { markRead, refresh } = useNotifications();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRead, setIsRead] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page };
    if (isRead !== "") params.is_read = isRead;
    notifications.list(params)
      .then((r) => {
        setList(r.data.results ?? []);
        setTotalPages(Math.ceil((r.data.count ?? 0) / 20));
      })
      .catch(() => toast.error("Xabarnomalar yuklanmadi"))
      .finally(() => setLoading(false));
  }, [page, isRead]);

  useEffect(() => { load(); }, [load]);

  const handleExpand = async (notif) => {
    if (expanded?.id === notif.id) { setExpanded(null); return; }
    setExpanded(notif);
    if (!notif.is_read) {
      await markRead(notif.id);
      setList((prev) => prev.map((n) => n.id === notif.id ? { ...n, is_read: true } : n));
      refresh();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <PageHeader
        title="Notifications"
        subtitle="Stay updated with university announcements and personal messages"
        actions={
          can("notifications", "can_add") && (
            <Button icon={<Send size={18} />} onClick={() => navigate("/notifications/compose")}>
              Compose Message
            </Button>
          )
        }
      />

      {/* Filter Tabs */}
      <div className="flex bg-slate-100/50 p-1 rounded-2xl w-fit">
        {[
          { val: "", label: "All Messages" },
          { val: "false", label: "Unread" },
          { val: "true", label: "Read" },
        ].map((f) => (
          <button
            key={f.val}
            onClick={() => { setIsRead(f.val); setPage(1); }}
            className={`
              px-6 py-2.5 rounded-xl text-sm font-black transition-all
              ${isRead === f.val 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'}
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {list.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 p-20 text-center space-y-4"
              >
                 <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                    <Bell size={32} />
                 </div>
                 <p className="text-slate-400 font-bold tracking-tight">No notifications to display</p>
              </motion.div>
            ) : list.map((n, idx) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleExpand(n)}
                className={`
                  group cursor-pointer rounded-[2rem] border transition-all duration-300 overflow-hidden
                  ${n.is_read 
                    ? 'bg-white border-slate-100 hover:border-indigo-100 shadow-sm' 
                    : 'bg-indigo-50/30 border-indigo-100 hover:border-indigo-200 shadow-md'}
                `}
              >
                <div className="p-6 md:p-8 flex items-center justify-between gap-6">
                   <div className="flex items-center gap-6 flex-1 min-w-0">
                      <div className="relative">
                         <div 
                           className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                           style={{ backgroundColor: LEVEL_COLORS[n.level] ?? "#64748b" }}
                         >
                            <Info size={24} />
                         </div>
                         {!n.is_read && (
                           <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 border-2 border-white rounded-full animate-pulse" />
                         )}
                      </div>
                      
                      <div className="space-y-1 flex-1 min-w-0">
                         <div className="flex items-center gap-3">
                            <span 
                              className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
                              style={{ color: LEVEL_COLORS[n.level], backgroundColor: `${LEVEL_COLORS[n.level]}15` }}
                            >
                               {LEVEL_LABELS[n.level]}
                            </span>
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                               <Clock size={12} />
                               {formatDate(n.created_at)}
                            </span>
                         </div>
                         <h3 className={`text-lg font-black tracking-tight truncate ${n.is_read ? 'text-slate-700' : 'text-slate-900'}`}>
                            {n.title}
                         </h3>
                      </div>
                   </div>

                   <div className="flex items-center gap-8">
                      <div className="hidden md:flex flex-col items-end">
                         <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Sender</span>
                         <span className="text-sm font-bold text-slate-600 flex items-center gap-1.5">
                            <User size={14} className="text-indigo-400" />
                            {n.sender_name}
                         </span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                         {expanded?.id === n.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                   </div>
                </div>

                <AnimatePresence>
                  {expanded?.id === n.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100 bg-slate-50/50"
                    >
                       <div className="p-8 text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                          {n.body}
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {totalPages > 1 && (
            <div className="pt-10 flex items-center justify-center gap-4">
              <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Page {page} of {totalPages}</span>
              <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}