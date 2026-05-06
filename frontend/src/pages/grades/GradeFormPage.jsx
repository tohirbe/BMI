import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { grades, subjects, studentProfiles } from "../../api";
import { gradeTypeLabel } from "../../utils/helpers";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import CustomDatePicker from "../../components/ui/CustomDatePicker";
import { Save, X, BookOpen, User, ClipboardList, PenTool, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const GRADE_TYPES = [
  { value: "joriy_1", max: 15, label: "Joriy 1" },
  { value: "joriy_2", max: 15, label: "Joriy 2" },
  { value: "oraliq",  max: 30, label: "Oraliq" },
  { value: "yakuniy", max: 40, label: "Yakuniy" },
];

export default function GradeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    student: "", subject: "", grade_type: "joriy_1", score: "", date: new Date(), note: "",
  });
  const [subList, setSubList] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    subjects.list().then((r) => setSubList(r.data.data ?? [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.subject) { setStudents([]); return; }
    const sub = subList.find((s) => s.id === Number(form.subject));
    if (!sub?.group) return;
    studentProfiles.list({ group: sub.group })
      .then((r) => setStudents(r.data.data ?? []))
      .catch(() => {});
  }, [form.subject, subList]);

  useEffect(() => {
    if (!isEdit) return;
    grades.get(id)
      .then((r) => {
        const d = r.data.data;
        setForm({
          student: d.student,
          subject: d.subject,
          grade_type: d.grade_type,
          score: d.score,
          date: new Date(d.date),
          note: d.note ?? "",
        });
      })
      .catch(() => toast.error("Ma'lumot yuklanmadi"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const maxScore = GRADE_TYPES.find((t) => t.value === form.grade_type)?.max ?? 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(form.score) > maxScore) {
      toast.error(`Ball ${maxScore} dan oshmasligi kerak`);
      return;
    }
    setSubmitting(true);
    const dateStr = form.date.toISOString().slice(0, 10);
    const payload = { ...form, date: dateStr };

    try {
      if (isEdit) {
        await grades.update(id, payload);
        toast.success("Yangilandi");
      } else {
        await grades.create(payload);
        toast.success("Baho saqlandi");
      }
      navigate("/grades");
    } catch (err) {
      const detail = err.response?.data?.details;
      const msg = detail?.score?.[0] ?? detail?.non_field_errors?.[0] ?? err.response?.data?.error ?? "Xato";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  const subjectOptions = subList.map(s => ({ label: `${s.name} — ${s.group_name}`, value: s.id }));
  const studentOptions = students.map(sp => ({ label: `${sp.full_name} (${sp.student_id})`, value: sp.user }));
  const gradeTypeOptions = GRADE_TYPES.map(t => ({ label: `${t.label} (max ${t.max})`, value: t.value }));

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <PageHeader 
        title={isEdit ? "Update Grade" : "Enter New Grade"} 
        subtitle="Provide academic score for a student record"
        actions={
          <Button variant="ghost" icon={<X size={18} />} onClick={() => navigate("/grades")}>
            Cancel
          </Button>
        }
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Select
              label="Subject"
              placeholder="Choose a subject"
              options={subjectOptions}
              value={form.subject}
              onChange={(val) => setForm({ ...form, subject: val, student: "" })}
              icon={<BookOpen size={18} />}
            />

            <Select
              label="Student"
              placeholder="Select student"
              options={studentOptions}
              value={form.student}
              onChange={(val) => setForm({ ...form, student: val })}
              icon={<User size={18} />}
              disabled={!form.subject}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Select
              label="Grade Type"
              options={gradeTypeOptions}
              value={form.grade_type}
              onChange={(val) => setForm({ ...form, grade_type: val, score: "" })}
              icon={<ClipboardList size={18} />}
            />

            <Input
              label={`Score (0 – ${maxScore})`}
              type="number"
              min={0}
              max={maxScore}
              step="0.5"
              placeholder={`Max ${maxScore}`}
              value={form.score}
              onChange={(e) => setForm({ ...form, score: e.target.value })}
              icon={<PenTool size={18} />}
              required
            />

            <CustomDatePicker
              label="Assessment Date"
              selected={form.date}
              onChange={(d) => setForm({ ...form, date: d })}
              icon={<Calendar size={18} />}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Optional Note</label>
            <textarea
              className="w-full bg-slate-50 border-slate-200 text-slate-900 text-sm rounded-2xl p-4 transition-all focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 min-h-[120px] outline-none"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Add any context or comments here..."
            />
          </div>

          <div className="pt-6 flex justify-end gap-4 border-t border-slate-50">
            <Button 
              type="submit" 
              size="lg" 
              className="min-w-[200px]"
              loading={submitting}
              icon={<Save size={20} />}
            >
              {isEdit ? "Update Grade Record" : "Save Grade Record"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}