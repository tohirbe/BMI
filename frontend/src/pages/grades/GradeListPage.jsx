import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { grades, subjects, groups } from "../../api";
import { letterGradeColor, formatDate } from "../../utils/helpers";
import { usePermissions } from "../../hooks/usePermissions";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { Plus, FileUp, FilterX, Edit3, Trash2, GraduationCap, BookOpen, Layers, ChevronLeft, ChevronRight, Calendar, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GradeListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const canAdd = can("grades", "can_add");
  const canEdit = can("grades", "can_edit");
  const canDelete = can("grades", "can_delete");

  const [list, setList] = useState([]);
  const [subList, setSubList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ subject: "", grade_type: "", group: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const GRADE_TYPES = useMemo(() => [
    { label: t('grades.types.joriy_1'), value: "joriy_1" },
    { label: t('grades.types.joriy_2'), value: "joriy_2" },
    { label: t('grades.types.oraliq'), value: "oraliq" },
    { label: t('grades.types.yakuniy'), value: "yakuniy" },
  ], [t]);

  useEffect(() => {
    subjects.list().then((r) => setSubList(r.data.data ?? [])).catch(() => {});
    groups.list().then((r) => setGroupList(r.data.data ?? [])).catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
    grades.list(params)
      .then((r) => {
        const results = r.data.results ?? [];
        if (results.length === 0) {
          // Mock data
          setList([
            { id: 1, student_name: "Karimov Sherzod", subject_name: "Algoritmlar", grade_type: "joriy_1", score: 88, letter_grade: "A'lo (Excellent)", date: "2024-03-10" },
            { id: 2, student_name: "Alimov Aziz", subject_name: "Algoritmlar", grade_type: "joriy_1", score: 75, letter_grade: "Yaxshi (Good)", date: "2024-03-10" },
            { id: 3, student_name: "Saidova Nilufar", subject_name: "Web dasturlash", grade_type: "oraliq", score: 92, letter_grade: "A'lo (Excellent)", date: "2024-04-15" },
            { id: 4, student_name: "Olimov Bobur", subject_name: "Ma'lumotlar bazasi", grade_type: "yakuniy", score: 58, letter_grade: "Qoniqarli (Satisfactory)", date: "2024-05-20" },
            { id: 5, student_name: "Toshmatov Ali", subject_name: "Kiberxavfsizlik", grade_type: "yakuniy", score: 45, letter_grade: "Qoniqarsiz (Fail)", date: "2024-05-21" },
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

  const handleDelete = async (id) => {
    if (!window.confirm(t('common.confirm_delete', 'Haqiqatan ham o\'chirmoqchimisiz?'))) return;
    try {
      await grades.delete(id);
      toast.success(t('common.success'));
      load();
    } catch {
      toast.error(t('common.error'));
    }
  };

  const subjectOptions = subList.map(s => ({ label: s.name, value: s.id }));
  const groupOptions = groupList.map(g => ({ label: g.name, value: g.id }));

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader
        title={t('grades.title')}
        subtitle={t('grades.subtitle')}
        actions={
          canAdd && (
            <div className="flex gap-4">
              <Button 
                variant="secondary" 
                className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest border-2"
                icon={<FileUp size={20} />} 
                onClick={() => navigate("/grades/bulk")}
              >
                {t('attendance.csv_import')}
              </Button>
              <Button 
                className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20"
                icon={<Plus size={20} />} 
                onClick={() => navigate("/grades/new")}
              >
                {t('grades.enter_grade')}
              </Button>
            </div>
          )
        }
      />

      {/* Filter Section */}
      <div className="card-premium p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end shadow-sm">
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
          label={t('grades.grade_type')}
          placeholder={t('common.all')}
          options={GRADE_TYPES}
          value={filters.grade_type}
          onChange={(val) => setFilters({ ...filters, grade_type: val })}
          icon={<Activity size={18} />}
        />
        
        <Button 
          variant="ghost" 
          className="h-14 px-8 font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl text-[10px] uppercase tracking-widest"
          onClick={() => { setFilters({ subject: "", grade_type: "", group: "" }); setPage(1); }}
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
                  <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-center">{t('common.type', 'Turi')}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-center">{t('grades.score')}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-center">{t('grades.letter_grade')}</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">{t('attendance.date')}</th>
                  {(canEdit || canDelete) && <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-right">{t('attendance.actions')}</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <AnimatePresence mode="popLayout">
                  {list.length === 0 ? (
                    <tr className="h-64">
                      <td colSpan={8} className="text-center font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] opacity-40">
                         {t('grades.no_records')}
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
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-[1rem] bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] font-black text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                            {g.student_name.charAt(0)}
                          </div>
                          <span className="font-black text-[var(--color-text-primary)] tracking-tight text-lg leading-none">{g.student_name}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-600/10 px-4 py-1.5 rounded-lg border border-indigo-600/10 uppercase tracking-widest">
                          {g.subject_name}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)] opacity-60">
                          {t(`grades.types.${g.grade_type}`)}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--color-bg-primary)] font-black text-xl text-[var(--color-text-primary)] border border-[var(--color-border)] shadow-inner group-hover:border-indigo-600/30 transition-all">
                          {g.score}
                        </div>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span 
                          className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border"
                          style={{ color: letterGradeColor(g.letter_grade), backgroundColor: `${letterGradeColor(g.letter_grade)}10`, borderColor: `${letterGradeColor(g.letter_grade)}20` }}
                        >
                          {g.letter_grade}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-3 text-[var(--color-text-secondary)] text-sm font-bold opacity-60">
                           <Calendar size={16} className="text-indigo-600" />
                           {formatDate(g.date)}
                        </div>
                      </td>
                      {(canEdit || canDelete) && (
                        <td className="px-10 py-6 text-right">
                        <div className="flex justify-end gap-3">
                          {canEdit && (
                            <button 
                              onClick={() => navigate(`/grades/${g.id}/edit`)}
                              className="w-11 h-11 rounded-xl bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] opacity-20 hover:opacity-100 hover:text-indigo-600 hover:bg-indigo-600/10 transition-all flex items-center justify-center shadow-inner"
                              title="Edit"
                            >
                              <Edit3 size={18} />
                            </button>
                          )}
                          {canDelete && (
                            <button 
                              onClick={() => handleDelete(g.id)}
                              className="w-11 h-11 rounded-xl bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] opacity-20 hover:opacity-100 hover:text-rose-600 hover:bg-rose-600/10 transition-all flex items-center justify-center shadow-inner"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-10 py-8 bg-[var(--color-bg-primary)]/30 border-t border-[var(--color-border)] flex items-center justify-between">
              <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] opacity-40">
                {t('common.page')} <span className="text-[var(--color-text-primary)] opacity-100">{page}</span> {t('common.of')} <span className="text-[var(--color-text-primary)] opacity-100">{totalPages}</span>
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