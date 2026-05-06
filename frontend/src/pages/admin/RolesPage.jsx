import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import toast                   from "react-hot-toast";
import { rbac }                from "../../api";
import Spinner                 from "../../components/ui/Spinner";
import PageHeader              from "../../components/ui/PageHeader";

export default function RolesPage() {
  const navigate            = useNavigate();
  const [list,    setList]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    rbac.roles()
      .then((r) => setList(r.data.data ?? []))
      .catch(() => toast.error("Rollar yuklanmadi"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Rollar" subtitle="Har bir rol uchun ruxsatlarni sozlash" />

      <div style={s.grid}>
        {list.map((role) => (
          <div key={role.id} style={s.card}>
            <div style={s.cardHeader}>
              <div>
                <div style={s.roleName}>{role.name}</div>
                <div style={s.roleSlug}>/{role.slug}</div>
              </div>
              <span style={s.badge(role.is_active)}>{role.is_active ? "Faol" : "Noaktiv"}</span>
            </div>

            <div style={s.permCount}>
              {role.permissions?.filter((p) => p.can_view).length ?? 0} ta sahifa ruxsati
            </div>

            <button
              onClick={() => navigate(`/admin/permissions?role=${role.id}`)}
              style={s.editBtn}
            >
              Ruxsatlarni sozlash →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  grid:       { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:16 },
  card:       { background:"#fff", borderRadius:12, padding:"20px 22px", boxShadow:"0 2px 8px rgba(0,0,0,0.07)", display:"flex", flexDirection:"column", gap:12 },
  cardHeader: { display:"flex", justifyContent:"space-between", alignItems:"flex-start" },
  roleName:   { fontWeight:700, fontSize:15, color:"#1e293b" },
  roleSlug:   { fontSize:12, color:"#94a3b8", marginTop:2 },
  badge:      (active) => ({ padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700, background: active ? "#dcfce7" : "#f1f5f9", color: active ? "#16a34a" : "#94a3b8" }),
  permCount:  { fontSize:13, color:"#64748b" },
  editBtn:    { padding:"8px 16px", background:"#eff6ff", color:"#3b82f6", border:"1px solid #bfdbfe", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, textAlign:"center" },
};