import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import toast                   from "react-hot-toast";
import { grades, subjects }    from "../../api";
import { gradeTypeLabel }      from "../../utils/helpers";
import PageHeader              from "../../components/ui/PageHeader";
import Spinner                 from "../../components/ui/Spinner";

export default function GradeBulkPage() {
  const navigate             = useNavigate();
  const [subList,  setSubList]  = useState([]);
  const [subId,    setSubId]    = useState("");
  const [file,     setFile]     = useState(null);
  const [preview,  setPreview]  = useState(null);
  const [errors,   setErrors]   = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [step,     setStep]     = useState(1); // 1=yuklash, 2=preview, 3=tasdiqlash

  useEffect(() => {
    subjects.list().then((r) => setSubList(r.data.data ?? [])).catch(() => {});
  }, []);

  const handlePreview = async (e) => {
    e.preventDefault();
    if (!file || !subId) { toast.error("Fan va fayl tanlang"); return; }

    setLoading(true);
    const form = new FormData();
    form.append("file",       file);
    form.append("subject_id", subId);
    form.append("confirm",    "false");

    try {
      const res = await grades.bulkUpload(form);
      const data = res.data.data;
      setPreview(data.preview);
      setErrors([]);
      setStep(2);
    } catch (err) {
      const errs = err.response?.data?.errors ?? [];
      setErrors(errs);
      setPreview(null);
      if (errs.length === 0) toast.error(err.response?.data?.error ?? "Xato");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    const form = new FormData();
    form.append("file",       file);
    form.append("subject_id", subId);
    form.append("confirm",    "true");

    try {
      const res = await grades.bulkUpload(form);
      toast.success(res.data.message);
      navigate("/grades");
    } catch (err) {
      toast.error(err.response?.data?.error ?? "Saqlashda xato");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Baholarni CSV/Excel orqali yuklash" />

      {/* Namuna fayl */}
      <div style={s.info}>
        <strong>Fayl formati:</strong>
        <code style={s.code}>student_id, grade_type, score, date</code>
        <span>grade_type: joriy_1 | joriy_2 | oraliq | yakuniy</span>
      </div>

      {/* 1-qadam: Fayl tanlash */}
      <div style={s.card}>
        <h3 style={s.stepTitle}>1. Fan va fayl tanlash</h3>
        <form onSubmit={handlePreview} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Fan *</label>
            <select required value={subId} onChange={(e) => { setSubId(e.target.value); setPreview(null); setErrors([]); setStep(1); }} style={s.select}>
              <option value="">Fan tanlang</option>
              {subList.map((sub) => <option key={sub.id} value={sub.id}>{sub.name} — {sub.group_name}</option>)}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Fayl (CSV yoki Excel) *</label>
            <input
              type="file" required accept=".csv,.xlsx,.xls"
              onChange={(e) => { setFile(e.target.files[0]); setPreview(null); setErrors([]); setStep(1); }}
              style={s.fileInput}
            />
          </div>
          <button type="submit" disabled={loading} style={s.btn("#3b82f6")}>
            {loading ? "Tekshirilmoqda..." : "Tekshirish va ko'rish"}
          </button>
        </form>
      </div>

      {/* Xatolar */}
      {errors.length > 0 && (
        <div style={s.errorBox}>
          <h3 style={{ color: "#ef4444", marginBottom: 12 }}>Xatolar topildi ({errors.length} ta)</h3>
          <table style={s.table}>
            <thead><tr>
              <th style={s.th}>Qator</th><th style={s.th}>Maydon</th><th style={s.th}>Xato</th>
            </tr></thead>
            <tbody>
              {errors.map((e, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #fee2e2" }}>
                  <td style={s.td}>{e.row}</td>
                  <td style={s.td}>{e.field}</td>
                  <td style={{ ...s.td, color: "#ef4444" }}>{e.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2-qadam: Preview */}
      {step === 2 && preview && (
        <div style={s.card}>
          <h3 style={s.stepTitle}>2. Preview — {preview.length} ta yozuv</h3>
          <div style={{ overflow: "auto", maxHeight: 360 }}>
            <table style={s.table}>
              <thead><tr>
                <th style={s.th}>Student ID</th>
                <th style={s.th}>Tur</th>
                <th style={s.th}>Ball</th>
                <th style={s.th}>Sana</th>
              </tr></thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={s.td}>{row.student_id}</td>
                    <td style={s.td}>{gradeTypeLabel(row.grade_type)}</td>
                    <td style={s.td}><strong>{row.score}</strong></td>
                    <td style={s.td}>{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={s.previewActions}>
            <button onClick={() => setStep(1)} style={s.btn("#94a3b8")}>Orqaga</button>
            <button onClick={handleConfirm} disabled={loading} style={s.btn("#22c55e")}>
              {loading ? "Saqlanmoqda..." : `✓ ${preview.length} ta bahoni saqlash`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  info:         { background: "#eff6ff", borderRadius: 10, padding: "14px 18px", marginBottom: 20, fontSize: 13, display: "flex", flexDirection: "column", gap: 6, color: "#1e40af" },
  code:         { background: "#dbeafe", padding: "2px 8px", borderRadius: 4, fontFamily: "monospace", fontSize: 12 },
  card:         { background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", marginBottom: 20, maxWidth: 720 },
  stepTitle:    { fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 18 },
  form:         { display: "flex", flexDirection: "column", gap: 16 },
  field:        { display: "flex", flexDirection: "column", gap: 6 },
  label:        { fontSize: 13, fontWeight: 600, color: "#374151" },
  select:       { padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14 },
  fileInput:    { padding: "8px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, cursor: "pointer" },
  btn:          (bg) => ({ padding: "10px 24px", background: bg, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, alignSelf: "flex-start" }),
  errorBox:     { background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", marginBottom: 20, border: "1px solid #fecaca" },
  table:        { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th:           { padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" },
  td:           { padding: "9px 14px", color: "#374151" },
  previewActions: { display: "flex", gap: 12, marginTop: 18, justifyContent: "flex-end" },
};
