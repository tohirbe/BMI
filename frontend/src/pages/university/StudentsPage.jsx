import { useState, useEffect, useCallback } from "react";
import toast          from "react-hot-toast";
import { studentProfiles, groups } from "../../api";
import Spinner        from "../../components/ui/Spinner";
import PageHeader     from "../../components/ui/PageHeader";

export default function StudentsPage() {
  const [list,       setList]       = useState([]);
  const [groupList,  setGroupList]  = useState([]);
  const [groupFilter,setGroupFilter]= useState("");
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    groups.list().then((r) => setGroupList(r.data.data ?? [])).catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page };
    if (groupFilter) params.group = groupFilter;
    studentProfiles.list(params)
      .then((r) => {
        setList(r.data.data ?? []);
        setTotalPages(Math.ceil((r.data.count ?? r.data.data?.length ?? 0) / 20));
      })
      .catch(() => toast.error("Talabalar yuklanmadi"))
      .finally(() => setLoading(false));
  }, [page, groupFilter]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <PageHeader title="Talabalar" subtitle="Barcha talabalar ro'yxati" />

      <div style={s.filters}>
        <select value={groupFilter} onChange={(e) => { setGroupFilter(e.target.value); setPage(1); }} style={s.select}>
          <option value="">Barcha guruhlar</option>
          {groupList.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <button onClick={() => { setGroupFilter(""); setPage(1); }} style={s.clearBtn}>Tozalash</button>
      </div>

      {loading ? <Spinner /> : (
        <>
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>F.I.O</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Talaba ID</th>
                  <th style={s.th}>Guruh</th>
                  <th style={s.th}>Tug'ilgan kun</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 ? (
                  <tr><td colSpan={5} style={s.empty}>Ma'lumot topilmadi</td></tr>
                ) : list.map((s_) => (
                  <tr key={s_.id} style={s.tr}>
                    <td style={s.td}><strong>{s_.full_name}</strong></td>
                    <td style={s.td}>{s_.email}</td>
                    <td style={s.td}>{s_.student_id || "—"}</td>
                    <td style={s.td}>{s_.group_name || "—"}</td>
                    <td style={s.td}>{s_.date_of_birth || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={s.pagination}>
              <button disabled={page === 1}          onClick={() => setPage(p => p - 1)} style={s.pageBtn}>‹</button>
              <span style={{ fontSize: 13, color: "#64748b" }}>{page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={s.pageBtn}>›</button>
            </div>
          )}
        </>
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
  pagination:{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginTop: 16 },
  pageBtn:   { padding: "6px 14px", border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 14 },
};