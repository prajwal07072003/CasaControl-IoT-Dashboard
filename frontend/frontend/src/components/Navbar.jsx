import React from "react";
import axios from "axios";

export default function Navbar({ refreshDevices }) {
  const toggleAll = async (state) => {
    try {
      await axios.post(`http://localhost:8888/devices/toggle-all?state=${state}`);
      refreshDevices();
    } catch (err) {
      console.error("Toggle all failed:", err);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-4 py-3">
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
      </div>
    </nav>
  );
}
