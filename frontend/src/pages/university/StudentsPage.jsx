import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { studentProfiles, groups } from "../../api";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { Users, FilterX, Mail, Fingerprint, Calendar, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentsPage() {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [groupFilter, setGroupFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    groups.list().then((r) => setGroupList(r.data.data ?? [])).catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page };
    if (groupFilter) params.group = groupFilter;
    studentProfiles.list(params)
      .then((r) => {
        let data = r.data.data ?? [];
        if (data.length === 0) {
          // Mock data
          data = [
            { id: 1, full_name: "Azizov Bekzod", email: "azizov@tatu.uz", student_id: "2010154", group_name: "911-20", date_of_birth: "2002-05-12" },
            { id: 2, full_name: "Karimova Zilola", email: "karimova@tatu.uz", student_id: "2010155", group_name: "911-20", date_of_birth: "2003-01-20" },
            { id: 3, full_name: "Saidov Olim", email: "saidov@tatu.uz", student_id: "2010156", group_name: "912-20", date_of_birth: "2002-11-30" },
          ];
        }
        setList(data);
        setTotalPages(Math.ceil((r.data.count ?? data.length ?? 0) / 20));
      })
      .catch(() => toast.error(t('common.error')))
      .finally(() => setLoading(false));
  }, [page, groupFilter, t]);

  useEffect(() => { load(); }, [load]);

  const groupOptions = groupList.map(g => ({ label: g.name, value: g.id }));

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader 
        title={t('nav.students')} 
        subtitle={t('university.students_subtitle')}
      />

      {/* Filters */}
      <div className="card-premium p-8 flex flex-wrap items-end gap-8 shadow-sm">
        <div className="flex-1 min-w-[300px]">
          <Select
            label={t('university.filter_group')}
            placeholder={t('university.all_groups')}
            options={groupOptions}
            value={groupFilter}
            onChange={(val) => { setGroupFilter(val); setPage(1); }}
            icon={<Users size={20} />}
          />
        </div>
        <Button 
          variant="ghost" 
          className="h-14 px-10 font-black text-rose-500 hover:bg-rose-500/10 rounded-2xl active:scale-95 transition-all text-[10px] uppercase tracking-widest"
          onClick={() => { setGroupFilter(""); setPage(1); }}
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
                  <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">{t('attendance.student')}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">{t('university.contact')}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-center">{t('attendance.id')}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-center">{t('attendance.group')}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">{t('university.birth_date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <AnimatePresence mode="popLayout">
                  {list.length === 0 ? (
                    <tr className="h-64">
                      <td colSpan={5} className="text-center text-[var(--color-text-secondary)]">
                         <div className="flex flex-col items-center gap-6 opacity-40">
                            <div className="w-20 h-20 bg-[var(--color-bg-primary)] rounded-[2.5rem] flex items-center justify-center shadow-inner">
                               <GraduationCap size={48} />
                            </div>
                            <p className="font-black text-xl uppercase tracking-[0.2em] italic">{t('attendance.no_students')}</p>
                         </div>
                      </td>
                    </tr>
                  ) : list.map((s_, idx) => (
                    <motion.tr 
                      key={s_.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="hover:bg-[var(--color-bg-primary)]/40 transition-all group"
                    >
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-[1rem] bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] font-black text-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-500 shadow-inner">
                            {s_.full_name.charAt(0)}
                          </div>
                          <span className="font-black text-[var(--color-text-primary)] tracking-tight text-lg leading-none">{s_.full_name}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4 text-[var(--color-text-secondary)]">
                          <div className="w-9 h-9 rounded-xl bg-[var(--color-bg-primary)] flex items-center justify-center border border-[var(--color-border)] opacity-40 group-hover:opacity-100 group-hover:text-indigo-600 transition-all">
                             <Mail size={16} />
                          </div>
                          <span className="text-sm font-bold opacity-70 group-hover:opacity-100 transition-opacity">{s_.email}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-[var(--color-bg-primary)] rounded-xl text-[10px] font-black text-[var(--color-text-primary)] border border-[var(--color-border)] opacity-60 group-hover:opacity-100 transition-opacity">
                          <Fingerprint size={16} className="text-indigo-600" />
                          {s_.student_id || "N/A"}
                        </div>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className="px-5 py-2 bg-indigo-600/10 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-600/10">
                          {s_.group_name || "—"}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4 text-[var(--color-text-secondary)] text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                          <Calendar size={18} className="text-rose-500" />
                          <span>{s_.date_of_birth || "—"}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-10 py-8 bg-[var(--color-bg-primary)]/30 border-t border-[var(--color-border)] flex items-center justify-between">
              <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] opacity-40">
                {t('common.page', 'Sahifa')} <span className="text-[var(--color-text-primary)] opacity-100">{page}</span> / <span className="text-[var(--color-text-primary)] opacity-100">{totalPages}</span>
              </p>
              <div className="flex gap-4">
                <Button 
                  variant="secondary" 
                  className="font-black h-12 px-8 rounded-2xl text-[10px] uppercase tracking-[0.2em]"
                  disabled={page === 1} 
                  onClick={() => { setPage(p => p - 1); window.scrollTo(0, 0); }}
                  icon={<ChevronLeft size={18} />}
                >
                  {t('common.previous')}
                </Button>
                <Button 
                  variant="secondary" 
                  className="font-black h-12 px-8 rounded-2xl text-[10px] uppercase tracking-[0.2em]"
                  disabled={page === totalPages} 
                  onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}
                  icon={<ChevronRight size={18} />}
                  iconPosition="right"
                >
                  {t('common.next')}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}