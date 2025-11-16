import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaBolt, FaClock, FaUserCog } from "react-icons/fa";
import "../styles/sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `nav-item ${isActive ? "active" : ""}`;

  return (
    <aside className="sidebar shadow-soft">
      
      {/* ✅ ZENTRA BRAND BLOCK */}
      <div
        className="brand"
        onClick={() => navigate("/dashboard")}
        style={{ cursor: "pointer" }}
      >
        <div className="brand-logo">
          <span className="dot"></span>
          <span className="brand-title">Zentra</span>
        </div>

        <div className="tagline">Your Home. Your Vibe. Your Rizz.</div>
      </div>

      {/* ✅ NAVIGATION */}
      <div className="nav-group">
        <NavLink to="/dashboard" className={linkClass}>
          <FaHome /> <span>Dashboard</span>
        </NavLink>

        <NavLink to="/devices" className={linkClass}>
          <FaBolt /> <span>Devices</span>
        </NavLink>

        <NavLink to="/schedules" className={linkClass}>
          <FaClock /> <span>Schedules</span>
        </NavLink>

        <NavLink to="/settings" className={linkClass}>
          <FaUserCog /> <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}
