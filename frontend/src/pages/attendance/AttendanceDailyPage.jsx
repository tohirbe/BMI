import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { attendance, subjects, studentProfiles } from "../../api";
import { statusLabel, statusColor } from "../../utils/helpers";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import CustomDatePicker from "../../components/ui/CustomDatePicker";
import { Save, X, UserCheck, Users, Calendar, BookOpen, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUSES = ["present", "absent", "excused", "late"];

export default function AttendanceDailyPage() {
  const navigate = useNavigate();
  const [subList, setSubList] = useState([]);
  const [subId, setSubId] = useState("");
  const [date, setDate] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [grid, setGrid] = useState({});
  const [existing, setExisting] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    subjects.list().then((r) => setSubList(r.data.data ?? [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!subId) return;
    const sub = subList.find((s) => s.id === Number(subId));
    if (!sub?.group) return;

    setLoading(true);
    const dateStr = date.toISOString().slice(0, 10);
    Promise.all([
      studentProfiles.list({ group: sub.group }),
      attendance.list({ subject: subId, date: dateStr }),
    ])
      .then(([spRes, attRes]) => {
        const spList = spRes.data.data ?? [];
        const attList = attRes.data.results ?? [];
        setStudents(spList);
        const gridInit = {};
        const existInit = {};
        spList.forEach((sp) => { gridInit[sp.user] = "present"; });
        attList.forEach((a) => {
          gridInit[a.student] = a.status;
          existInit[a.student] = a.id;
        });
        setGrid(gridInit);
        setExisting(existInit);
      })
      .catch(() => toast.error("Ma'lumot yuklanmadi"))
      .finally(() => setLoading(false));
  }, [subId, date, subList]);

  const setStatus = (userId, status) => setGrid((g) => ({ ...g, [userId]: status }));

  const handleSave = async () => {
    if (!subId) { toast.error("Fan tanlang"); return; }
    if (students.length === 0) { toast.error("Talabalar topilmadi"); return; }

    setSaving(true);
    const entries = Object.entries(grid);
    const dateStr = date.toISOString().slice(0, 10);
    let saved = 0, errors = 0;

    for (const [userId, status] of entries) {
      try {
        if (existing[userId]) {
          await attendance.update(existing[userId], { status });
        } else {
          await attendance.create({ student: userId, subject: subId, date: dateStr, status });
        }
        saved++;
      } catch {
        errors++;
      }
    }
    setSaving(false);

    if (errors === 0) {
      toast.success(`${saved} ta davomat saqlandi`);
      navigate("/attendance");
    } else {
      toast.error(`${errors} ta yozuvda xato yuz berdi`);
    }
  };

  const subjectOptions = subList.map(s => ({ 
    label: `${s.name} — ${s.group_name}`, 
    value: s.id 
  }));

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <PageHeader 
        title="Daily Attendance" 
        subtitle="Record and track student attendance for today"
        actions={
          <Button variant="secondary" icon={<X size={18} />} onClick={() => navigate("/attendance")}>
            Cancel
          </Button>
        }
      />

      {/* Filter Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Select
          label="Subject & Group"
          placeholder="Choose a subject"
          options={subjectOptions}
          value={subId}
          onChange={(val) => setSubId(val)}
          icon={<BookOpen size={18} />}
        />
        <CustomDatePicker
          label="Attendance Date"
          selected={date}
          onChange={(d) => setDate(d)}
          icon={<Calendar size={18} />}
        />
      </div>

      {loading ? <Spinner /> : subId && students.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Quick Actions Card */}
          <div className="bg-indigo-600 p-6 rounded-[2rem] text-white flex flex-wrap items-center justify-between gap-6 shadow-xl shadow-indigo-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Quick Attendance</h3>
                <p className="text-white/70 text-xs">Set status for all {students.length} students</p>
              </div>
            </div>
            <div className="flex gap-2">
              {STATUSES.map((st) => (
                <button
                  key={st}
                  onClick={() => setGrid(Object.fromEntries(students.map((sp) => [sp.user, st])))}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-white/10"
                >
                  {statusLabel(st)}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest w-16">#</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Student Name</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Student ID</th>
                  {STATUSES.map((st) => (
                    <th key={st} className="px-4 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">
                      {statusLabel(st)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map((sp, i) => (
                  <tr key={sp.user} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 text-sm font-bold text-slate-300">{i + 1}</td>
                    <td className="px-8 py-5 font-bold text-slate-800">{sp.full_name}</td>
                    <td className="px-8 py-5 text-sm text-slate-500 font-medium">{sp.student_id}</td>
                    {STATUSES.map((st) => (
                      <td key={st} className="px-4 py-5 text-center">
                        <label className="relative inline-flex items-center cursor-pointer group">
                          <input
                            type="radio"
                            name={`att-${sp.user}`}
                            value={st}
                            checked={grid[sp.user] === st}
                            onChange={() => setStatus(sp.user, st)}
                            className="sr-only"
                          />
                          <div 
                            className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                              grid[sp.user] === st 
                                ? 'scale-110 shadow-lg' 
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                            style={{ 
                              borderColor: grid[sp.user] === st ? statusColor(st) : '',
                              backgroundColor: grid[sp.user] === st ? statusColor(st) : ''
                            }}
                          >
                            {grid[sp.user] === st && <UserCheck size={12} className="text-white" />}
                          </div>
                        </label>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-8 bg-slate-50/50 flex justify-end gap-4 border-t border-slate-100">
               <Button 
                variant="primary" 
                size="lg" 
                className="min-w-[200px]"
                onClick={handleSave} 
                loading={saving}
                icon={<Save size={20} />}
              >
                Save Attendance
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {subId && !loading && students.length === 0 && (
        <div className="flex flex-col items-center py-20 text-slate-300">
           <Users size={64} className="opacity-20 mb-4" />
           <p className="font-bold text-lg">No students found in this group</p>
        </div>
      )}
    </div>
  );
}