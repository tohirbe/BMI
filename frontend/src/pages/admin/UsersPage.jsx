import { useState, useEffect, useCallback } from "react";
import toast                from "react-hot-toast";
import { users }            from "../../api";
import { formatDate }       from "../../utils/helpers";
import Spinner              from "../../components/ui/Spinner";
import PageHeader           from "../../components/ui/PageHeader";

const ROLES = [
  { value: "rector",    label: "Rektor" },
  { value: "dean",      label: "Dekan" },
  { value: "head",      label: "Kafedra boshlig'i" },
  { value: "vice_head", label: "O'rinbosar" },
  { value: "teacher",   label: "O'qituvchi" },
  { value: "student",   label: "Talaba" },
];

const ROLE_COLORS = {
  superuser: "#7c3aed", rector: "#2563eb", dean: "#0891b2",
  head: "#059669", vice_head: "#65a30d", teacher: "#d97706", student: "#64748b",
};

export default function UsersPage() {
  const [list,       setList]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modal,      setModal]      = useState(null); // null | "create" | user obj
  const [form,       setForm]       = useState({ first_name:"", last_name:"", email:"", role:"student", password:"", password2:"" });
  const [saving,     setSaving]     = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page };
    if (search)     params.search = search;
    if (roleFilter) params.role   = roleFilter;
    users.list(params)
      .then((r) => {
        setList(r.data.results ?? []);
        setTotalPages(Math.ceil((r.data.count ?? 0) / 20));
      })
      .catch(() => toast.error("Yuklanmadi"))
      .finally(() => setLoading(false));
  }, [page, search, roleFilter]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ first_name:"", last_name:"", middle_name:"", email:"", role:"student", phone:"", password:"", password2:"" });
    setModal("create");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (modal === "create" && form.password !== form.password2) {
      toast.error("Parollar mos emas"); return;
    }
    setSaving(true);
    try {
      if (modal === "create") {
        await users.create(form);
        toast.success("Foydalanuvchi yaratildi");
      } else {
        await users.update(modal.id, { first_name: form.first_name, last_name: form.last_name, middle_name: form.middle_name, phone: form.phone });
        toast.success("Yangilandi");
      }
      setModal(null);
      load();
    } catch (err) {
      const d = err.response?.data?.details;
      toast.error(d ? Object.values(d).flat()[0] : err.response?.data?.error ?? "Xato");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (u) => {
    try {
      await users.update(u.id, { is_active: !u.is_active });
      toast.success(u.is_active ? "Bloklandi" : "Faollashtirildi");
      load();
    } catch { toast.error("Xato"); }
  };

  return (
    <div>
      <PageHeader
        title="Foydalanuvchilar"
        actions={<button onClick={openCreate} style={s.btn("#3b82f6")}>+ Yangi foydalanuvchi</button>}
      />

      <div style={s.filterBar}>
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Ism, email bo'yicha qidirish..." style={s.searchInput} />
        <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }} style={s.select}>
          <option value="">Barcha rollar</option>
          {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </div>

      {loading ? <Spinner /> : (
        <>
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Ism</th><th style={s.th}>Email</th>
                  <th style={s.th}>Rol</th><th style={s.th}>Holat</th>
                  <th style={s.th}>Yaratilgan</th><th style={s.th}>Amal</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 ? (
                  <tr><td colSpan={6} style={s.empty}>Topilmadi</td></tr>
                ) : list.map((u) => (
                  <tr key={u.id} style={s.tr}>
                    <td style={s.td}><strong>{u.full_name}</strong></td>
                    <td style={s.td}>{u.email}</td>
                    <td style={s.td}>
                      <span style={s.roleBadge(ROLE_COLORS[u.role] ?? "#64748b")}>{u.role}</span>
                    </td>
                    <td style={s.td}>
                      <span style={s.statusDot(u.is_active)}>{u.is_active ? "Faol" : "Bloklangan"}</span>
                    </td>
                    <td style={s.td}>{formatDate(u.created_at)}</td>
                    <td style={s.td}>
                      <div style={{ display:"flex", gap:6 }}>
                        <button onClick={() => { setForm({ ...u, password:"", password2:"" }); setModal(u); }} style={s.aBtn("#3b82f6")}>Tahrirlash</button>
                        <button onClick={() => handleToggleActive(u)} style={s.aBtn(u.is_active ? "#f59e0b" : "#22c55e")}>
                          {u.is_active ? "Bloklash" : "Faollashtirish"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={s.pagination}>
              <button disabled={page===1}          onClick={() => setPage(p=>p-1)} style={s.pageBtn}>‹</button>
              <span style={{fontSize:13,color:"#64748b"}}>{page}/{totalPages}</span>
              <button disabled={page===totalPages} onClick={() => setPage(p=>p+1)} style={s.pageBtn}>›</button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {modal && (
        <div style={s.overlay} onClick={() => setModal(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitle}>{modal === "create" ? "Yangi foydalanuvchi" : "Tahrirlash"}</h3>
            <form onSubmit={handleSave} style={s.mForm}>
              <div style={s.mRow}>
                <div style={s.mField}>
                  <label style={s.label}>Ism *</label>
                  <input required value={form.first_name} onChange={(e) => setForm({...form, first_name: e.target.value})} style={s.input} />
                </div>
                <div style={s.mField}>
                  <label style={s.label}>Familya *</label>
                  <input required value={form.last_name} onChange={(e) => setForm({...form, last_name: e.target.value})} style={s.input} />
                </div>
              </div>
              <div style={s.mField}>
                <label style={s.label}>Otasining ismi</label>
                <input value={form.middle_name??""} onChange={(e) => setForm({...form, middle_name: e.target.value})} style={s.input} />
              </div>
              {modal === "create" && (
                <>
                  <div style={s.mField}>
                    <label style={s.label}>Email *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} style={s.input} />
                  </div>
                  <div style={s.mField}>
                    <label style={s.label}>Rol *</label>
                    <select required value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} style={s.input}>
                      {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                  <div style={s.mRow}>
                    <div style={s.mField}>
                      <label style={s.label}>Parol *</label>
                      <input required type="password" minLength={8} value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} style={s.input} />
                    </div>
                    <div style={s.mField}>
                      <label style={s.label}>Parolni takrorlang *</label>
                      <input required type="password" value={form.password2} onChange={(e) => setForm({...form, password2: e.target.value})} style={s.input} />
                    </div>
                  </div>
                </>
              )}
              <div style={s.mField}>
                <label style={s.label}>Telefon</label>
                <input value={form.phone??""} onChange={(e) => setForm({...form, phone: e.target.value})} style={s.input} placeholder="+998..." />
              </div>
              <div style={s.mActions}>
                <button type="button" onClick={() => setModal(null)} style={s.cancelBtn}>Bekor</button>
                <button type="submit" disabled={saving} style={s.submitBtn}>{saving ? "..." : "Saqlash"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  btn:         (bg) => ({ padding:"8px 18px", background:bg, color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:500 }),
  filterBar:   { display:"flex", gap:12, marginBottom:20 },
  searchInput: { padding:"9px 14px", border:"1px solid #d1d5db", borderRadius:8, fontSize:13, flex:1, outline:"none" },
  select:      { padding:"9px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:13 },
  tableWrap:   { background:"#fff", borderRadius:12, boxShadow:"0 2px 8px rgba(0,0,0,0.07)", overflow:"auto" },
  table:       { width:"100%", borderCollapse:"collapse", fontSize:13 },
  th:          { padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#374151", borderBottom:"1px solid #e2e8f0", background:"#f8fafc", whiteSpace:"nowrap" },
  tr:          { borderBottom:"1px solid #f1f5f9" },
  td:          { padding:"11px 16px", color:"#374151", verticalAlign:"middle" },
  empty:       { padding:32, textAlign:"center", color:"#94a3b8" },
  roleBadge:   (c) => ({ padding:"2px 10px", borderRadius:99, background:c+"20", color:c, fontSize:11, fontWeight:700 }),
  statusDot:   (active) => ({ fontSize:12, color: active ? "#22c55e" : "#ef4444", fontWeight:600 }),
  aBtn:        (bg) => ({ padding:"4px 10px", background:bg, color:"#fff", border:"none", borderRadius:6, cursor:"pointer", fontSize:12 }),
  pagination:  { display:"flex", alignItems:"center", gap:12, justifyContent:"center", marginTop:16 },
  pageBtn:     { padding:"6px 14px", border:"1px solid #e2e8f0", borderRadius:8, background:"#fff", cursor:"pointer", fontSize:14 },
  overlay:     { position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999 },
  modal:       { background:"#fff", borderRadius:16, padding:28, width:520, maxWidth:"95vw", maxHeight:"90vh", overflow:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.25)" },
  modalTitle:  { fontSize:18, fontWeight:700, color:"#1e293b", marginBottom:20 },
  mForm:       { display:"flex", flexDirection:"column", gap:14 },
  mRow:        { display:"flex", gap:12 },
  mField:      { display:"flex", flexDirection:"column", gap:5, flex:1 },
  label:       { fontSize:13, fontWeight:600, color:"#374151" },
  input:       { padding:"9px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14, width:"100%" },
  mActions:    { display:"flex", gap:10, justifyContent:"flex-end", marginTop:6 },
  cancelBtn:   { padding:"9px 20px", background:"#f1f5f9", color:"#374151", border:"none", borderRadius:8, cursor:"pointer" },
  submitBtn:   { padding:"9px 24px", background:"#3b82f6", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontWeight:600 },
};