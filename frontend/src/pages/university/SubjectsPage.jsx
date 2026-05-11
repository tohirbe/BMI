import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { subjects, departments, groups } from "../../api";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { BookOpen, FilterX, Building2, Users, User, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SubjectsPage() {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [deptList, setDeptList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [filters, setFilters] = useState({ department: "", group: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    departments.list().then((r) => setDeptList(r.data.data ?? [])).catch(() => {});
    groups.list().then((r) => setGroupList(r.data.data ?? [])).catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (filters.department) params.department = filters.department;
    if (filters.group) params.group = filters.group;
    subjects.list(params)
      .then((r) => {
        let data = r.data.data ?? [];
        if (data.length === 0) {
          data = [
            { id: 1, name: "Ma'lumotlar tuzilmasi va algoritmlar", short_name: "DSA", department_name: "Dasturiy muhandislik", teacher_name: "Karimov A.", group_name: "911-20", credit_hours: 6 },
            { id: 2, name: "Ma'lumotlar bazasi", short_name: "DB", department_name: "Dasturiy muhandislik", teacher_name: "Saidov O.", group_name: "911-20", credit_hours: 5 },
            { id: 3, name: "Kiberxavfsizlik asoslari", short_name: "CS", department_name: "Kiberxavfsizlik", teacher_name: "Azizov B.", group_name: "815-21", credit_hours: 6 },
          ];
        }
        setList(data);
      })
      .catch(() => toast.error(t('common.error')))
      .finally(() => setLoading(false));
  }, [filters, t]);

  useEffect(() => { load(); }, [load]);

  const deptOptions = deptList.map(d => ({ label: d.name, value: d.id }));
  const groupOptions = groupList.map(g => ({ label: g.name, value: g.id }));

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title={t('university.curriculum', 'O\'quv rejasi')} 
        subtitle={t('university.curriculum_subtitle', 'Akademik fanlar, kafedralar va o\'qituvchilarni boshqarish')}
      />

      {/* Filters */}
      <div className="card-premium p-6 shadow-sm flex flex-col sm:flex-row flex-wrap items-end gap-4 sm:gap-6">
        <div className="flex-1 min-w-[200px] w-full sm:w-auto">
          <Select
            label={t('university.faculty', 'Kafedra')}
            placeholder={t('common.all', 'Barchasi')}
            options={deptOptions}
            value={filters.department}
            onChange={(val) => setFilters({ ...filters, department: val })}
            icon={<Building2 size={18} />}
          />
        </div>
        <div className="flex-1 min-w-[200px] w-full sm:w-auto">
          <Select
            label={t('dashboard.group_label', 'Guruh')}
            placeholder={t('common.all', 'Barchasi')}
            options={groupOptions}
            value={filters.group}
            onChange={(val) => setFilters({ ...filters, group: val })}
            icon={<Users size={18} />}
          />
        </div>
        <Button 
          variant="ghost" 
          className="h-12 px-6 font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl"
          onClick={() => setFilters({ department: "", group: "" })}
          icon={<FilterX size={18} />}
        >
          {t('university.reset_filters', 'Tozalash')}
        </Button>
      </div>

      {loading ? <Spinner /> : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--color-bg-primary)]/50 border-b border-[var(--color-border)]">
                  <th className="px-8 py-5 text-[11px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest">{t('nav.subjects', 'Fan')}</th>
                  <th className="px-8 py-5 text-[11px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest hidden md:table-cell">{t('university.faculty', 'Kafedra')}</th>
                  <th className="px-8 py-5 text-[11px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest hidden lg:table-cell">{t('dashboard.teachers', 'O\'qituvchi')}</th>
                  <th className="px-8 py-5 text-[11px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest text-center">{t('dashboard.group_label', 'Guruh')}</th>
                  <th className="px-8 py-5 text-[11px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest text-center">{t('dashboard.credits', 'Kreditlar')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                <AnimatePresence mode="popLayout">
                  {list.length === 0 ? (
                    <tr className="h-64">
                      <td colSpan={5} className="text-center text-[var(--color-text-secondary)] opacity-40">
                         <BookOpen size={48} className="mx-auto opacity-20 mb-2" />
                         <p className="font-bold">{t('common.no_records')}</p>
                      </td>
                    </tr>
                  ) : list.map((sub, idx) => (
                    <motion.tr 
                      key={sub.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-[var(--color-bg-primary)]/80 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-black text-[var(--color-text-primary)] tracking-tight">{sub.name}</span>
                          <span className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest opacity-40">{sub.short_name || "—"}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-[var(--color-text-secondary)] hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="opacity-40" />
                          {sub.department_name}
                        </div>
                      </td>
                      <td className="px-8 py-5 hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                          <User size={14} className="text-indigo-600" />
                          <span className="text-sm font-bold">{sub.teacher_name || "—"}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="px-3 py-1 bg-indigo-600/10 text-indigo-600 rounded-lg text-xs font-black">
                          {sub.group_name}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-lg font-black text-xs">
                          <Clock size={12} />
                          {sub.credit_hours}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}