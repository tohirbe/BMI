import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { attendance, subjects, studentProfiles } from "../../api";
import { statusColor } from "../../utils/helpers";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import CustomDatePicker from "../../components/ui/CustomDatePicker";
import { Save, X, UserCheck, Users, Calendar, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const STATUSES = ["present", "absent", "excused", "late"];

export default function AttendanceDailyPage() {
  const { t } = useTranslation();
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
      .catch(() => toast.error(t('common.error')))
      .finally(() => setLoading(false));
  }, [subId, date, subList, t]);

  const setStatus = (userId, status) => setGrid((g) => ({ ...g, [userId]: status }));

  const handleSave = async () => {
    if (!subId) { toast.error(t('attendance.select_subject')); return; }
    if (students.length === 0) { toast.error(t('attendance.no_students')); return; }

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
      toast.success(t('common.success'));
      navigate("/attendance");
    } else {
      toast.error(t('common.error'));
    }
  };

  const subjectOptions = subList.map(s => ({ 
    label: `${s.name} — ${s.group_name}`, 
    value: s.id 
  }));

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <PageHeader 
        title={t('attendance.daily_checkin')} 
        subtitle="Talabalar davomatini qayd etish va nazorat qilish"
        actions={
          <Button variant="secondary" className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest border-2" icon={<X size={18} />} onClick={() => navigate("/attendance")}>
            {t('common.cancel')}
          </Button>
        }
      />

      {/* Filter Section */}
      <div className="card-premium p-10 grid grid-cols-1 md:grid-cols-2 gap-10 shadow-sm">
        <Select
          label={t('attendance.subject_group')}
          placeholder={t('attendance.select_subject')}
          options={subjectOptions}
          value={subId}
          onChange={(val) => setSubId(val)}
          icon={<BookOpen size={18} />}
        />
        <div className="space-y-2">
           <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] opacity-40 ml-1">{t('attendance.attendance_date')}</p>
           <CustomDatePicker
             selected={date}
             onChange={(d) => setDate(d)}
           />
        </div>
      </div>

      {loading ? <Spinner /> : subId && students.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          {/* Quick Actions Card */}
          <div className="bg-indigo-600 p-10 rounded-[3rem] text-white flex flex-wrap items-center justify-between gap-10 shadow-2xl shadow-indigo-600/20 relative overflow-hidden group">
            <div className="absolute right-[-20px] top-[-20px] w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl">
                <Users size={32} />
              </div>
              <div>
                <h3 className="font-black text-2xl tracking-tight">{t('attendance.quick_mark')}</h3>
                <p className="text-indigo-100/70 text-[10px] font-black uppercase tracking-widest mt-1">{t('attendance.mark_all_subtitle')}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 relative z-10">
              {STATUSES.map((st) => (
                <button
                  key={st}
                  onClick={() => setGrid(Object.fromEntries(students.map((sp) => [sp.user, st])))}
                  className="px-8 py-4 bg-white/10 hover:bg-white text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/10 rounded-2xl hover:text-indigo-600 active:scale-95 shadow-lg"
                >
                  {t(`attendance.statuses.${st}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="card-premium overflow-hidden shadow-md">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--color-bg-primary)]/40 border-b border-[var(--color-border)]">
                    <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] w-16">#</th>
                    <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">{t('attendance.student_name')}</th>
                    <th className="px-10 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em]">{t('attendance.id')}</th>
                    {STATUSES.map((st) => (
                      <th key={st} className="px-6 py-6 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] text-center">
                        {t(`attendance.statuses.${st}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                  {students.map((sp, i) => (
                    <tr key={sp.user} className="hover:bg-[var(--color-bg-primary)]/40 transition-all group">
                      <td className="px-10 py-6 text-xs font-black text-[var(--color-text-secondary)] opacity-30">{i + 1}</td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] font-black text-xs group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-inner">
                              {sp.full_name.charAt(0)}
                           </div>
                           <span className="font-black text-[var(--color-text-primary)] tracking-tight text-base">{sp.full_name}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="text-[10px] font-black text-[var(--color-text-secondary)] bg-[var(--color-bg-primary)] px-4 py-1.5 rounded-lg border border-[var(--color-border)] opacity-40">
                          {sp.student_id}
                        </span>
                      </td>
                      {STATUSES.map((st) => (
                        <td key={st} className="px-6 py-6 text-center">
                          <label className="relative inline-flex items-center cursor-pointer group/toggle">
                            <input
                              type="radio"
                              name={`att-${sp.user}`}
                              value={st}
                              checked={grid[sp.user] === st}
                              onChange={() => setStatus(sp.user, st)}
                              className="sr-only"
                            />
                            <div 
                              className={`w-8 h-8 rounded-xl border-2 transition-all flex items-center justify-center ${
                                grid[sp.user] === st 
                                  ? 'scale-110 shadow-lg' 
                                  : 'border-[var(--color-border)] hover:border-indigo-600/30'
                              }`}
                              style={{ 
                                borderColor: grid[sp.user] === st ? statusColor(st) : '',
                                backgroundColor: grid[sp.user] === st ? statusColor(st) : ''
                              }}
                            >
                              {grid[sp.user] === st && <UserCheck size={16} className="text-white" />}
                            </div>
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-12 bg-[var(--color-bg-primary)]/20 flex justify-end gap-6 border-t border-[var(--color-border)]">
               <Button 
                variant="primary" 
                className="min-w-[280px] h-16 font-black rounded-2xl shadow-xl shadow-indigo-600/20"
                onClick={handleSave} 
                loading={saving}
                icon={<Save size={24} />}
              >
                {t('attendance.save_button')}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {subId && !loading && students.length === 0 && (
        <div className="card-premium p-32 text-center border-dashed border-2 flex flex-col items-center space-y-8 bg-[var(--color-bg-primary)]/20">
           <div className="w-24 h-24 bg-[var(--color-bg-secondary)] rounded-[2.5rem] flex items-center justify-center text-[var(--color-text-secondary)] opacity-10 shadow-inner">
              <Users size={56} />
           </div>
           <p className="font-black text-xl text-[var(--color-text-primary)] opacity-40 uppercase tracking-[0.2em]">{t('attendance.no_students')}</p>
        </div>
      )}
    </div>
  );
}