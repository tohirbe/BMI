import { useState, useEffect, useCallback } from "react";
import { useSearchParams }     from "react-router-dom";
import toast                   from "react-hot-toast";
import { rbac }                from "../../api";
import Spinner                 from "../../components/ui/Spinner";
import PageHeader              from "../../components/ui/PageHeader";

const ACTIONS = [
  { key: "can_view",   label: "Ko'rish",   color: "#3b82f6" },
  { key: "can_add",    label: "Qo'shish",  color: "#22c55e" },
  { key: "can_edit",   label: "Tahrirlash",color: "#f59e0b" },
  { key: "can_delete", label: "O'chirish", color: "#ef4444" },
];

export default function PermissionMatrix() {
  const [searchParams]        = useSearchParams();
  const initRoleId            = searchParams.get("role") ?? "";

  const [roles,     setRoles]     = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [perms,     setPerms]     = useState({}); // { roleId: { menuKey: { can_view, ... } } }
  const [selRole,   setSelRole]   = useState(initRoleId);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState({});

  useEffect(() => {
    Promise.all([rbac.roles(), rbac.menuItems()])
      .then(([rRes, mRes]) => {
        setRoles(rRes.data.data ?? []);
        setMenuItems(mRes.data.data ?? []);
      })
      .catch(() => toast.error("Ma'lumot yuklanmadi"))
      .finally(() => setLoading(false));
  }, []);

  const loadPerms = useCallback((roleId) => {
    if (!roleId) return;
    rbac.rolePerms(roleId)
      .then((r) => {
        const map = {};
        (r.data.data ?? []).forEach((p) => {
          map[p.menu_item_key] = {
            menu_item: p.menu_item,
            can_view:   p.can_view,
            can_add:    p.can_add,
            can_edit:   p.can_edit,
            can_delete: p.can_delete,
          };
        });
        setPerms((prev) => ({ ...prev, [roleId]: map }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selRole) loadPerms(selRole);
  }, [selRole, loadPerms]);

  const togglePerm = async (menuItem, actionKey) => {
    const saveKey = `${selRole}-${menuItem.key}-${actionKey}`;
    const current = perms[selRole]?.[menuItem.key] ?? {};
    const newVal  = !current[actionKey];

    // Optimistic update
    setPerms((prev) => ({
      ...prev,
      [selRole]: {
        ...prev[selRole],
        [menuItem.key]: { ...current, [actionKey]: newVal, menu_item: menuItem.id },
      },
    }));

    setSaving((s) => ({ ...s, [saveKey]: true }));
    try {
      await rbac.saveRolePerm(selRole, {
        menu_item:  menuItem.id,
        can_view:   actionKey === "can_view"   ? newVal : (current.can_view   ?? false),
        can_add:    actionKey === "can_add"    ? newVal : (current.can_add    ?? false),
        can_edit:   actionKey === "can_edit"   ? newVal : (current.can_edit   ?? false),
        can_delete: actionKey === "can_delete" ? newVal : (current.can_delete ?? false),
      });
    } catch {
      toast.error("Saqlashda xato");
      setPerms((prev) => ({
        ...prev,
        [selRole]: { ...prev[selRole], [menuItem.key]: current },
      }));
    } finally {
      setSaving((s) => { const n = { ...s }; delete n[saveKey]; return n; });
    }
  };

  if (loading) return <Spinner />;

  const currentPerms = perms[selRole] ?? {};
  const selectedRole = roles.find((r) => String(r.id) === String(selRole));

  return (
    <div>
      <PageHeader title="Ruxsatlar matritsasi" subtitle="Rol tanlang va ruxsatlarni sozlang" />

      {/* Rol tanlash */}
      <div style={s.roleBar}>
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelRole(String(role.id))}
            style={{
              ...s.roleBtn,
              background: String(selRole) === String(role.id) ? "#1e3a5f" : "#fff",
              color:      String(selRole) === String(role.id) ? "#fff"    : "#374151",
            }}
          >
            {role.name}
          </button>
        ))}
      </div>

      {selRole && selectedRole && (
        <>
          <div style={s.roleInfo}>
            <strong>{selectedRole.name}</strong> roli uchun ruxsatlar
            <span style={s.autoSave}>• O'zgarishlar avtomatik saqlanadi</span>
          </div>

          {/* Legend */}
          <div style={s.legend}>
            {ACTIONS.map((a) => (
              <span key={a.key} style={s.legendItem(a.color)}>{a.label}</span>
            ))}
          </div>

          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Sahifa</th>
                  <th style={s.th}>URL</th>
                  {ACTIONS.map((a) => (
                    <th key={a.key} style={{ ...s.th, textAlign:"center", color: a.color }}>{a.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => {
                  const p = currentPerms[item.key] ?? {};
                  return (
                    <tr key={item.key} style={s.tr}>
                      <td style={{ ...s.td, fontWeight:600 }}>
                        {item.label}
                      </td>
                      <td style={{ ...s.td, color:"#94a3b8", fontFamily:"monospace", fontSize:12 }}>
                        {item.url_path}
                      </td>
                      {ACTIONS.map((a) => {
                        const sk = `${selRole}-${item.key}-${a.key}`;
                        const checked = !!p[a.key];
                        return (
                          <td key={a.key} style={{ ...s.td, textAlign:"center" }}>
                            <label style={s.toggle}>
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={!!saving[sk]}
                                onChange={() => togglePerm(item, a.key)}
                                style={{ display:"none" }}
                              />
                              <span style={s.toggleTrack(checked, a.color)}>
                                <span style={s.toggleThumb(checked)} />
                              </span>
                            </label>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

const s = {
  roleBar:     { display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 },
  roleBtn:     { padding:"8px 18px", border:"1px solid #e2e8f0", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:500, transition:"all 0.15s" },
  roleInfo:    { fontSize:14, color:"#374151", marginBottom:12, display:"flex", alignItems:"center", gap:8 },
  autoSave:    { fontSize:12, color:"#94a3b8" },
  legend:      { display:"flex", gap:10, marginBottom:16 },
  legendItem:  (c) => ({ padding:"3px 12px", borderRadius:99, background:c+"18", color:c, fontSize:12, fontWeight:600 }),
  tableWrap:   { background:"#fff", borderRadius:12, boxShadow:"0 2px 8px rgba(0,0,0,0.07)", overflow:"auto" },
  table:       { width:"100%", borderCollapse:"collapse", fontSize:13 },
  th:          { padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#374151", borderBottom:"1px solid #e2e8f0", background:"#f8fafc", whiteSpace:"nowrap" },
  tr:          { borderBottom:"1px solid #f1f5f9" },
  td:          { padding:"13px 16px", color:"#374151", verticalAlign:"middle" },
  toggle:      { display:"inline-flex", alignItems:"center", cursor:"pointer" },
  toggleTrack: (on, color) => ({
    width:40, height:22, borderRadius:11,
    background: on ? color : "#e2e8f0",
    position:"relative", transition:"background 0.2s", display:"block",
  }),
  toggleThumb: (on) => ({
    position:"absolute", top:3, left: on ? 21 : 3,
    width:16, height:16, borderRadius:"50%",
    background:"#fff", transition:"left 0.2s",
    boxShadow:"0 1px 4px rgba(0,0,0,0.2)",
  }),
};