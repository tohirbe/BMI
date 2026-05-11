import { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { users } from "../../api";
import { formatDate } from "../../utils/helpers";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { UserPlus, Search, Shield, ShieldCheck, Mail, Phone, Lock, Edit3, ShieldAlert, UserX, UserCheck, X, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ROLE_COLORS = {
  superuser: "#6366f1",
  rector: "#2563eb",
  dean: "#0891b2",
  head: "#059669",
  vice_head: "#65a30d",
  teacher: "#d97706",
  student: "#64748b",
};

export default function UsersPage() {
  const { t } = useTranslation();

  const ROLES = useMemo(() => [
    { value: "rector", label: t('roles.rector') },
    { value: "dean", label: t('roles.dean') },
    { value: "head", label: t('roles.head') },
    { value: "teacher", label: t('roles.teacher') },
    { value: "student", label: t('roles.student') },
  ], [t]);

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modal, setModal] = useState(null); 
  const [form, setForm] = useState({ first_name: "", last_name: "", middle_name: "", email: "", role: "student", phone: "", password: "", password2: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page };
    if (search) params.search = search;
    if (roleFilter) params.role = roleFilter;
    users.list(params)
      .then((r) => {
        setList(r.data.results ?? []);
        setTotalPages(Math.ceil((r.data.count ?? 0) / 20));
      })
      .catch(() => toast.error(t('common.error')))
      .finally(() => setLoading(false));
  }, [page, search, roleFilter, t]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ first_name: "", last_name: "", middle_name: "", email: "", role: "student", phone: "", password: "", password2: "" });
    setModal("create");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (modal === "create" && form.password !== form.password2) {
      toast.error(t('admin.passwords_mismatch')); return;
    }
    setSaving(true);
    try {
      if (modal === "create") {
        await users.create(form);
        toast.success(t('admin.user_created'));
      } else {
        await users.update(modal.id, { first_name: form.first_name, last_name: form.last_name, middle_name: form.middle_name, phone: form.phone });
        toast.success(t('admin.updated'));
      }
      setModal(null);
      load();
    } catch (err) {
      const d = err.response?.data?.details;
      toast.error(d ? Object.values(d).flat()[0] : err.response?.data?.error ?? t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (u) => {
    try {
      await users.update(u.id, { is_active: !u.is_active });
      toast.success(u.is_active ? t('admin.blocked_msg') : t('admin.activated_msg'));
      load();
    } catch { toast.error(t('common.error')); }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title={t('admin.users_title')}
        subtitle={t('admin.users_subtitle')}
        actions={
          <Button icon={<UserPlus size={18} />} onClick={openCreate}>
            {t('admin.add_user')}
          </Button>
        }
      />

      {/* Filter Section */}
      <div className="card-premium p-6 flex flex-wrap items-end gap-6 shadow-sm">
        <div className="flex-[2] min-w-[300px]">
          <Input
            placeholder={t('admin.search_users')}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            icon={<Search size={18} />}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <Select
            placeholder={t('admin.all_roles')}
            options={ROLES}
            value={roleFilter}
            onChange={(val) => { setRoleFilter(val); setPage(1); }}
            icon={<Shield size={18} />}
          />
        </div>
      </div>

      {loading ? <Spinner /> : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--color-bg-primary)]/50 border-b border-[var(--color-border)]">
                  <th className="px-8 py-5 text-[11px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest">{t('admin.user_profile')}</th>
                  <th className="px-8 py-5 text-[11px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest">{t('admin.email_address')}</th>
                  <th className="px-8 py-5 text-[11px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest">{t('admin.system_role')}</th>
                  <th className="px-8 py-5 text-[11px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest text-center">{t('admin.status')}</th>
                  <th className="px-8 py-5 text-[11px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest">{t('admin.joined_date')}</th>
                  <th className="px-8 py-5 text-[11px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest text-right">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                <AnimatePresence mode="popLayout">
                  {list.length === 0 ? (
                    <tr className="h-64"><td colSpan={6} className="text-center font-black text-[var(--color-text-secondary)]">{t('admin.no_users')}</td></tr>
                  ) : list.map((u, idx) => (
                    <motion.tr 
                      key={u.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-[var(--color-bg-primary)]/80 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-xs"
                            style={{ backgroundColor: ROLE_COLORS[u.role] ?? "#64748b" }}
                          >
                            {u.first_name.charAt(0)}{u.last_name.charAt(0)}
                          </div>
                          <span className="font-black text-[var(--color-text-primary)] tracking-tight">{u.full_name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                          <Mail size={14} className="opacity-40" />
                          <span className="text-sm font-bold">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span 
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-current/10"
                          style={{ color: ROLE_COLORS[u.role], backgroundColor: `${ROLE_COLORS[u.role]}15` }}
                        >
                          <ShieldCheck size={12} />
                          {t(`roles.${u.role}`, u.role)}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black ${u.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {u.is_active ? t('admin.active') : t('admin.blocked')}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-xs text-[var(--color-text-secondary)] font-black opacity-60">{formatDate(u.created_at)}</td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => { setForm({ ...u, password: "", password2: "" }); setModal(u); }}
                            className="action-btn text-indigo-600 dark:text-indigo-400"
                            title={t('common.edit')}
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => handleToggleActive(u)}
                            className={`action-btn ${u.is_active ? 'text-amber-500' : 'text-emerald-500'}`}
                            title={u.is_active ? t('admin.block_user') : t('admin.activate_user')}
                          >
                            {u.is_active ? <UserX size={18} /> : <UserCheck size={18} />}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="px-8 py-6 bg-[var(--color-bg-primary)]/50 border-t border-[var(--color-border)] flex items-center justify-between">
              <p className="text-sm font-black text-[var(--color-text-secondary)]">
                {t('common.page')} <span className="text-[var(--color-text-primary)] font-black">{page}</span> {t('common.of')} <span className="text-[var(--color-text-primary)] font-black">{totalPages}</span>
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>{t('common.previous')}</Button>
                <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>{t('common.next')}</Button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModal(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-[var(--color-bg-secondary)] rounded-[2.5rem] border border-[var(--color-border)] shadow-2xl w-full max-w-xl overflow-hidden"
            >
              <div className="p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-[var(--color-text-primary)]">
                    {modal === "create" ? t('admin.new_account') : t('admin.update_profile')}
                  </h3>
                  <button onClick={() => setModal(null)} className="p-2 hover:bg-[var(--color-bg-primary)] rounded-xl text-[var(--color-text-secondary)] transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label={`${t('admin.first_name')} *`} value={form.first_name} onChange={(e) => setForm({...form, first_name: e.target.value})} required />
                    <Input label={`${t('admin.last_name')} *`} value={form.last_name} onChange={(e) => setForm({...form, last_name: e.target.value})} required />
                  </div>
                  <Input label={t('admin.middle_name')} value={form.middle_name??""} onChange={(e) => setForm({...form, middle_name: e.target.value})} />
                  
                  {modal === "create" && (
                    <>
                      <Input label={`${t('admin.email_address')} *`} type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} icon={<Mail size={16}/>} required />
                      <Select label={`${t('admin.system_role')} *`} options={ROLES} value={form.role} onChange={(val) => setForm({...form, role: val})} icon={<Shield size={16}/>} />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label={`${t('admin.password')} *`} type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} icon={<Lock size={16}/>} required />
                        <Input label={`${t('admin.confirm_password')} *`} type="password" value={form.password2} onChange={(e) => setForm({...form, password2: e.target.value})} required />
                      </div>
                    </>
                  )}
                  
                  <Input label={t('admin.phone_number')} value={form.phone??""} onChange={(e) => setForm({...form, phone: e.target.value})} icon={<Phone size={16}/>} placeholder="+998..." />
                  
                  <div className="pt-6 flex justify-end gap-3 border-t border-[var(--color-border)]">
                    <Button variant="ghost" type="button" className="font-black h-12" onClick={() => setModal(null)}>{t('common.cancel')}</Button>
                    <Button type="submit" loading={saving} className="h-12 px-8 font-black" icon={<Save size={18}/>}>
                      {modal === "create" ? t('admin.create_account') : t('admin.update_user')}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}