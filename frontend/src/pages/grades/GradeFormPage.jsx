import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { grades, subjects, studentProfiles } from "../../api";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import CustomDatePicker from "../../components/ui/CustomDatePicker";
import { Save, X, BookOpen, User, ClipboardList, PenTool, Calendar, AlignLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function GradeFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const GRADE_TYPES = useMemo(() => [
    { value: "joriy_1", max: 15, label: t('grades.types.joriy_1') },
    { value: "joriy_2", max: 15, label: t('grades.types.joriy_2') },
    { value: "oraliq",  max: 30, label: t('grades.types.oraliq') },
    { value: "yakuniy", max: 40, label: t('grades.types.yakuniy') },
  ], [t]);

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
      .catch(() => toast.error(t('common.error')))
      .finally(() => setLoading(false));
  }, [id, isEdit, t]);

  const maxScore = GRADE_TYPES.find((t_) => t_.value === form.grade_type)?.max ?? 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(form.score) > maxScore) {
      toast.error(t('grades.score_limit_error'));
      return;
    }
    setSubmitting(true);
    const dateStr = form.date.toISOString().slice(0, 10);
    const payload = { ...form, date: dateStr };

    try {
      if (isEdit) {
        await grades.update(id, payload);
        toast.success(t('common.success'));
      } else {
        await grades.create(payload);
        toast.success(t('common.success'));
      }
      navigate("/grades");
    } catch (err) {
      const detail = err.response?.data?.details;
      const msg = detail?.score?.[0] ?? detail?.non_field_errors?.[0] ?? err.response?.data?.error ?? t('common.error');
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  const subjectOptions = subList.map(s => ({ label: `${s.name} — ${s.group_name}`, value: s.id }));
  const studentOptions = students.map(sp => ({ label: `${sp.full_name} (${sp.student_id})`, value: sp.user }));
  const gradeTypeOptions = GRADE_TYPES.map(t_ => ({ label: `${t_.label} (max ${t_.max})`, value: t_.value }));

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20 px-6 pt-6">
      <PageHeader 
        title={isEdit ? t('grades.form_title_edit') : t('grades.form_title_new')} 
        subtitle={t('grades.form_subtitle')}
        actions={
          <Button variant="secondary" className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest border-2" icon={<X size={20} />} onClick={() => navigate("/grades")}>
            {t('common.cancel')}
          </Button>
        }
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-10 md:p-12 shadow-md"
      >
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Select
              label={t('attendance.subject')}
              placeholder={t('grades.select_subject')}
              options={subjectOptions}
              value={form.subject}
              onChange={(val) => setForm({ ...form, subject: val, student: "" })}
              icon={<BookOpen size={20} />}
            />

            <Select
              label={t('attendance.student')}
              placeholder={t('grades.select_student')}
              options={studentOptions}
              value={form.student}
              onChange={(val) => setForm({ ...form, student: val })}
              icon={<User size={20} />}
              disabled={!form.subject}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Select
              label={t('grades.grade_type')}
              options={gradeTypeOptions}
              value={form.grade_type}
              onChange={(val) => setForm({ ...form, grade_type: val, score: "" })}
              icon={<ClipboardList size={20} />}
            />

            <Input
              label={`${t('grades.score')} (0 – ${maxScore})`}
              type="number"
              min={0}
              max={maxScore}
              step="0.5"
              placeholder={`Max ${maxScore}`}
              value={form.score}
              onChange={(e) => setForm({ ...form, score: e.target.value })}
              icon={<PenTool size={20} />}
              required
            />

            <CustomDatePicker
              label={t('grades.assessment_date')}
              selected={form.date}
              onChange={(d) => setForm({ ...form, date: d })}
              icon={<Calendar size={20} />}
            />
          </div>

          <div className="relative group">
            <label className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] absolute left-6 -top-3 bg-[var(--color-bg-secondary)] px-3 py-1 rounded-lg border-2 border-indigo-600/10 z-10">
              {t('grades.optional_note')}
            </label>
            <div className="flex items-start gap-5 w-full p-6 bg-[var(--color-bg-primary)] border-2 border-[var(--color-border)] rounded-[2rem] focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-600/5 transition-all shadow-inner group">
              <AlignLeft size={24} className="text-indigo-600 opacity-40 group-focus-within:opacity-100 mt-1" />
              <textarea
                className="w-full bg-transparent outline-none text-[var(--color-text-primary)] font-bold text-lg placeholder:opacity-20 resize-none leading-relaxed min-h-[160px]"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Add any context or comments here..."
              />
            </div>
          </div>

          <div className="pt-10 flex justify-end border-t-2 border-[var(--color-border)]">
            <Button 
              type="submit" 
              className="h-18 px-16 text-lg shadow-2xl shadow-indigo-600/30 font-black rounded-2xl w-full md:w-auto uppercase tracking-widest active:scale-95 transition-all"
              loading={submitting}
              icon={<Save size={24} />}
            >
              {isEdit ? t('grades.update_record') : t('grades.save_record')}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}