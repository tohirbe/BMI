import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { rbac } from "../../api";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import { Shield, Key, Eye, Plus, Edit3, Trash2, CheckCircle2, AlertCircle, Info, Lock, Globe, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ACTIONS = [
  { key: "can_view", label: "View", icon: <Eye size={14} />, color: "#3b82f6" },
  { key: "can_add", label: "Create", icon: <Plus size={14} />, color: "#10b981" },
  { key: "can_edit", label: "Edit", icon: <Edit3 size={14} />, color: "#f59e0b" },
  { key: "can_delete", label: "Delete", icon: <Trash2 size={14} />, color: "#f43f5e" },
];

export default function PermissionMatrix() {
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
        
        // Auto-select first role if none in URL
        if (!selRole && fetchedRoles.length > 0) {
          setSelRole(String(fetchedRoles[0].id));
        }
      })
      .catch(() => toast.error("Ma'lumot yuklanmadi"))
      .finally(() => setLoading(false));
  }, [selRole]);

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
      toast.error("Saqlashda xato");
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
    <div className="space-y-8 animate-fade-in pb-20">
      <PageHeader 
        title="Permission Matrix" 
        subtitle="Manage granular access control for each role across the platform"
        icon={<Settings2 size={28} className="text-indigo-600" />}
      />

      {/* Role Selector Tabs */}
      <div className="flex bg-slate-100/50 p-1 rounded-2xl w-fit overflow-x-auto scrollbar-hide">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelRole(String(role.id))}
            className={`
              px-8 py-3 rounded-xl text-sm font-black transition-all whitespace-nowrap
              ${String(selRole) === String(role.id) 
                ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-200/50' 
                : 'text-slate-400 hover:text-slate-600'}
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
            className="space-y-6"
          >
            <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                     <Shield size={28} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black">{selectedRole.name} Permissions</h3>
                     <p className="text-indigo-100 font-medium text-sm flex items-center gap-2">
                        <Info size={14} /> Changes are automatically saved in real-time
                     </p>
                  </div>
               </div>
               
               <div className="flex gap-2">
                  {ACTIONS.map((a) => (
                    <div key={a.key} className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }} />
                       {a.label}
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-0">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Page / Module</th>
                        <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">System Path</th>
                        {ACTIONS.map((a) => (
                          <th key={a.key} className="px-8 py-6 text-[11px] font-black uppercase tracking-widest border-b border-slate-100 text-center" style={{ color: a.color }}>
                             <div className="flex flex-col items-center gap-1">
                                {a.icon}
                                {a.label}
                             </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {menuItems.map((item) => {
                        const p = currentPerms[item.key] ?? {};
                        return (
                          <tr key={item.key} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-5">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all">
                                     <Globe size={16} />
                                  </div>
                                  <span className="font-bold text-slate-800 tracking-tight">{item.label}</span>
                               </div>
                            </td>
                            <td className="px-8 py-5">
                               <code className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                  {item.url_path}
                               </code>
                            </td>
                            {ACTIONS.map((a) => {
                              const sk = `${selRole}-${item.key}-${a.key}`;
                              const checked = !!p[a.key];
                              const isSaving = !!saving[sk];
                              return (
                                <td key={a.key} className="px-8 py-5 text-center">
                                  <label className="relative inline-flex items-center cursor-pointer group/toggle">
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      disabled={isSaving}
                                      onChange={() => togglePerm(item, a.key)}
                                      className="sr-only peer"
                                    />
                                    <div className={`
                                      w-12 h-6 rounded-full transition-all duration-300 relative
                                      ${checked ? 'bg-indigo-500' : 'bg-slate-200'}
                                      peer-disabled:opacity-50
                                    `}
                                    style={{ backgroundColor: checked ? a.color : '' }}
                                    >
                                       <div className={`
                                          absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md
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
          <div className="bg-white rounded-[3rem] p-32 text-center border border-dashed border-slate-200 space-y-4">
             <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-300">
                <Shield size={40} />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-400">Select a role to manage permissions</h3>
                <p className="text-sm text-slate-300 max-w-xs mx-auto font-medium">Use the tabs above to switch between different system roles.</p>
             </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}