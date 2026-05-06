import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { studentProfiles, groups } from "../../api";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { Users, FilterX, Mail, Fingerprint, Calendar, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentsPage() {
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
        setList(r.data.data ?? []);
        setTotalPages(Math.ceil((r.data.count ?? r.data.data?.length ?? 0) / 20));
      })
      .catch(() => toast.error("Talabalar yuklanmadi"))
      .finally(() => setLoading(false));
  }, [page, groupFilter]);

  useEffect(() => { load(); }, [load]);

  const groupOptions = groupList.map(g => ({ label: g.name, value: g.id }));

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Students Directory" 
        subtitle="Manage and view all enrolled students"
      />

      {/* Filters */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-wrap items-end gap-6">
        <div className="flex-1 min-w-[240px]">
          <Select
            label="Filter by Group"
            placeholder="All Groups"
            options={groupOptions}
            value={groupFilter}
            onChange={(val) => { setGroupFilter(val); setPage(1); }}
            icon={<Users size={18} />}
          />
        </div>
        <Button 
          variant="ghost" 
          className="h-12 px-6 font-bold text-rose-500 hover:bg-rose-50 rounded-xl"
          onClick={() => { setGroupFilter(""); setPage(1); }}
          icon={<FilterX size={18} />}
        >
          Reset Filters
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
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Contact Info</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Student ID</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Group</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Birthday</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {list.length === 0 ? (
                    <tr className="h-64">
                      <td colSpan={5} className="text-center text-slate-300">
                         <GraduationCap size={48} className="mx-auto opacity-20 mb-2" />
                         <p className="font-bold">No students found</p>
                      </td>
                    </tr>
                  ) : list.map((s_, idx) => (
                    <motion.tr 
                      key={s_.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold text-xs shadow-sm group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                            {s_.full_name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-800 tracking-tight">{s_.full_name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Mail size={14} className="opacity-40" />
                          <span className="text-sm font-medium">{s_.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-[11px] font-black text-slate-500 uppercase tracking-tighter">
                          <Fingerprint size={12} className="opacity-50" />
                          {s_.student_id || "N/A"}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">
                          {s_.group_name || "—"}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar size={14} className="opacity-40" />
                          <span className="text-xs font-bold uppercase tracking-tight">{s_.date_of_birth || "—"}</span>
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