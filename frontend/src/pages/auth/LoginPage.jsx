import { useState }        from "react";
import { useNavigate }     from "react-router-dom";
import { useDispatch }     from "react-redux";
import toast               from "react-hot-toast";
import { login }           from "../../api/auth";
import { setCredentials }  from "../../store/authSlice";
import { getDashboardPath } from "../../utils/helpers";

export default function LoginPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      const { access, refresh, user } = res.data.data;
      dispatch(setCredentials({ access, refresh, user }));
      toast.success(`Xush kelibsiz, ${user.full_name}!`);
      navigate(getDashboardPath(user.role), { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error ?? "Login xatosi";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>EduStat</h1>
        <p style={s.sub}>Tizimga kirish</p>

        <form onSubmit={handleSubmit} style={s.form}>
          <label style={s.label}>Email</label>
          <input
            type="email"
            required
            autoFocus
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="email@example.com"
            style={s.input}
          />

          <label style={s.label}>Parol</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            style={s.input}
          />

          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? "Kirilmoqda..." : "Kirish"}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1e3a5f 0%, #3b82f6 100%)",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "40px 36px",
    width: 380,
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  title: { fontSize: 28, fontWeight: 800, color: "#1e3a5f", textAlign: "center" },
  sub:   { textAlign: "center", color: "#64748b", margin: "6px 0 28px", fontSize: 14 },
  form:  { display: "flex", flexDirection: "column", gap: 12 },
  label: { fontSize: 13, fontWeight: 600, color: "#374151" },
  input: {
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    transition: "border 0.2s",
  },
  btn: {
    marginTop: 8,
    padding: "12px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
  },
};