import React from "react";
import api from "../lib/api";

export default function Navbar({ refreshDevices }) {
  
  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  // ✅ Toggle all devices
  const toggleAll = async (state) => {
    try {
      await api.post(`/devices/toggle-all?state=${state}`);
      refreshDevices();
    } catch (err) {
      console.error("Toggle all failed:", err);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-4 py-3 fixed-navbar">
      <span className="navbar-brand fs-4 fw-bold">CasaControl 🏠</span>

      <div className="ms-auto d-flex gap-2">
        <button
          className="btn btn-success fw-semibold"
          onClick={() => toggleAll(true)}
        >
          Turn ON All
        </button>

        <button
          className="btn btn-danger fw-semibold"
          onClick={() => toggleAll(false)}
        >
          Turn OFF All
        </button>

        <button
          className="btn btn-outline-light fw-semibold"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
