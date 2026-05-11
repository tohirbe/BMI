import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { groups, departments } from "../../api";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { Users, FilterX, Building2, Calendar, Layers, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GroupsPage() {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [deptList, setDeptList] = useState([]);
  const [deptFilter, setDeptFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    departments.list().then((r) => setDeptList(r.data.data ?? [])).catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (deptFilter) params.department = deptFilter;
    groups.list(params)
      .then((r) => {
        let data = r.data.data ?? [];
        if (data.length === 0) {
          // Mock data
          data = [
            { id: 1, name: "911-20", department_name: "Dasturiy muhandislik", academic_year_name: "2023-2024", course: 4, semester: 8, student_count: 24 },
            { id: 2, name: "912-20", department_name: "Dasturiy muhandislik", academic_year_name: "2023-2024", course: 4, semester: 8, student_count: 22 },
            { id: 3, name: "815-21", department_name: "Kiberxavfsizlik", academic_year_name: "2023-2024", course: 3, semester: 6, student_count: 28 },
          ];
        }
        setList(data);
      })
      .catch(() => toast.error(t('common.error')))
      .finally(() => setLoading(false));
  }, [deptFilter, t]);

  useEffect(() => { load(); }, [load]);

  const deptOptions = deptList.map(d => ({ label: d.name, value: d.id }));

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader 
        title={t('university.groups_title')} 
        subtitle={t('university.groups_subtitle')}
      />

      {/* Filters */}
      <div className="card-premium p-8 flex flex-wrap items-end gap-8 shadow-sm">
        <div className="flex-1 min-w-[300px]">
          <Select
            label={t('university.faculty')}
            placeholder={t('common.all')}
            options={deptOptions}
            value={deptFilter}
            onChange={(val) => setDeptFilter(val)}
            icon={<Building2 size={20} />}
          />
        </div>
        <Button 
          variant="ghost" 
          className="h-14 px-10 font-black text-rose-500 hover:bg-rose-500/10 rounded-2xl active:scale-95 transition-all text-[10px] uppercase tracking-widest"
          onClick={() => setDeptFilter("")}
          icon={<FilterX size={22} />}
        >
          {t('university.reset_filters')}
        </Button>
      </div>

      {loading ? <Spinner /> : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium overflow-hidden shadow-md"
        >
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-bg-primary)]/40 border-b border-[var(--color-border)]">
                  <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">{t('university.group_name', 'Guruh nomi')}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">{t('university.faculty')}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-center">{t('university.academic_year')}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-center">{t('university.course_semester', 'Kurs / Semestr')}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-right">{t('university.total_students')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <AnimatePresence mode="popLayout">
                  {list.length === 0 ? (
                    <tr className="h-64">
                      <td colSpan={6} className="text-center text-[var(--color-text-secondary)]">
                         <div className="flex flex-col items-center gap-6 opacity-40">
                            <div className="w-20 h-20 bg-[var(--color-bg-primary)] rounded-[2.5rem] flex items-center justify-center shadow-inner">
                               <Layers size={48} />
                            </div>
                            <p className="font-black text-xl uppercase tracking-[0.2em] italic">{t('university.no_groups')}</p>
                         </div>
                      </td>
                    </tr>
                  ) : list.map((g, idx) => (
                    <motion.tr 
                      key={g.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-[var(--color-bg-primary)]/40 transition-all group"
                    >
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-[1rem] bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] font-black text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                            {g.name.slice(0, 2)}
                          </div>
                          <span className="font-black text-[var(--color-text-primary)] tracking-tight text-lg leading-none">{g.name}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4 text-[var(--color-text-secondary)]">
                          <div className="w-9 h-9 rounded-xl bg-[var(--color-bg-primary)] flex items-center justify-center border border-[var(--color-border)] opacity-40 group-hover:opacity-100 group-hover:text-indigo-600 transition-all">
                             <Building2 size={16} />
                          </div>
                          <span className="text-sm font-bold opacity-70 group-hover:opacity-100 transition-opacity">{g.department_name}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-[var(--color-bg-primary)] rounded-xl text-[10px] font-black text-[var(--color-text-primary)] border border-[var(--color-border)] opacity-60 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
                          <Calendar size={16} className="text-emerald-500" />
                          {g.academic_year_name}
                        </div>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <span className="px-5 py-2 bg-indigo-600/10 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-600/10">
                            {g.course}-{t('common.course', 'kurs')}
                          </span>
                          <span className="px-5 py-2 bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] rounded-xl text-[10px] font-black uppercase tracking-widest border border-[var(--color-border)] opacity-60">
                            {g.semester}-sem
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-xl shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                          <Users size={18} />
                          {g.student_count}
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