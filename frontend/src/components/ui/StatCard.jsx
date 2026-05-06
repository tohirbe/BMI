export default function StatCard({ label, value, color = "#3b82f6", icon }) {
  return (
    <div style={{ ...s.card, borderTop: `4px solid ${color}` }}>
      <div style={s.icon}>{icon}</div>
      <div style={s.value}>{value ?? "—"}</div>
      <div style={s.label}>{label}</div>
    </div>
  );
}

const s = {
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: "20px 24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    minWidth: 160,
    flex: 1,
  },
  icon:  { fontSize: 28, marginBottom: 8 },
  value: { fontSize: 28, fontWeight: 700, color: "#1e293b" },
  label: { fontSize: 13, color: "#64748b", marginTop: 4 },
};