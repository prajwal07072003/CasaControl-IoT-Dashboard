import React from "react";
import "../styles/topbar.css";

export default function Topbar({ onRefresh }) {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  return (
    <div className="topbar">
      <div className="search">
        <span className="bi bi-search" />
        <input
          placeholder="Search devices…"
          style={{
            background: "transparent",
            border: 0,
            outline: "none",
            color: "inherit",
            width: "100%",
          }}
        />
      </div>

      <button className="btn btn-accent" onClick={onRefresh}>
        Refresh
      </button>

      <div className="profile">
        <span className="bi bi-person-circle" />
        <span style={{ color: "#cfd6e5" }}>{localStorage.getItem("email") || "Guest"}</span>
        <button className="btn btn-sm btn-outline-light" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
