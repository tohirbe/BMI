import { useNavigate } from "react-router-dom";

export default function Page403() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", padding: 80 }}>
      <h1 style={{ fontSize: 64, color: "#ef4444" }}>403</h1>
      <p style={{ color: "#64748b", margin: "12px 0 24px" }}>
        Bu sahifaga kirishga ruxsatingiz yo'q
      </p>
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "10px 24px", background: "#3b82f6",
          color: "#fff", border: "none", borderRadius: 8, cursor: "pointer",
        }}
      >
        Orqaga
      </button>
    </div>
  );
}