import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { groups, departments } from "../../api";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { Users, FilterX, Building2, Calendar, Layers, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GroupsPage() {
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
      .then((r) => setList(r.data.data ?? []))
      .catch(() => toast.error("Guruhlar yuklanmadi"))
      .finally(() => setLoading(false));
  }, [deptFilter]);

  useEffect(() => { load(); }, [load]);

  const deptOptions = deptList.map(d => ({ label: d.name, value: d.id }));

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Academic Groups" 
        subtitle="Manage and organize student cohorts and departments"
      />

      {/* Filters */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-wrap items-end gap-6">
        <div className="flex-1 min-w-[280px]">
          <Select
            label="Filter by Department"
            placeholder="All Departments"
            options={deptOptions}
            value={deptFilter}
            onChange={(val) => setDeptFilter(val)}
            icon={<Building2 size={18} />}
          />
        </div>
        <Button 
          variant="ghost" 
          className="h-12 px-6 font-bold text-rose-500 hover:bg-rose-50 rounded-xl"
          onClick={() => setDeptFilter("")}
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
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Group Name</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Department</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Academic Year</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Course / Semester</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Students</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {list.length === 0 ? (
                    <tr className="h-64">
                      <td colSpan={6} className="text-center text-slate-300">
                         <Layers size={48} className="mx-auto opacity-20 mb-2" />
                         <p className="font-bold">No groups found</p>
                      </td>
                    </tr>
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
                          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold text-xs shadow-sm">
                            {g.name.slice(0, 2)}
                          </div>
                          <span className="font-bold text-slate-800 tracking-tight">{g.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="opacity-40" />
                          {g.department_name}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-[11px] font-black text-slate-500 uppercase tracking-tighter">
                          <Calendar size={12} className="opacity-50" />
                          {g.academic_year_name}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">
                            {g.course}-kurs
                          </span>
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                            {g.semester}-sem
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-100">
                          <Users size={14} />
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