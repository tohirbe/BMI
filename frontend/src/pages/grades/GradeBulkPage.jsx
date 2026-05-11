import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import toast                   from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { grades, subjects }    from "../../api";
import PageHeader              from "../../components/ui/PageHeader";
import Spinner                 from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { FileUp, Save, X, Info, AlertCircle, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GradeBulkPage() {
  const { t } = useTranslation();
  const navigate             = useNavigate();
  const [subList,  setSubList]  = useState([]);
  const [subId,    setSubId]    = useState("");
  const [file,     setFile]     = useState(null);
  const [preview,  setPreview]  = useState(null);
  const [errors,   setErrors]   = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [step,     setStep]     = useState(1);

  useEffect(() => {
    subjects.list().then((r) => setSubList(r.data.data ?? [])).catch(() => {});
  }, []);

  const handlePreview = async (e) => {
    if (e) e.preventDefault();
    if (!file || !subId) { toast.error(t('attendance.select_subject')); return; }

    setLoading(true);
    const form = new FormData();
    form.append("file",       file);
    form.append("subject_id", subId);
    form.append("confirm",    "false");

    try {
      const res = await grades.bulkUpload(form);
      setPreview(res.data.data.preview);
      setErrors([]);
      setStep(2);
    } catch (err) {
      setErrors(err.response?.data?.errors ?? []);
      setPreview(null);
      if (!err.response?.data?.errors?.length) toast.error(err.response?.data?.error ?? t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    const form = new FormData();
    form.append("file",       file);
    form.append("subject_id", subId);
    form.append("confirm",    "true");

    try {
      const res = await grades.bulkUpload(form);
      toast.success(res.data.message || t('common.success'));
      navigate("/grades");
    } catch (err) {
      toast.error(err.response?.data?.error ?? t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const subjectOptions = subList.map(s => ({ label: `${s.name} — ${s.group_name}`, value: s.id }));

  return (
    <div className="space-y-10 animate-fade-in pb-12 max-w-5xl mx-auto">
      <PageHeader 
        title={t('grades.bulk_title')} 
        subtitle="CSV yoki Excel fayllari orqali baholarni ommaviy yuklash"
        actions={
          <Button variant="secondary" className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest border-2" icon={<X size={20}/>} onClick={() => navigate("/grades")}>
            {t('common.cancel')}
          </Button>
        }
      />

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 mb-10">
         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg transition-all ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'}`}>1</div>
         <div className="w-16 h-1 bg-[var(--color-border)] rounded-full" />
         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg transition-all ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'}`}>2</div>
      </div>

      {/* Format Info */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-indigo-600 p-8 rounded-[2.5rem] text-white flex items-center gap-8 shadow-2xl shadow-indigo-600/10"
      >
        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20">
           <Info size={28} />
        </div>
        <div className="space-y-2">
           <p className="font-black text-lg tracking-tight">{t('attendance.file_format')}: <code className="bg-white/10 px-3 py-1 rounded-lg ml-2 border border-white/10">{t('grades.file_format_note')}</code></p>
           <p className="text-indigo-100/60 text-[10px] font-black uppercase tracking-widest leading-none">grade_type: joriy_1 | joriy_2 | oraliq | yakuniy</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-10">
        
        {/* Step 1: Upload */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="card-premium p-10 space-y-10 shadow-md"
            >
              <h3 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">1. {t('attendance.select_subject')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <Select
                   label={t('attendance.subject_group')}
                   placeholder={t('attendance.select_subject')}
                   options={subjectOptions}
                   value={subId}
                   onChange={(val) => { setSubId(val); setPreview(null); setErrors([]); }}
                   icon={<BookOpen size={20} />}
                 />
                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] opacity-40 ml-1">{t('attendance.select_file')}</p>
                    <div className="relative group">
                       <input 
                         type="file" 
                         required 
                         accept=".csv,.xlsx,.xls"
                         onChange={(e) => { setFile(e.target.files[0]); setPreview(null); setErrors([]); }}
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                       />
                       <div className="h-16 px-6 rounded-2xl border-2 border-dashed border-[var(--color-border)] flex items-center justify-between group-hover:border-indigo-600 transition-all bg-[var(--color-bg-primary)]/40">
                          <span className="text-sm font-black text-[var(--color-text-secondary)] opacity-60">
                             {file ? file.name : t('attendance.select_file')}
                          </span>
                          <FileUp size={24} className="text-indigo-600" />
                       </div>
                    </div>
                 </div>
              </div>
              <div className="pt-6 border-t border-[var(--color-border)] flex justify-end">
                 <Button 
                   onClick={handlePreview} 
                   loading={loading} 
                   variant="primary" 
                   className="h-16 px-12 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
                   icon={<ChevronRight size={22} />}
                   iconPosition="right"
                 >
                   {loading ? t('attendance.verifying') : t('attendance.verify')}
                 </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Preview */}
          {step === 2 && preview && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card-premium p-10 space-y-10 shadow-md"
            >
              <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">2. {t('attendance.preview_title')} — {preview.length} {t('common.records')}</h3>
                 <div className="px-4 py-2 bg-emerald-600/10 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-600/10">
                    {t('common.ready')}
                 </div>
              </div>

              <div className="overflow-x-auto rounded-[2rem] border border-[var(--color-border)] max-h-[450px] custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--color-bg-primary)]/50 border-b border-[var(--color-border)]">
                      <th className="px-8 py-5 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest">Student ID</th>
                      <th className="px-8 py-5 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest">{t('common.type')}</th>
                      <th className="px-8 py-5 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest text-center">{t('grades.score')}</th>
                      <th className="px-8 py-5 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest">{t('attendance.date')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                    {preview.map((row, i) => (
                      <tr key={i} className="hover:bg-[var(--color-bg-primary)]/40 transition-colors">
                        <td className="px-8 py-5 text-sm font-black text-[var(--color-text-primary)]">{row.student_id}</td>
                        <td className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] opacity-60">
                           {t(`grades.types.${row.grade_type}`)}
                        </td>
                        <td className="px-8 py-5 text-center">
                           <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center font-black text-[var(--color-text-primary)]">
                              {row.score}
                           </div>
                        </td>
                        <td className="px-8 py-5 text-sm font-bold text-[var(--color-text-secondary)] opacity-60">{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-10 border-t border-[var(--color-border)] flex justify-between gap-6">
                 <Button variant="secondary" className="h-16 px-10 rounded-2xl font-black text-xs uppercase tracking-widest border-2" icon={<ChevronLeft size={22}/>} onClick={() => setStep(1)}>
                    {t('common.back')}
                 </Button>
                 <Button 
                   onClick={handleConfirm} 
                   disabled={loading} 
                   variant="primary" 
                   className="h-16 flex-1 max-w-md rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20 bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all"
                   icon={<Save size={24} />}
                 >
                   {loading ? t('common.saving') : t('grades.save_all')}
                 </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Errors Display */}
        {errors.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-rose-600/5 border-2 border-rose-600/20 rounded-[3rem] p-10 space-y-10"
          >
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-rose-600/10 rounded-2xl flex items-center justify-center text-rose-600 shadow-inner">
                  <AlertCircle size={28} />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-rose-600 tracking-tight">{t('attendance.errors_found')} ({errors.length} ta)</h3>
                  <p className="text-rose-600/60 text-[10px] font-black uppercase tracking-widest mt-1">Iltimos, faylni to'g'rilab qaytadan yuklang</p>
               </div>
            </div>
            <div className="overflow-x-auto rounded-3xl border border-rose-600/10 bg-[var(--color-bg-secondary)]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-rose-600/5 border-b border-rose-600/10">
                    <th className="px-8 py-5 text-[10px] font-black text-rose-600 uppercase tracking-widest">{t('attendance.row')}</th>
                    <th className="px-8 py-5 text-[10px] font-black text-rose-600 uppercase tracking-widest">{t('attendance.field')}</th>
                    <th className="px-8 py-5 text-[10px] font-black text-rose-600 uppercase tracking-widest">{t('common.error')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-600/10">
                  {errors.map((e, i) => (
                    <tr key={i} className="hover:bg-rose-600/[0.02] transition-colors">
                      <td className="px-8 py-5 text-sm font-black text-rose-600/60">{e.row}</td>
                      <td className="px-8 py-5 font-black text-xs uppercase tracking-widest text-[var(--color-text-secondary)] opacity-60">{e.field}</td>
                      <td className="px-8 py-5 text-sm font-bold text-rose-600">{e.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
