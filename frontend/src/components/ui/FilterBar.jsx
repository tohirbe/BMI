import { useState, useEffect } from "react";
import { academicYears }        from "../../api";

export default function FilterBar({ onChange }) {
  const [years,        setYears]        = useState([]);
  const [academicYear, setAcademicYear] = useState("");
  const [semester,     setSemester]     = useState("");

  useEffect(() => {
    academicYears.list().then((r) => setYears(r.data.data ?? [])).catch(() => {});
  }, []);

  const apply = (ay, sem) => onChange({ academic_year: ay || undefined, semester: sem || undefined });

  return (
    <div style={s.bar}>
      <select
        value={academicYear}
        onChange={(e) => { setAcademicYear(e.target.value); apply(e.target.value, semester); }}
        style={s.select}
      >
        <option value="">Barcha o'quv yillari</option>
        {years.map((y) => <option key={y.id} value={y.name}>{y.name}</option>)}
      </select>

      <select
        value={semester}
        onChange={(e) => { setSemester(e.target.value); apply(academicYear, e.target.value); }}
        style={s.select}
      >
        <option value="">Barcha semestrlar</option>
        {[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n}-semestr</option>)}
      </select>
    </div>
  );
}

const s = {
  bar:    { display: "flex", gap: 12, marginBottom: 20 },
  select: { padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, cursor: "pointer" },
};