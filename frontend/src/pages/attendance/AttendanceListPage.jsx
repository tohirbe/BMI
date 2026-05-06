import { useState, useEffect, useCallback } from "react";
import { useNavigate }        from "react-router-dom";
import toast                  from "react-hot-toast";
import { attendance, subjects, groups } from "../../api";
import { statusLabel, statusColor, formatDate } from "../../utils/helpers";
import { usePermissions }     from "../../hooks/usePermissions";
import Spinner                from "../../components/ui/Spinner";
import PageHeader             from "../../components/ui/PageHeader";

const STATUSES = ["present","absent","excused","late"];

export default function AttendanceListPage() {
  const navigate           = useNavigate();
  const { can }            = usePermissions();
  const canAdd             = can("attendance", "can_add");
  const canEdit            = can("attendance", "can_edit");

  const [list,       setList]       = useState([]);
  const [subList,    setSubList]    = useState([]);
  const [groupList,  setGroupList]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filters,    setFilters]    = useState({ subject: "", status: "", date: "", group: "" });
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    subjects.list().then((r) => setSubList(r.data.data ?? [])).catch(() => {});
    groups.list().then((r)   => setGroupList(r.data.data ?? [])).catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page, ...Object.fromEntries(Object.entries(filters).filter(([,v]) => v)) };
    attendance.list(params)
      .then((r) => {
        setList(r.data.results ?? []);
        setTotalPages(Math.ceil((r.data.count ?? 0) / 20));
      })
      .catch(() => toast.error("Davomat yuklanmadi"))
      .finally(() => setLoading(false));
  }, [filters, page]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <PageHeader
        title="Davomat"
        actions={
          canAdd && (
            <>
              <button onClick={() => navigate("/attendance/daily")} style={s.btn("#22c55e")}>Kunlik kiritish</button>
              <button onClick={() => navigate("/attendance/bulk")}  style={s.btn("#8b5cf6")}>CSV yuklash</button>
            </>
          )
        }
      />

      <div style={s.filters}>
        <select value={filters.group} onChange={(e) => setFilters({ ...filters, group: e.target.value })} style={s.select}>
          <option value="">Barcha guruhlar</option>
          {groupList.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <select value={filters.subject} onChange={(e) => setFilters({ ...filters, subject: e.target.value })} style={s.select}>
          <option value="">Barcha fanlar</option>
          {subList.map((sub) => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
        </select>
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} style={s.select}>
          <option value="">Barcha holat</option>
          {STATUSES.map((st) => <option key={st} value={st}>{statusLabel(st)}</option>)}
        </select>
        <input
          type="date" value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          style={s.select}
        />
        <button onClick={() => { setFilters({ subject: "", status: "", date: "", group: "" }); setPage(1); }} style={s.btn("#94a3b8")}>
          Tozalash
        </button>
      </div>

      {loading ? <Spinner /> : (
        <>
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Talaba</th>
                  <th style={s.th}>Fan</th>
                  <th style={s.th}>Sana</th>
                  <th style={s.th}>Holat</th>
                  <th style={s.th}>Kiritgan</th>
                  <th style={s.th}>Izoh</th>
                  {canEdit && <th style={s.th}>Amal</th>}
                </tr>
              </thead>
              <tbody>
                {list.length === 0 ? (
                  <tr><td colSpan={7} style={s.empty}>Ma'lumot topilmadi</td></tr>
                ) : list.map((a) => (
                  <tr key={a.id} style={s.tr}>
                    <td style={s.td}>{a.student_name}</td>
                    <td style={s.td}>{a.subject_name}</td>
                    <td style={s.td}>{formatDate(a.date)}</td>
                    <td style={s.td}>
                      <span style={s.badge(statusColor(a.status))}>{statusLabel(a.status)}</span>
                    </td>
                    <td style={s.td}>{a.entered_by_name ?? "—"}</td>
                    <td style={s.td}>{a.note || "—"}</td>
                    {canEdit && (
                      <td style={s.td}>
                        <button onClick={() => navigate(`/attendance/daily?id=${a.id}`)} style={s.aBtn("#3b82f6")}>
                          Tahrirlash
                        </button>
                      </td>
                    )}
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
  filters:   { display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" },
  select:    { padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, cursor: "pointer" },
  btn:       (bg) => ({ padding: "8px 16px", background: bg, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500 }),
  tableWrap: { background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", overflow: "auto" },
  table:     { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th:        { padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e2e8f0", background: "#f8fafc", whiteSpace: "nowrap" },
  tr:        { borderBottom: "1px solid #f1f5f9" },
  td:        { padding: "11px 16px", color: "#374151", verticalAlign: "middle" },
  empty:     { padding: 32, textAlign: "center", color: "#94a3b8" },
  badge:     (color) => ({ display: "inline-block", padding: "3px 10px", borderRadius: 99, background: color + "20", color, fontSize: 12, fontWeight: 600 }),
  aBtn:      (bg) => ({ padding: "4px 10px", background: bg, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }),
  pagination:{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginTop: 16 },
  pageBtn:   { padding: "6px 14px", border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 14 },
};