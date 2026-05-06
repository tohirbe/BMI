import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { users } from "../../api";
import { formatDate } from "../../utils/helpers";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { UserPlus, Search, Shield, ShieldCheck, Mail, Phone, Lock, Edit3, ShieldAlert, UserX, UserCheck, X, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ROLES = [
  { value: "rector", label: "Rektor" },
  { value: "dean", label: "Dekan" },
  { value: "head", label: "Kafedra boshlig'i" },
  { value: "vice_head", label: "O'rinbosar" },
  { value: "teacher", label: "O'qituvchi" },
  { value: "student", label: "Talaba" },
];

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
      .catch(() => toast.error("Yuklanmadi"))
      .finally(() => setLoading(false));
  }, [page, search, roleFilter]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ first_name: "", last_name: "", middle_name: "", email: "", role: "student", phone: "", password: "", password2: "" });
    setModal("create");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (modal === "create" && form.password !== form.password2) {
      toast.error("Parollar mos emas"); return;
    }
    setSaving(true);
    try {
      if (modal === "create") {
        await users.create(form);
        toast.success("Foydalanuvchi yaratildi");
      } else {
        await users.update(modal.id, { first_name: form.first_name, last_name: form.last_name, middle_name: form.middle_name, phone: form.phone });
        toast.success("Yangilandi");
      }
      setModal(null);
      load();
    } catch (err) {
      const d = err.response?.data?.details;
      toast.error(d ? Object.values(d).flat()[0] : err.response?.data?.error ?? "Xato");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (u) => {
    try {
      await users.update(u.id, { is_active: !u.is_active });
      toast.success(u.is_active ? "Bloklandi" : "Faollashtirildi");
      load();
    } catch { toast.error("Xato"); }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="User Management"
        subtitle="Manage system access, roles, and user accounts"
        actions={
          <Button icon={<UserPlus size={18} />} onClick={openCreate}>
            Add New User
          </Button>
        }
      />

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-wrap items-end gap-6">
        <div className="flex-[2] min-w-[300px]">
          <Input
            placeholder="Search by name, email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            icon={<Search size={18} />}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <Select
            placeholder="All Roles"
            options={ROLES}
            value={roleFilter}
            onChange={(val) => { setRoleFilter(val); setPage(1); }}
            icon={<Shield size={18} />}
          />
        </div>
      </div>

      {loading ? <Spinner /> : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">User Profile</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email Address</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">System Role</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Joined Date</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {list.length === 0 ? (
                    <tr className="h-64"><td colSpan={6} className="text-center font-bold text-slate-300">No users found</td></tr>
                  ) : list.map((u, idx) => (
                    <motion.tr 
                      key={u.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg"
                            style={{ backgroundColor: ROLE_COLORS[u.role] ?? "#64748b" }}
                          >
                            {u.first_name.charAt(0)}{u.last_name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-800 tracking-tight">{u.full_name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Mail size={14} className="opacity-40" />
                          <span className="text-sm font-medium">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span 
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest"
                          style={{ color: ROLE_COLORS[u.role], backgroundColor: `${ROLE_COLORS[u.role]}10` }}
                        >
                          <ShieldCheck size={12} />
                          {u.role}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${u.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {u.is_active ? "Active" : "Blocked"}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-400 font-medium">{formatDate(u.created_at)}</td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setForm({ ...u, password: "", password2: "" }); setModal(u); }}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                            title="Edit"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => handleToggleActive(u)}
                            className={`p-2 rounded-xl transition-all ${u.is_active ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                            title={u.is_active ? "Block User" : "Activate User"}
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
            <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Page <span className="text-slate-900 font-bold">{page}</span> of <span className="text-slate-900 font-bold">{totalPages}</span>
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
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
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden"
            >
              <div className="p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-800">
                    {modal === "create" ? "New User Account" : "Update Profile"}
                  </h3>
                  <button onClick={() => setModal(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="First Name *" value={form.first_name} onChange={(e) => setForm({...form, first_name: e.target.value})} required />
                    <Input label="Last Name *" value={form.last_name} onChange={(e) => setForm({...form, last_name: e.target.value})} required />
                  </div>
                  <Input label="Middle Name" value={form.middle_name??""} onChange={(e) => setForm({...form, middle_name: e.target.value})} />
                  
                  {modal === "create" && (
                    <>
                      <Input label="Email Address *" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} icon={<Mail size={16}/>} required />
                      <Select label="System Role *" options={ROLES} value={form.role} onChange={(val) => setForm({...form, role: val})} icon={<Shield size={16}/>} />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Password *" type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} icon={<Lock size={16}/>} required />
                        <Input label="Confirm Password *" type="password" value={form.password2} onChange={(e) => setForm({...form, password2: e.target.value})} required />
                      </div>
                    </>
                  )}
                  
                  <Input label="Phone Number" value={form.phone??""} onChange={(e) => setForm({...form, phone: e.target.value})} icon={<Phone size={16}/>} placeholder="+998..." />
                  
                  <div className="pt-4 flex justify-end gap-3 border-t border-slate-50">
                    <Button variant="ghost" type="button" onClick={() => setModal(null)}>Cancel</Button>
                    <Button type="submit" loading={saving} icon={<Save size={18}/>}>
                      {modal === "create" ? "Create Account" : "Update User"}
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