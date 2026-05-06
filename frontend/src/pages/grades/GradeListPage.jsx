import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { grades, subjects, groups } from "../../api";
import { gradeTypeLabel, letterGradeColor, formatDate } from "../../utils/helpers";
import { usePermissions } from "../../hooks/usePermissions";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { Plus, FileUp, FilterX, Edit3, Trash2, GraduationCap, BookOpen, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GRADE_TYPES = [
  { label: "Joriy 1", value: "joriy_1" },
  { label: "Joriy 2", value: "joriy_2" },
  { label: "Oraliq", value: "oraliq" },
  { label: "Yakuniy", value: "yakuniy" },
];

export default function GradeListPage() {
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

  useEffect(() => {
    subjects.list().then((r) => setSubList(r.data.data ?? [])).catch(() => {});
    groups.list().then((r) => setGroupList(r.data.data ?? [])).catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
    grades.list(params)
      .then((r) => {
        setList(r.data.results ?? []);
        setTotalPages(Math.ceil((r.data.count ?? 0) / 20));
      })
      .catch(() => toast.error("Baholar yuklanmadi"))
      .finally(() => setLoading(false));
  }, [filters, page]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
    try {
      await grades.delete(id);
      toast.success("O'chirildi");
      load();
    } catch {
      toast.error("O'chirishda xato");
    }
  };

  const subjectOptions = subList.map(s => ({ label: s.name, value: s.id }));
  const groupOptions = groupList.map(g => ({ label: g.name, value: g.id }));

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Students Grades"
        subtitle="Manage and monitor academic performance records"
        actions={
          canAdd && (
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                icon={<FileUp size={18} />} 
                onClick={() => navigate("/grades/bulk")}
              >
                CSV Import
              </Button>
              <Button 
                icon={<Plus size={18} />} 
                onClick={() => navigate("/grades/new")}
              >
                Enter Grade
              </Button>
            </div>
          )
        }
      />

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-wrap items-end gap-6">
        <div className="flex-1 min-w-[200px]">
          <Select
            label="Group"
            placeholder="All Groups"
            options={groupOptions}
            value={filters.group}
            onChange={(val) => setFilters({ ...filters, group: val })}
            icon={<Layers size={18} />}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <Select
            label="Subject"
            placeholder="All Subjects"
            options={subjectOptions}
            value={filters.subject}
            onChange={(val) => setFilters({ ...filters, subject: val })}
            icon={<BookOpen size={18} />}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <Select
            label="Grade Type"
            placeholder="All Types"
            options={GRADE_TYPES}
            value={filters.grade_type}
            onChange={(val) => setFilters({ ...filters, grade_type: val })}
          />
        </div>
        
        <Button 
          variant="ghost" 
          className="h-12 px-6 font-bold text-rose-500 hover:bg-rose-50 rounded-xl"
          onClick={() => { setFilters({ subject: "", grade_type: "", group: "" }); setPage(1); }}
          icon={<FilterX size={18} />}
        >
          Reset
        </Button>
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
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Subject</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Type</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Score</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Grade</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  {(canEdit || canDelete) && <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {list.length === 0 ? (
                    <motion.tr 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="h-64"
                    >
                      <td colSpan={8} className="text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-300">
                          <BookOpen size={48} className="opacity-20 mb-2" />
                          <p className="font-bold">No academic records found</p>
                          <p className="text-sm">Try adjusting your filters</p>
                        </div>
                      </td>
                    </motion.tr>
                  ) : list.map((g, idx) => (
                    <motion.tr 
                      key={g.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold text-xs">
                            {g.student_name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-800">{g.student_name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                          {g.subject_name}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="text-xs font-bold uppercase tracking-tighter text-slate-400">
                          {gradeTypeLabel(g.grade_type)}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 font-black text-slate-800">
                          {g.score}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span 
                          className="text-sm font-black px-4 py-2 rounded-xl"
                          style={{ color: letterGradeColor(g.letter_grade), backgroundColor: `${letterGradeColor(g.letter_grade)}10` }}
                        >
                          {g.letter_grade}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-500 font-medium">{formatDate(g.date)}</td>
                      {(canEdit || canDelete) && (
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {canEdit && (
                              <button 
                                onClick={() => navigate(`/grades/${g.id}/edit`)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                title="Edit"
                              >
                                <Edit3 size={18} />
                              </button>
                            )}
                            {canDelete && (
                              <button 
                                onClick={() => handleDelete(g.id)}
                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
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
            <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Page <span className="text-slate-900 font-bold">{page}</span> of <span className="text-slate-900 font-bold">{totalPages}</span>
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  disabled={page === 1} 
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  disabled={page === totalPages} 
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}