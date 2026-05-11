import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { rbac } from "../../api";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { Shield, Key, ChevronRight, CheckCircle2, Lock, ArrowRight, ShieldCheck, Activity, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RolesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    rbac.roles()
      .then((r) => setList(r.data.data ?? []))
      .catch(() => toast.error(t('common.error')))
      .finally(() => setLoading(false));
  }, [t]);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <PageHeader 
        title={t('nav.roles')} 
        subtitle={t('admin.users_subtitle')}
        icon={<Shield size={28} className="text-indigo-600" />}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium overflow-hidden shadow-md"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[var(--color-bg-primary)]/50">
                <th className="px-10 py-6 text-[11px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] border-b border-[var(--color-border)]">{t('admin.system_role')}</th>
                <th className="px-10 py-6 text-[11px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] border-b border-[var(--color-border)]">Slug</th>
                <th className="px-10 py-6 text-[11px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] border-b border-[var(--color-border)]">{t('common.permissions_label')}</th>
                <th className="px-10 py-6 text-[11px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] border-b border-[var(--color-border)] text-center">{t('admin.status')}</th>
                <th className="px-10 py-6 text-[11px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] border-b border-[var(--color-border)] text-right">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              <AnimatePresence mode="popLayout">
                {list.map((role, idx) => (
                  <motion.tr 
                    key={role.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-[var(--color-bg-primary)]/80 transition-all duration-300"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                           <p className="font-black text-[var(--color-text-primary)] tracking-tight text-lg leading-tight">{role.name}</p>
                           <p className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mt-1 opacity-40">{t('admin.system_role')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                       <code className="text-[11px] font-black text-[var(--color-text-secondary)] bg-[var(--color-bg-primary)] px-3 py-1.5 rounded-lg border border-[var(--color-border)]">
                          role.{role.slug}
                       </code>
                    </td>
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[var(--color-bg-primary)] flex items-center justify-center text-indigo-600 border border-[var(--color-border)]">
                             <Activity size={18} />
                          </div>
                          <div>
                             <span className="text-sm font-black text-[var(--color-text-primary)] tracking-tight">
                                {role.permissions?.filter((p) => p.can_view).length ?? 0}
                             </span>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                       <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${role.is_active ? 'bg-emerald-600/10 text-emerald-600' : 'bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]'}`}>
                          <div className={`w-2 h-2 rounded-full ${role.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-[var(--color-text-secondary)] opacity-30'}`} />
                          {role.is_active ? t('admin.active') : t('admin.blocked')}
                       </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <Button 
                          variant="secondary" 
                          size="sm"
                          className="rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 group/btn transition-all px-6"
                          onClick={() => navigate(`/admin/permissions?role=${role.id}`)}
                          icon={<Settings2 size={16} className="group-hover/btn:rotate-90 transition-transform duration-500" />}
                       >
                          {t('common.settings')}
                       </Button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}