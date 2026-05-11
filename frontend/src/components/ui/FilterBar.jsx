import { useState, useEffect } from "react";
import { academicYears } from "../../api";
import { useTranslation } from "react-i18next";
import { Filter, Calendar, Layers, XCircle, ChevronDown } from "lucide-react";

export default function FilterBar({ onChange }) {
  const { t } = useTranslation();
  const [years, setYears] = useState([]);
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");

  useEffect(() => {
    academicYears.list().then((r) => setYears(r.data.data ?? [])).catch(() => {});
  }, []);

  const apply = (ay, sem) => onChange({ academic_year: ay || undefined, semester: sem || undefined });

  const clear = () => {
    setAcademicYear("");
    setSemester("");
    onChange({});
  };

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2.5 text-[var(--color-text-secondary)] opacity-60">
        <Filter size={18} />
        <span className="text-xs font-black uppercase tracking-[0.2em]">{t('filters.title')}</span>
      </div>

      <div className="flex flex-wrap items-center gap-4 flex-1">
        {/* Academic Year Select */}
        <div className="relative flex-1 min-w-[200px] group">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] opacity-40 group-focus-within:text-indigo-600 group-focus-within:opacity-100 transition-all pointer-events-none" size={16} />
          <select
            value={academicYear}
            onChange={(e) => { setAcademicYear(e.target.value); apply(e.target.value, semester); }}
            className="w-full input-premium pl-12 pr-10 h-12 text-sm font-bold cursor-pointer appearance-none bg-[var(--color-bg-primary)]/50 border-[var(--color-border)] hover:border-indigo-600/30"
          >
            <option value="">{t('filters.all_years')}</option>
            {years.map((y) => <option key={y.id} value={y.name}>{y.name}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] opacity-40 pointer-events-none group-focus-within:rotate-180 transition-transform" size={16} />
        </div>

        {/* Semester Select */}
        <div className="relative flex-1 min-w-[200px] group">
          <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] opacity-40 group-focus-within:text-indigo-600 group-focus-within:opacity-100 transition-all pointer-events-none" size={16} />
          <select
            value={semester}
            onChange={(e) => { setSemester(e.target.value); apply(academicYear, e.target.value); }}
            className="w-full input-premium pl-12 pr-10 h-12 text-sm font-bold cursor-pointer appearance-none bg-[var(--color-bg-primary)]/50 border-[var(--color-border)] hover:border-indigo-600/30"
          >
            <option value="">{t('filters.all_semesters')}</option>
            {[1,2,3,4,5,6,7,8].map((n) => (
              <option key={n} value={n}>
                {n}{t('filters.semester_suffix')}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] opacity-40 pointer-events-none group-focus-within:rotate-180 transition-transform" size={16} />
        </div>

        {(academicYear || semester) && (
          <button 
            onClick={clear}
            className="flex items-center gap-2 px-6 h-12 text-sm font-black text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all border border-transparent hover:border-rose-500/20 active:scale-95"
          >
            <XCircle size={18} /> {t('common.cancel')}
          </button>
        )}
      </div>
    </div>
  );
}