import { useDispatch, useSelector } from "react-redux";
import { useNavigate }              from "react-router-dom";
import { logout }                   from "../../store/authSlice";
import { clearPermissions }         from "../../store/permissionsSlice";
import { selectUser }               from "../../store/authSlice";
import { useNotifications }         from "../../hooks/useNotifications";
import BellIcon                     from "../notifications/BellIcon";

export default function Navbar() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const user      = useSelector(selectUser);
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearPermissions());
    navigate("/login");
  };

  return (
    <header style={styles.navbar}>
      <div style={styles.left} />
      <div style={styles.right}>
        <BellIcon count={unreadCount} />
        <span style={styles.name}>{user?.full_name}</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Chiqish
        </button>
      </div>
    </header>
  );
}

const styles = {
  navbar: {
    height: 56,
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  left:  {},
  right: { display: "flex", alignItems: "center", gap: 16 },
  name:  { fontSize: 14, color: "#334155", fontWeight: 500 },
  logoutBtn: {
    padding: "6px 14px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
  },
};