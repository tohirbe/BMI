import { useState, useEffect, useCallback } from "react";
import { useNavigate }         from "react-router-dom";
import toast                   from "react-hot-toast";
import { notifications }       from "../../api";
import { useNotifications }    from "../../hooks/useNotifications";
import { usePermissions }      from "../../hooks/usePermissions";
import { formatDate }          from "../../utils/helpers";
import Spinner                 from "../../components/ui/Spinner";
import PageHeader              from "../../components/ui/PageHeader";

const LEVEL_LABELS = {
  university: "Universitet",
  faculty:    "Fakultet",
  department: "Kafedra",
  group:      "Guruh",
  personal:   "Shaxsiy",
};
const LEVEL_COLORS = {
  university: "#3b82f6",
  faculty:    "#8b5cf6",
  department: "#f59e0b",
  group:      "#22c55e",
  personal:   "#64748b",
};

export default function NotifPage() {
  const navigate             = useNavigate();
  const { can }              = usePermissions();
  const { markRead, refresh } = useNotifications();

  const [list,       setList]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [isRead,     setIsRead]     = useState("");
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expanded,   setExpanded]   = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page };
    if (isRead !== "") params.is_read = isRead;
    notifications.list(params)
      .then((r) => {
        setList(r.data.results ?? []);
        setTotalPages(Math.ceil((r.data.count ?? 0) / 20));
      })
      .catch(() => toast.error("Xabarnomalar yuklanmadi"))
      .finally(() => setLoading(false));
  }, [page, isRead]);

  useEffect(() => { load(); }, [load]);

  const handleExpand = async (notif) => {
    if (expanded?.id === notif.id) { setExpanded(null); return; }
    setExpanded(notif);
    if (!notif.is_read) {
      await markRead(notif.id);
      setList((prev) => prev.map((n) => n.id === notif.id ? { ...n, is_read: true } : n));
      refresh();
    }
  };

  return (
    <div>
      <PageHeader
        title="Xabarnomalar"
        actions={
          can("notifications", "can_add") && (
            <button onClick={() => navigate("/notifications/compose")} style={s.btn("#3b82f6")}>
              + Xabarnoma yuborish
            </button>
          )
        }
      />

      {/* Filter */}
      <div style={s.filterBar}>
        {[
          { val: "",      label: "Barchasi" },
          { val: "false", label: "O'qilmagan" },
          { val: "true",  label: "O'qilgan" },
        ].map((f) => (
          <button
            key={f.val}
            onClick={() => { setIsRead(f.val); setPage(1); }}
            style={{ ...s.filterBtn, ...(isRead === f.val ? s.filterBtnActive : {}) }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <>
          {list.length === 0 ? (
            <div style={s.empty}>Xabarnomalar yo'q</div>
          ) : (
            <div style={s.list}>
              {list.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleExpand(n)}
                  style={{
                    ...s.item,
                    background: n.is_read ? "#fff" : "#eff6ff",
                    borderLeft: `4px solid ${LEVEL_COLORS[n.level] ?? "#e2e8f0"}`,
                  }}
                >
                  <div style={s.itemHeader}>
                    <div style={s.itemLeft}>
                      {!n.is_read && <span style={s.dot} />}
                      <span style={s.badge(LEVEL_COLORS[n.level])}>{LEVEL_LABELS[n.level]}</span>
                      <span style={s.itemTitle}>{n.title}</span>
                    </div>
                    <div style={s.itemMeta}>
                      <span style={s.sender}>{n.sender_name}</span>
                      <span style={s.date}>{formatDate(n.created_at)}</span>
                      <span style={s.chevron}>{expanded?.id === n.id ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {expanded?.id === n.id && (
                    <div style={s.body} onClick={(e) => e.stopPropagation()}>
                      {n.body}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

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
  btn:           (bg) => ({ padding: "8px 18px", background: bg, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500 }),
  filterBar:     { display: "flex", gap: 8, marginBottom: 20 },
  filterBtn:     { padding: "7px 18px", border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13, color: "#64748b" },
  filterBtnActive:{ background: "#3b82f6", color: "#fff", borderColor: "#3b82f6" },
  list:          { display: "flex", flexDirection: "column", gap: 10 },
  item:          { borderRadius: 10, padding: "14px 18px", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "box-shadow 0.15s" },
  itemHeader:    { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  itemLeft:      { display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 },
  dot:           { width: 8, height: 8, borderRadius: "50%", background: "#3b82f6", flexShrink: 0 },
  badge:         (color) => ({ padding: "2px 10px", borderRadius: 99, background: color + "20", color, fontSize: 11, fontWeight: 700, flexShrink: 0 }),
  itemTitle:     { fontWeight: 600, fontSize: 14, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  itemMeta:      { display: "flex", alignItems: "center", gap: 12, flexShrink: 0 },
  sender:        { fontSize: 12, color: "#64748b" },
  date:          { fontSize: 12, color: "#94a3b8" },
  chevron:       { fontSize: 11, color: "#94a3b8" },
  body:          { marginTop: 12, padding: "12px 0 0", borderTop: "1px solid #e2e8f0", fontSize: 14, color: "#374151", lineHeight: 1.7, whiteSpace: "pre-wrap" },
  empty:         { textAlign: "center", padding: 48, color: "#94a3b8", fontSize: 15 },
  pagination:    { display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginTop: 20 },
  pageBtn:       { padding: "6px 14px", border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 14 },
};