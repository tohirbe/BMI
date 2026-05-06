import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { subjects, departments, groups } from "../../api";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { BookOpen, FilterX, Building2, Users, User, Clock, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SubjectsPage() {
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
      .then((r) => setList(r.data.data ?? []))
      .catch(() => toast.error("Fanlar yuklanmadi"))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const deptOptions = deptList.map(d => ({ label: d.name, value: d.id }));
  const groupOptions = groupList.map(g => ({ label: g.name, value: g.id }));

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Curriculum Subjects" 
        subtitle="Manage academic courses, departments, and teaching staff"
      />

      {/* Filters */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-wrap items-end gap-6">
        <div className="flex-1 min-w-[240px]">
          <Select
            label="Department"
            placeholder="All Departments"
            options={deptOptions}
            value={filters.department}
            onChange={(val) => setFilters({ ...filters, department: val })}
            icon={<Building2 size={18} />}
          />
        </div>
        <div className="flex-1 min-w-[240px]">
          <Select
            label="Group"
            placeholder="All Groups"
            options={groupOptions}
            value={filters.group}
            onChange={(val) => setFilters({ ...filters, group: val })}
            icon={<Users size={18} />}
          />
        </div>
        <Button 
          variant="ghost" 
          className="h-12 px-6 font-bold text-rose-500 hover:bg-rose-50 rounded-xl"
          onClick={() => setFilters({ department: "", group: "" })}
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
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Subject</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Department</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Instructor</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Group</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Credits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {list.length === 0 ? (
                    <tr className="h-64">
                      <td colSpan={6} className="text-center text-slate-300">
                         <BookOpen size={48} className="mx-auto opacity-20 mb-2" />
                         <p className="font-bold">No subjects found</p>
                      </td>
                    </tr>
                  ) : list.map((sub, idx) => (
                    <motion.tr 
                      key={sub.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 tracking-tight">{sub.name}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{sub.short_name || "—"}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="opacity-40" />
                          {sub.department_name}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-600">
                          <User size={14} className="text-indigo-400" />
                          <span className="text-sm font-bold">{sub.teacher_name || "Unassigned"}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">
                          {sub.group_name}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg font-black text-xs">
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