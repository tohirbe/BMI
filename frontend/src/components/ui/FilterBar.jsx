import { useState, useEffect } from "react";
import { academicYears } from "../../api";
import { Filter, Calendar, Layers, XCircle } from "lucide-react";

export default function FilterBar({ onChange }) {
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
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2 text-slate-400 mr-2">
        <Filter size={18} />
        <span className="text-sm font-bold uppercase tracking-wider">Filters</span>
      </div>

      {/* Academic Year Select */}
      <div className="relative flex-1 min-w-[200px]">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        <select
          value={academicYear}
          onChange={(e) => { setAcademicYear(e.target.value); apply(e.target.value, semester); }}
          className="w-full bg-slate-50 border-slate-200 hover:border-indigo-300 pl-10 h-11 text-sm font-medium rounded-xl transition-all cursor-pointer appearance-none"
        >
          <option value="">All Academic Years</option>
          {years.map((y) => <option key={y.id} value={y.name}>{y.name}</option>)}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l pl-2 border-slate-200">
          <div className="w-2 h-2 border-r-2 border-b-2 border-slate-400 rotate-45 mb-1" />
        </div>
      </div>

      {/* Semester Select */}
      <div className="relative flex-1 min-w-[200px]">
        <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        <select
          value={semester}
          onChange={(e) => { setSemester(e.target.value); apply(academicYear, e.target.value); }}
          className="w-full bg-slate-50 border-slate-200 hover:border-indigo-300 pl-10 h-11 text-sm font-medium rounded-xl transition-all cursor-pointer appearance-none"
        >
          <option value="">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n}-semester</option>)}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l pl-2 border-slate-200">
          <div className="w-2 h-2 border-r-2 border-b-2 border-slate-400 rotate-45 mb-1" />
        </div>
      </div>

      {(academicYear || semester) && (
        <button 
          onClick={clear}
          className="flex items-center gap-2 px-4 h-11 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
        >
          <XCircle size={16} /> Clear
        </button>
      )}
    </div>
  );
}