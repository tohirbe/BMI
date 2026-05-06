import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { rbac } from "../../api";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { Shield, Key, ChevronRight, CheckCircle2, Lock, ArrowRight, ShieldCheck, Activity, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RolesPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    rbac.roles()
      .then((r) => setList(r.data.data ?? []))
      .catch(() => toast.error("Rollar yuklanmadi"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <PageHeader 
        title="System Roles" 
        subtitle="Manage authorization levels and system access for all university roles"
        icon={<Shield size={28} className="text-indigo-600" />}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Role Identity</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">System Slug</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Permissions</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-center">Status</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {list.map((role, idx) => (
                  <motion.tr 
                    key={role.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-slate-50/80 transition-all duration-300"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-indigo-200">
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                           <p className="font-black text-slate-800 tracking-tight text-lg leading-tight">{role.name}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Management Role</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                       <code className="text-[11px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 group-hover:bg-white transition-colors">
                          role.{role.slug}
                       </code>
                    </td>
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-400 border border-slate-100 group-hover:bg-indigo-50 transition-all">
                             <Activity size={18} />
                          </div>
                          <div>
                             <span className="text-sm font-black text-slate-700 tracking-tight">
                                {role.permissions?.filter((p) => p.can_view).length ?? 0}
                             </span>
                             <span className="text-xs font-bold text-slate-400 ml-1.5 uppercase tracking-tighter">Pages</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                       <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${role.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                          <div className={`w-2 h-2 rounded-full ${role.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                          {role.is_active ? "Active" : "Inactive"}
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
                          Manage Matrix
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