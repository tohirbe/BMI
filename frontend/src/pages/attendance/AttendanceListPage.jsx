import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { attendance, subjects, groups } from "../../api";
import { statusLabel, statusColor, formatDate } from "../../utils/helpers";
import { usePermissions } from "../../hooks/usePermissions";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import CustomDatePicker from "../../components/ui/CustomDatePicker";
import { Calendar, FileCheck, FileUp, FilterX, Edit3, User, BookOpen, Layers, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUSES = [
  { label: "Present", value: "present" },
  { label: "Absent", value: "absent" },
  { label: "Excused", value: "excused" },
  { label: "Late", value: "late" },
];

export default function AttendanceListPage() {
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
        setList(r.data.results ?? []);
        setTotalPages(Math.ceil((r.data.count ?? 0) / 20));
      })
      .catch(() => toast.error("Davomat yuklanmadi"))
      .finally(() => setLoading(false));
  }, [filters, page]);

  useEffect(() => { load(); }, [load]);

  const subjectOptions = subList.map(s => ({ label: s.name, value: s.id }));
  const groupOptions = groupList.map(g => ({ label: g.name, value: g.id }));

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <PageHeader
        title="Attendance Records"
        subtitle="Monitor and manage student presence across all subjects"
        actions={
          canAdd && (
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                icon={<FileUp size={18} />} 
                onClick={() => navigate("/attendance/bulk")}
              >
                CSV Import
              </Button>
              <Button 
                icon={<FileCheck size={18} />} 
                onClick={() => navigate("/attendance/daily")}
              >
                Daily Check-in
              </Button>
            </div>
          )
        }
      />

      {/* Filters */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <Select
          label="Group"
          placeholder="All Groups"
          options={groupOptions}
          value={filters.group}
          onChange={(val) => setFilters({ ...filters, group: val })}
          icon={<Layers size={18} />}
        />
        <Select
          label="Subject"
          placeholder="All Subjects"
          options={subjectOptions}
          value={filters.subject}
          onChange={(val) => setFilters({ ...filters, subject: val })}
          icon={<BookOpen size={18} />}
        />
        <Select
          label="Status"
          placeholder="All Status"
          options={STATUSES}
          value={filters.status}
          onChange={(val) => setFilters({ ...filters, status: val })}
          icon={<Activity size={18} />}
        />
        <CustomDatePicker
          label="Date"
          selected={filters.date}
          onChange={(d) => setFilters({ ...filters, date: d })}
        />
        <Button 
          variant="ghost" 
          className="h-12 font-bold text-rose-500 hover:bg-rose-50 rounded-xl"
          onClick={() => { setFilters({ subject: "", status: "", date: null, group: "" }); setPage(1); }}
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
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Recorded By</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {list.length === 0 ? (
                    <tr className="h-64"><td colSpan={7} className="text-center font-bold text-slate-300">No records found</td></tr>
                  ) : list.map((a, idx) => (
                    <motion.tr 
                      key={a.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-indigo-500 group-hover:text-white transition-all">
                            {a.student_name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-800 tracking-tight">{a.student_name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                          {a.subject_name}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                          <Calendar size={14} className="opacity-40" />
                          {formatDate(a.date)}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span 
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                          style={{ color: statusColor(a.status), backgroundColor: `${statusColor(a.status)}15` }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor(a.status) }} />
                          {statusLabel(a.status)}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                          <User size={12} className="opacity-50" />
                          {a.entered_by_name ?? "System"}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {canEdit && (
                          <button 
                            onClick={() => navigate(`/attendance/daily?id=${a.id}`)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Edit3 size={18} />
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
            <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Page <span className="text-slate-900 font-bold">{page}</span> of <span className="text-slate-900 font-bold">{totalPages}</span>
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}