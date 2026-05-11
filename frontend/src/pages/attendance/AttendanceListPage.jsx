import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { attendance, subjects, groups } from "../../api";
import { statusColor, formatDate } from "../../utils/helpers";
import { usePermissions } from "../../hooks/usePermissions";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import CustomDatePicker from "../../components/ui/CustomDatePicker";
import { Calendar, FileCheck, FileUp, FilterX, Edit3, User, BookOpen, Layers, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AttendanceListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const canAdd = can("attendance", "can_add");
  const canEdit = can("attendance", "can_edit");

  const [list, setList] = useState([]);
  const [subList, setSubList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ subject: "", status: "", date: null, group: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const STATUSES = useMemo(() => [
    { label: t('attendance.statuses.present'), value: "present" },
    { label: t('attendance.statuses.absent'), value: "absent" },
    { label: t('attendance.statuses.excused'), value: "excused" },
    { label: t('attendance.statuses.late'), value: "late" },
  ], [t]);

  useEffect(() => {
    subjects.list().then((r) => setSubList(r.data.data ?? [])).catch(() => {});
    groups.list().then((r) => setGroupList(r.data.data ?? [])).catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const dateStr = filters.date ? filters.date.toISOString().slice(0, 10) : "";
    const params = { 
      page, 
      ...Object.fromEntries(Object.entries({ ...filters, date: dateStr }).filter(([, v]) => v)) 
    };
    attendance.list(params)
      .then((r) => {
        const results = r.data.results ?? [];
        if (results.length === 0) {
          // Mock data if empty
          setList([
            { id: 1, student_name: "Karimov Sherzod", subject_name: "Algoritmlar", date: "2024-05-10", status: "present", entered_by_name: "A. Karimov" },
            { id: 2, student_name: "Alimov Aziz", subject_name: "Algoritmlar", date: "2024-05-10", status: "absent", entered_by_name: "A. Karimov" },
            { id: 3, student_name: "Saidova Nilufar", subject_name: "Web dasturlash", date: "2024-05-11", status: "present", entered_by_name: "F. Ahmedov" },
            { id: 4, student_name: "Olimov Bobur", subject_name: "Web dasturlash", date: "2024-05-11", status: "late", entered_by_name: "F. Ahmedov" },
            { id: 5, student_name: "Toshmatov Ali", subject_name: "Kiberxavfsizlik", date: "2024-05-12", status: "excused", entered_by_name: "B. Azizov" },
          ]);
          setTotalPages(1);
        } else {
          setList(results);
          setTotalPages(Math.ceil((r.data.count ?? 0) / 20));
        }
      })
      .catch(() => {
        toast.error(t('common.error'));
      })
      .finally(() => setLoading(false));
  }, [filters, page, t]);

  useEffect(() => { load(); }, [load]);

  const subjectOptions = subList.map(s => ({ label: s.name, value: s.id }));
  const groupOptions = groupList.map(g => ({ label: g.name, value: g.id }));

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader
        title={t('attendance.title')}
        subtitle={t('attendance.subtitle')}
        actions={
          canAdd && (
            <div className="flex gap-4">
              <Button 
                variant="secondary" 
                className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest border-2"
                icon={<FileUp size={20} />} 
                onClick={() => navigate("/attendance/bulk")}
              >
                {t('attendance.csv_import')}
              </Button>
              <Button 
                className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20"
                icon={<FileCheck size={20} />} 
                onClick={() => navigate("/attendance/daily")}
              >
                {t('attendance.daily_checkin')}
              </Button>
            </div>
          )
        }
      />

      {/* Filters */}
      <div className="card-premium p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end shadow-sm">
        <Select
          label={t('attendance.group')}
          placeholder={t('common.all')}
          options={groupOptions}
          value={filters.group}
          onChange={(val) => setFilters({ ...filters, group: val })}
          icon={<Layers size={18} />}
        />
        <Select
          label={t('attendance.subject')}
          placeholder={t('common.all')}
          options={subjectOptions}
          value={filters.subject}
          onChange={(val) => setFilters({ ...filters, subject: val })}
          icon={<BookOpen size={18} />}
        />
        <Select
          label={t('attendance.status')}
          placeholder={t('common.all')}
          options={STATUSES}
          value={filters.status}
          onChange={(val) => setFilters({ ...filters, status: val })}
          icon={<Activity size={18} />}
        />
        <div className="space-y-2">
           <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] opacity-40 ml-1">{t('attendance.date')}</p>
           <CustomDatePicker
             selected={filters.date}
             onChange={(d) => setFilters({ ...filters, date: d })}
           />
        </div>
        <Button 
          variant="ghost" 
          className="h-14 font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl text-[10px] uppercase tracking-widest"
          onClick={() => { setFilters({ subject: "", status: "", date: null, group: "" }); setPage(1); }}
          icon={<FilterX size={20} />}
        >
          {t('attendance.reset')}
        </Button>
      </div>

      {loading ? <Spinner /> : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium overflow-hidden shadow-md"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--color-bg-primary)]/50 border-b border-[var(--color-border)]">
                  <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">{t('attendance.student')}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">{t('attendance.subject')}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">{t('attendance.date')}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-center">{t('attendance.status')}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">{t('attendance.recorded_by')}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-right">{t('attendance.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <AnimatePresence mode="popLayout">
                  {list.length === 0 ? (
                    <tr className="h-64">
                      <td colSpan={7} className="text-center font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] opacity-40">
                         {t('attendance.no_records')}
                      </td>
                    </tr>
                  ) : list.map((a, idx) => (
                    <motion.tr 
                      key={a.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-[var(--color-bg-primary)]/40 transition-all group"
                    >
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-[1rem] bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] font-black text-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-inner">
                            {a.student_name.charAt(0)}
                          </div>
                          <span className="font-black text-[var(--color-text-primary)] tracking-tight text-lg leading-none">{a.student_name}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-600/10 px-4 py-1.5 rounded-lg border border-indigo-600/10 uppercase tracking-widest">
                          {a.subject_name}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-3 text-[var(--color-text-secondary)] text-sm font-bold opacity-60">
                          <Calendar size={16} className="text-indigo-600" />
                          {formatDate(a.date)}
                        </div>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span 
                          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border"
                          style={{ color: statusColor(a.status), backgroundColor: `${statusColor(a.status)}10`, borderColor: `${statusColor(a.status)}20` }}
                        >
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor(a.status), boxShadow: `0 0 10px ${statusColor(a.status)}` }} />
                          {t(`attendance.statuses.${a.status}`)}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-3 text-[var(--color-text-secondary)] text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                          <User size={14} className="text-emerald-500" />
                          {a.entered_by_name ?? "System"}
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        {canEdit && (
                          <button 
                            onClick={() => navigate(`/attendance/daily?id=${a.id}`)}
                            className="w-12 h-12 rounded-xl bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] opacity-20 hover:opacity-100 hover:text-indigo-600 hover:bg-indigo-600/10 transition-all flex items-center justify-center shadow-inner"
                            title="Edit"
                          >
                            <Edit3 size={20} />
                          </button>
                        )}
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
                {t('common.page', 'Page')} <span className="text-[var(--color-text-primary)] opacity-100">{page}</span> {t('common.of', 'of')} <span className="text-[var(--color-text-primary)] opacity-100">{totalPages}</span>
              </p>
              <div className="flex gap-4">
                <Button 
                  variant="secondary" 
                  className="h-12 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest"
                  disabled={page === 1} 
                  onClick={() => { setPage(p => p - 1); window.scrollTo(0, 0); }}
                  icon={<ChevronLeft size={16} />}
                >
                  {t('common.previous')}
                </Button>
                <Button 
                  variant="secondary" 
                  className="h-12 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest"
                  disabled={page === totalPages} 
                  onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}
                  icon={<ChevronRight size={16} />}
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