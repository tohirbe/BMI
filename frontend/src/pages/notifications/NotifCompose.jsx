import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { notifications, faculties, departments, groups, users } from "../../api";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/authSlice";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { Send, Globe, Building2, Layers, Users, User, Type, AlignLeft, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LEVELS = [
  { value: "university", label: "University", roles: ["superuser", "rector"], icon: <Globe size={18} /> },
  { value: "faculty", label: "Faculty", roles: ["superuser", "rector", "dean"], icon: <Building2 size={18} /> },
  { value: "department", label: "Department", roles: ["superuser", "rector", "dean", "head", "vice_head"], icon: <Layers size={18} /> },
  { value: "group", label: "Group", roles: ["superuser", "rector", "dean", "head", "vice_head", "teacher"], icon: <Users size={18} /> },
  { value: "personal", label: "Personal", roles: ["superuser", "rector", "dean", "head", "vice_head", "teacher", "student"], icon: <User size={18} /> },
];

export default function NotifCompose() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);

  const [form, setForm] = useState({ title: "", body: "", level: "", target_faculty: "", target_department: "", target_group: "", target_user: "" });
  const [facList, setFacList] = useState([]);
  const [deptList, setDeptList] = useState([]);
  const [grpList, setGrpList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const availableLevels = LEVELS.filter((l) =>
    currentUser?.role === "superuser" || l.roles.includes(currentUser?.role)
  );

  useEffect(() => {
    if (form.level === "faculty") faculties.list().then((r) => setFacList(r.data.data ?? [])).catch(() => {});
    if (form.level === "department") departments.list().then((r) => setDeptList(r.data.data ?? [])).catch(() => {});
    if (form.level === "group") groups.list().then((r) => setGrpList(r.data.data ?? [])).catch(() => {});
    if (form.level === "personal") users.list().then((r) => setUserList(r.data.results ?? [])).catch(() => {});
  }, [form.level]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.level) { toast.error(t('notifications.select_level', 'Darajani tanlang')); return; }
    setSubmitting(true);

    const payload = { title: form.title, body: form.body, level: form.level };
    if (form.level === "faculty" && form.target_faculty) payload.target_faculty = form.target_faculty;
    if (form.level === "department" && form.target_department) payload.target_department = form.target_department;
    if (form.level === "group" && form.target_group) payload.target_group = form.target_group;
    if (form.level === "personal" && form.target_user) payload.target_user = form.target_user;

    try {
      await notifications.create(payload);
      toast.success(t('notifications.sent_success', 'Xabarnoma yuborildi'));
      navigate("/notifications");
    } catch (err) {
      const details = err.response?.data?.details;
      const msg = details
        ? Object.values(details).flat()[0]
        : err.response?.data?.error ?? t('common.error');
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <PageHeader 
        title={t('notifications.compose', 'Xabarnoma yaratish')} 
        subtitle={t('notifications.compose_subtitle', 'E\'lonlarni tarqatish yoki shaxsiy xabarlar yuborish')}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium overflow-hidden shadow-sm"
      >
        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-10">
          
          {/* Level Selection */}
          <div className="space-y-4">
            <label className="text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-widest flex items-center gap-2 opacity-60">
               <ShieldCheck size={16} /> {t('notifications.broadcast_level', 'Tarqatish darajasi')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {availableLevels.map((l) => (
                <div
                  key={l.value}
                  onClick={() => set("level", l.value)}
                  className={`
                    cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 text-center
                    ${form.level === l.value 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'bg-[var(--color-bg-primary)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-indigo-600/30'}
                  `}
                >
                  <div className={`${form.level === l.value ? 'text-white' : 'text-indigo-600'}`}>
                    {l.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tight leading-tight">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Conditional Target Selects */}
            <AnimatePresence mode="wait">
              {form.level === "faculty" && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="col-span-2">
                  <Select
                    label={t('university.faculty', 'Fakultet')}
                    options={facList.map(f => ({ label: f.name, value: f.id }))}
                    value={form.target_faculty}
                    onChange={(val) => set("target_faculty", val)}
                    icon={<Building2 size={16} />}
                    required
                  />
                </motion.div>
              )}
              {form.level === "department" && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="col-span-2">
                  <Select
                    label={t('university.department', 'Kafedra')}
                    options={deptList.map(d => ({ label: d.name, value: d.id }))}
                    value={form.target_department}
                    onChange={(val) => set("target_department", val)}
                    icon={<Layers size={16} />}
                    required
                  />
                </motion.div>
              )}
              {form.level === "group" && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="col-span-2">
                  <Select
                    label={t('dashboard.group_label', 'Guruh')}
                    options={grpList.map(g => ({ label: g.name, value: g.id }))}
                    value={form.target_group}
                    onChange={(val) => set("target_group", val)}
                    icon={<Users size={16} />}
                    required
                  />
                </motion.div>
              )}
              {form.level === "personal" && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="col-span-2">
                  <Select
                    label={t('notifications.recipient', 'Qabul qiluvchi')}
                    options={userList.map(u => ({ label: `${u.full_name} (${u.email})`, value: u.id }))}
                    value={form.target_user}
                    onChange={(val) => set("target_user", val)}
                    icon={<User size={16} />}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="col-span-2 space-y-6">
              <Input
                label={t('notifications.title', 'Sarlavha')}
                placeholder={t('notifications.title_placeholder', 'Mavzuni kiriting...')}
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                icon={<Type size={16} />}
                required
              />

              <div className="space-y-2">
                <label className="text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-widest flex items-center gap-2 opacity-60">
                   <AlignLeft size={16} /> {t('notifications.body', 'Xabar matni')}
                </label>
                <textarea
                  required
                  value={form.body}
                  onChange={(e) => set("body", e.target.value)}
                  placeholder={t('notifications.body_placeholder', 'Xabaringizni yozing...')}
                  rows={8}
                  className="w-full px-6 py-4 rounded-[1.5rem] bg-[var(--color-bg-primary)] border border-[var(--color-border)] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium text-[var(--color-text-primary)] leading-relaxed placeholder:text-[var(--color-text-secondary)] placeholder:opacity-40"
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row justify-end gap-3">
             <Button variant="ghost" type="button" onClick={() => navigate("/notifications")} className="rounded-2xl font-black text-xs uppercase tracking-widest">{t('common.cancel')}</Button>
             <Button type="submit" loading={submitting} icon={<Send size={18} />} className="rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20">
                {t('notifications.send', 'Yuborish')}
             </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}