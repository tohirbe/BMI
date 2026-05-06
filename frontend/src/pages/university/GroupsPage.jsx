import { useState, useEffect, useCallback } from "react";
import toast          from "react-hot-toast";
import { groups, departments } from "../../api";
import Spinner        from "../../components/ui/Spinner";
import PageHeader     from "../../components/ui/PageHeader";

export default function GroupsPage() {
  const [list,       setList]       = useState([]);
  const [deptList,   setDeptList]   = useState([]);
  const [deptFilter, setDeptFilter] = useState("");
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    departments.list().then((r) => setDeptList(r.data.data ?? [])).catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (deptFilter) params.department = deptFilter;
    groups.list(params)
      .then((r) => setList(r.data.data ?? []))
      .catch(() => toast.error("Guruhlar yuklanmadi"))
      .finally(() => setLoading(false));
  }, [deptFilter]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <PageHeader title="Guruhlar" subtitle="Barcha guruhlar ro'yxati" />

      <div style={s.filters}>
        <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); }} style={s.select}>
          <option value="">Barcha kafedralar</option>
          {deptList.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <button onClick={() => setDeptFilter("")} style={s.clearBtn}>Tozalash</button>
      </div>

      {loading ? <Spinner /> : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Guruh nomi</th>
                <th style={s.th}>Kafedra</th>
                <th style={s.th}>O'quv yili</th>
                <th style={s.th}>Kurs</th>
                <th style={s.th}>Semestr</th>
                <th style={s.th}>Talabalar soni</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr><td colSpan={6} style={s.empty}>Ma'lumot topilmadi</td></tr>
              ) : list.map((g) => (
                <tr key={g.id} style={s.tr}>
                  <td style={s.td}><strong>{g.name}</strong></td>
                  <td style={s.td}>{g.department_name}</td>
                  <td style={s.td}>{g.academic_year_name}</td>
                  <td style={s.td}>{g.course}-kurs</td>
                  <td style={s.td}>{g.semester}-semestr</td>
                  <td style={s.td}>
                    <span style={s.badge}>{g.student_count} ta</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const s = {
  filters:   { display: "flex", gap: 10, marginBottom: 20 },
  select:    { padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13 },
  clearBtn:  { padding: "8px 16px", background: "#94a3b8", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13 },
  tableWrap: { background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", overflow: "auto" },
  table:     { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th:        { padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" },
  tr:        { borderBottom: "1px solid #f1f5f9" },
  td:        { padding: "11px 16px", color: "#374151" },
  empty:     { padding: 32, textAlign: "center", color: "#94a3b8" },
  badge:     { padding: "2px 10px", borderRadius: 99, background: "#dbeafe", color: "#2563eb", fontSize: 12, fontWeight: 600 },
};