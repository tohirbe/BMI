import { NavLink } from "react-router-dom";
import { usePermissions } from "../../hooks/usePermissions";

const ICONS = {
  dashboard:     "🏠",
  grades:        "📝",
  attendance:    "📅",
  analytics:     "📊",
  students:      "🎓",
  groups:        "👥",
  subjects:      "📚",
  reports:       "📄",
  notifications: "🔔",
  users:         "👤",
  roles:         "🛡️",
  permissions:   "🔑",
};

export default function Sidebar() {
  const { menuItems } = usePermissions();

  const topLevel = menuItems.filter((i) => i.can_view);

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>EduStat</div>
      <nav>
        {topLevel.map((item) => (
          <NavLink
            key={item.key}
            to={item.url_path}
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.active : {}),
            })}
          >
            <span style={styles.icon}>{ICONS[item.key] ?? "•"}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 220,
    minHeight: "100vh",
    background: "#1e293b",
    color: "#f1f5f9",
    display: "flex",
    flexDirection: "column",
    padding: "0 0 16px",
    flexShrink: 0,
  },
  logo: {
    fontSize: 22,
    fontWeight: 700,
    padding: "24px 20px 20px",
    borderBottom: "1px solid #334155",
    marginBottom: 8,
    letterSpacing: 1,
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 20px",
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: 14,
    borderRadius: 6,
    margin: "2px 8px",
    transition: "background 0.15s",
  },
  active: {
    background: "#3b82f6",
    color: "#fff",
  },
  icon: { fontSize: 16 },
};