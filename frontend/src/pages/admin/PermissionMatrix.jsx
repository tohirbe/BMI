import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { rbac } from "../../api";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import { Shield, Plus, Edit3, Trash2, Globe, Settings2, Info, Eye, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ACTIONS = [
  { key: "can_view", label: "View", icon: <Eye size={14} />, color: "#3b82f6" },
  { key: "can_add", label: "Create", icon: <Plus size={14} />, color: "#10b981" },
  { key: "can_edit", label: "Edit", icon: <Edit3 size={14} />, color: "#f59e0b" },
  { key: "can_delete", label: "Delete", icon: <Trash2 size={14} />, color: "#f43f5e" },
];

export default function PermissionMatrix() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initRoleId = searchParams.get("role") ?? "";

  const [roles, setRoles] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [perms, setPerms] = useState({}); 
  const [selRole, setSelRole] = useState(initRoleId);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    Promise.all([rbac.roles(), rbac.menuItems()])
      .then(([rRes, mRes]) => {
        const fetchedRoles = rRes.data.data ?? [];
        setRoles(fetchedRoles);
        setMenuItems(mRes.data.data ?? []);
        
        if (!selRole && fetchedRoles.length > 0) {
          setSelRole(String(fetchedRoles[0].id));
        }
      })
      .catch(() => toast.error(t('common.error')))
      .finally(() => setLoading(false));
  }, [selRole, t]);

  const loadPerms = useCallback((roleId) => {
    if (!roleId) return;
    rbac.rolePerms(roleId)
      .then((r) => {
        const map = {};
        (r.data.data ?? []).forEach((p) => {
          map[p.menu_item_key] = {
            menu_item: p.menu_item,
            can_view: p.can_view,
            can_add: p.can_add,
            can_edit: p.can_edit,
            can_delete: p.can_delete,
          };
        });
        setPerms((prev) => ({ ...prev, [roleId]: map }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selRole) loadPerms(selRole);
  }, [selRole, loadPerms]);

  const togglePerm = async (menuItem, actionKey) => {
    const saveKey = `${selRole}-${menuItem.key}-${actionKey}`;
    const current = perms[selRole]?.[menuItem.key] ?? {};
    const newVal = !current[actionKey];

    setPerms((prev) => ({
      ...prev,
      [selRole]: {
        ...prev[selRole],
        [menuItem.key]: { ...current, [actionKey]: newVal, menu_item: menuItem.id },
      },
    }));

    setSaving((s) => ({ ...s, [saveKey]: true }));
    try {
      await rbac.saveRolePerm(selRole, {
        menu_item: menuItem.id,
        can_view: actionKey === "can_view" ? newVal : (current.can_view ?? false),
        can_add: actionKey === "can_add" ? newVal : (current.can_add ?? false),
        can_edit: actionKey === "can_edit" ? newVal : (current.can_edit ?? false),
        can_delete: actionKey === "can_delete" ? newVal : (current.can_delete ?? false),
      });
    } catch {
      toast.error(t('common.error'));
      setPerms((prev) => ({
        ...prev,
        [selRole]: { ...prev[selRole], [menuItem.key]: current },
      }));
    } finally {
      setSaving((s) => { const n = { ...s }; delete n[saveKey]; return n; });
    }
  };

  if (loading) return <Spinner />;

  const currentPerms = perms[selRole] ?? {};
  const selectedRole = roles.find((r) => String(r.id) === String(selRole));

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <PageHeader 
        title={t('nav.permissions')} 
        subtitle="Ruxsatnomalar matritsasi orqali tizim huquqlarini boshqarish"
      />

      {/* Role Selector Tabs */}
      <div className="flex bg-[var(--color-bg-primary)] p-1.5 rounded-2xl w-fit border border-[var(--color-border)] overflow-x-auto scrollbar-hide">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelRole(String(role.id))}
            className={`
              px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap
              ${String(selRole) === String(role.id) 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}
            `}
          >
            {role.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selRole && selectedRole ? (
          <motion.div 
            key={selRole}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="bg-indigo-600 p-10 rounded-[2.5rem] text-white shadow-xl shadow-indigo-600/10 flex flex-col md:flex-row md:items-center justify-between gap-10">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                     <Shield size={32} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black tracking-tight">{selectedRole.name} Huquqlari</h3>
                     <p className="text-indigo-100 font-bold text-sm mt-1 opacity-80 flex items-center gap-2">
                        <Info size={16} /> O'zgarishlar avtomatik ravishda saqlanadi
                     </p>
                  </div>
               </div>
               
               <div className="flex flex-wrap gap-3">
                  {ACTIONS.map((a) => (
                    <div key={a.key} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10">
                       <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: a.color }} />
                       {a.label}
                    </div>
                  ))}
               </div>
            </div>

            <div className="card-premium overflow-hidden shadow-md">
               <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[var(--color-bg-primary)]/40 border-b border-[var(--color-border)]">
                        <th className="px-8 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">Modul / Sahifa</th>
                        <th className="px-8 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">Tizim manzili</th>
                        {ACTIONS.map((a) => (
                          <th key={a.key} className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-center" style={{ color: a.color }}>
                             <div className="flex flex-col items-center gap-2">
                                {a.icon}
                                {a.label}
                             </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                      {menuItems.map((item) => {
                        const p = currentPerms[item.key] ?? {};
                        return (
                          <tr key={item.key} className="hover:bg-[var(--color-bg-primary)]/40 transition-colors group">
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-9 h-9 rounded-xl bg-[var(--color-bg-primary)] flex items-center justify-center text-[var(--color-text-secondary)] group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                     <Globe size={18} />
                                  </div>
                                  <span className="font-black text-[var(--color-text-primary)] tracking-tight text-sm">{t(`nav.${item.key}`, item.label)}</span>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <code className="text-[10px] font-black text-[var(--color-text-secondary)] bg-[var(--color-bg-primary)]/80 px-3 py-1.5 rounded-lg border border-[var(--color-border)] opacity-60">
                                  {item.url_path}
                               </code>
                            </td>
                            {ACTIONS.map((a) => {
                              const sk = `${selRole}-${item.key}-${a.key}`;
                              const checked = !!p[a.key];
                              const isSaving = !!saving[sk];
                              return (
                                <td key={a.key} className="px-8 py-6 text-center">
                                  <label className="relative inline-flex items-center cursor-pointer group/toggle">
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      disabled={isSaving}
                                      onChange={() => togglePerm(item, a.key)}
                                      className="sr-only peer"
                                    />
                                    <div className={`
                                      w-12 h-6 rounded-full transition-all duration-300 relative border-2 border-transparent
                                      ${checked ? '' : 'bg-[var(--color-border)]'}
                                      peer-disabled:opacity-50 shadow-inner
                                    `}
                                    style={{ backgroundColor: checked ? a.color : '' }}
                                    >
                                       <div className={`
                                          absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm
                                          ${checked ? 'translate-x-6' : 'translate-x-0'}
                                          ${isSaving ? 'animate-pulse scale-75' : ''}
                                       `} />
                                    </div>
                                  </label>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
               </div>
            </div>
          </motion.div>
        ) : (
          <div className="card-premium p-32 text-center border-dashed space-y-6">
             <div className="w-24 h-24 bg-[var(--color-bg-primary)] rounded-[2.5rem] flex items-center justify-center mx-auto text-[var(--color-text-secondary)] opacity-20">
                <Shield size={48} />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-black text-[var(--color-text-primary)] opacity-40">Rolni tanlang</h3>
                <p className="text-sm text-[var(--color-text-secondary)] max-w-xs mx-auto font-bold opacity-30">Yuqoridagi tablar orqali kerakli rolni tanlab ruxsatnomalarni boshqaring</p>
             </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}