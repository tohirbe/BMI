import { useState, useEffect, useCallback } from "react";
import toast          from "react-hot-toast";
import { subjects, departments, groups } from "../../api";
import Spinner        from "../../components/ui/Spinner";
import PageHeader     from "../../components/ui/PageHeader";

export default function SubjectsPage() {
  const [list,       setList]       = useState([]);
  const [deptList,   setDeptList]   = useState([]);
  const [groupList,  setGroupList]  = useState([]);
  const [filters,    setFilters]    = useState({ department: "", group: "" });
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    departments.list().then((r) => setDeptList(r.data.data ?? [])).catch(() => {});
    groups.list().then((r)       => setGroupList(r.data.data ?? [])).catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (filters.department) params.department = filters.department;
    if (filters.group)      params.group      = filters.group;
    subjects.list(params)
      .then((r) => setList(r.data.data ?? []))
      .catch(() => toast.error("Fanlar yuklanmadi"))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <PageHeader title="Fanlar" subtitle="Barcha fanlar ro'yxati" />

      <div style={s.filters}>
        <select value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })} style={s.select}>
          <option value="">Barcha kafedralar</option>
          {deptList.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select value={filters.group} onChange={(e) => setFilters({ ...filters, group: e.target.value })} style={s.select}>
          <option value="">Barcha guruhlar</option>
          {groupList.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <button onClick={() => setFilters({ department: "", group: "" })} style={s.clearBtn}>Tozalash</button>
      </div>

      {loading ? <Spinner /> : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Fan nomi</th>
                <th style={s.th}>Qisqa nomi</th>
                <th style={s.th}>Kafedra</th>
                <th style={s.th}>O'qituvchi</th>
                <th style={s.th}>Guruh</th>
                <th style={s.th}>Kredit soat</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr><td colSpan={6} style={s.empty}>Ma'lumot topilmadi</td></tr>
              ) : list.map((sub) => (
                <tr key={sub.id} style={s.tr}>
                  <td style={s.td}><strong>{sub.name}</strong></td>
                  <td style={s.td}>{sub.short_name || "—"}</td>
                  <td style={s.td}>{sub.department_name}</td>
                  <td style={s.td}>{sub.teacher_name || "—"}</td>
                  <td style={s.td}>{sub.group_name}</td>
                  <td style={s.td}>{sub.credit_hours}</td>
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
  filters:   { display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" },
  select:    { padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13 },
  clearBtn:  { padding: "8px 16px", background: "#94a3b8", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13 },
  tableWrap: { background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", overflow: "auto" },
  table:     { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th:        { padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" },
  tr:        { borderBottom: "1px solid #f1f5f9" },
  td:        { padding: "11px 16px", color: "#374151" },
  empty:     { padding: 32, textAlign: "center", color: "#94a3b8" },
};