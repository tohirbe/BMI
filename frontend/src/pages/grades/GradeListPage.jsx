import { useState, useEffect, useCallback } from "react";
import { useNavigate }       from "react-router-dom";
import toast                 from "react-hot-toast";
import { grades, subjects, groups } from "../../api";
import { gradeTypeLabel, letterGradeColor, formatDate } from "../../utils/helpers";
import { usePermissions }    from "../../hooks/usePermissions";
import Spinner               from "../../components/ui/Spinner";
import PageHeader            from "../../components/ui/PageHeader";

const GRADE_TYPES = ["joriy_1","joriy_2","oraliq","yakuniy"];

export default function GradeListPage() {
  const navigate            = useNavigate();
  const { can }             = usePermissions();
  const canAdd              = can("grades", "can_add");
  const canEdit             = can("grades", "can_edit");
  const canDelete           = can("grades", "can_delete");

  const [list,       setList]       = useState([]);
  const [subList,    setSubList]    = useState([]);
  const [groupList,  setGroupList]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filters,    setFilters]    = useState({ subject: "", grade_type: "", group: "" });
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    subjects.list().then((r) => setSubList(r.data.data ?? [])).catch(() => {});
    groups.list().then((r)   => setGroupList(r.data.data ?? [])).catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page, ...Object.fromEntries(Object.entries(filters).filter(([,v]) => v)) };
    grades.list(params)
      .then((r) => {
        setList(r.data.results ?? []);
        setTotalPages(Math.ceil((r.data.count ?? 0) / 20));
      })
      .catch(() => toast.error("Baholar yuklanmadi"))
      .finally(() => setLoading(false));
  }, [filters, page]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
    try {
      await grades.delete(id);
      toast.success("O'chirildi");
      load();
    } catch {
      toast.error("O'chirishda xato");
    }
  };

  return (
    <div>
      <PageHeader
        title="Baholar"
        actions={
          canAdd && (
            <>
              <button onClick={() => navigate("/grades/new")}  style={s.btn("#3b82f6")}>+ Baho kiritish</button>
              <button onClick={() => navigate("/grades/bulk")} style={s.btn("#8b5cf6")}>CSV yuklash</button>
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
        <select value={filters.grade_type} onChange={(e) => setFilters({ ...filters, grade_type: e.target.value })} style={s.select}>
          <option value="">Barcha turlar</option>
          {GRADE_TYPES.map((t) => <option key={t} value={t}>{gradeTypeLabel(t)}</option>)}
        </select>
        <button onClick={() => { setFilters({ subject: "", grade_type: "", group: "" }); setPage(1); }} style={s.btn("#94a3b8")}>
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
                  <th style={s.th}>Tur</th>
                  <th style={s.th}>Ball</th>
                  <th style={s.th}>Baho</th>
                  <th style={s.th}>Sana</th>
                  <th style={s.th}>Kiritgan</th>
                  {(canEdit || canDelete) && <th style={s.th}>Amal</th>}
                </tr>
              </thead>
              <tbody>
                {list.length === 0 ? (
                  <tr><td colSpan={8} style={s.empty}>Ma'lumot topilmadi</td></tr>
                ) : list.map((g) => (
                  <tr key={g.id} style={s.tr}>
                    <td style={s.td}>{g.student_name}</td>
                    <td style={s.td}>{g.subject_name}</td>
                    <td style={s.td}>{gradeTypeLabel(g.grade_type)}</td>
                    <td style={s.td}><strong>{g.score}</strong></td>
                    <td style={s.td}>
                      <span style={{ color: letterGradeColor(g.letter_grade), fontWeight: 600 }}>
                        {g.letter_grade}
                      </span>
                    </td>
                    <td style={s.td}>{formatDate(g.date)}</td>
                    <td style={s.td}>{g.entered_by_name ?? "—"}</td>
                    {(canEdit || canDelete) && (
                      <td style={s.td}>
                        <div style={{ display: "flex", gap: 6 }}>
                          {canEdit   && <button onClick={() => navigate(`/grades/${g.id}/edit`)} style={s.aBtn("#3b82f6")}>Tahrirlash</button>}
                          {canDelete && <button onClick={() => handleDelete(g.id)}               style={s.aBtn("#ef4444")}>O'chirish</button>}
                        </div>
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
  th:        { padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", whiteSpace: "nowrap", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" },
  tr:        { borderBottom: "1px solid #f1f5f9" },
  td:        { padding: "11px 16px", color: "#374151", verticalAlign: "middle" },
  empty:     { padding: 32, textAlign: "center", color: "#94a3b8" },
  aBtn:      (bg) => ({ padding: "4px 10px", background: bg, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }),
  pagination:{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginTop: 16 },
  pageBtn:   { padding: "6px 14px", border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 14 },
};