export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={s.wrap}>
      <div>
        <h2 style={s.title}>{title}</h2>
        {subtitle && <p style={s.sub}>{subtitle}</p>}
      </div>
      {actions && <div style={s.actions}>{actions}</div>}
    </div>
  );
}

const s = {
  wrap:    { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 },
  title:   { fontSize: 22, fontWeight: 700, color: "#1e293b" },
  sub:     { fontSize: 13, color: "#64748b", marginTop: 2 },
  actions: { display: "flex", gap: 8 },
};