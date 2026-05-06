import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BellIcon({ count }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/notifications")}
      style={styles.btn}
      title="Xabarnomalar"
    >
      <span style={styles.bell}>🔔</span>
      {count > 0 && (
        <span style={styles.badge}>{count > 99 ? "99+" : count}</span>
      )}
    </button>
  );
}

const styles = {
  btn: {
    position: "relative",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
    lineHeight: 1,
  },
  bell:  { fontSize: 20 },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    background: "#ef4444",
    color: "#fff",
    borderRadius: 99,
    fontSize: 10,
    fontWeight: 700,
    minWidth: 16,
    height: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 3px",
  },
};