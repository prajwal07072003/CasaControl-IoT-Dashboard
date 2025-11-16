import React, { useEffect, useState } from "react";
import api from "../lib/api";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DeviceCard from "../components/DeviceCard";
import DeviceOptionsModal from "../components/DeviceOptionsModal";
import AddDeviceModal from "../components/AddDeviceModal";

import "../styles/dashboard.css";
import "../styles/modal.css";

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // ✅ Modals
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [targetDevice, setTargetDevice] = useState(null);

  // ✅ Fetch devices
  const fetchDevices = async (initial = false) => {
    try {
      if (initial) setLoading(true);
      const res = await api.get("/devices");
      setDevices(res.data || []);
    } catch (e) {
      if (e.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
      }
    } finally {
      if (initial) setLoading(false);
    }
  };

  // ✅ Toggle device
  const toggleDevice = async (d) => {
    const id = d.id;
    await api.post(`/devices/toggle/${id}?state=${!d.status}`);
    fetchDevices();
  };

  // ✅ Delete device
  const deleteDevice = async (id) => {
    try {
      await api.delete(`/devices/${id}`);
      fetchDevices(true);
    } catch (err) {
      console.error("Delete failed:", err);
    }
    setOptionsOpen(false);
  };

  useEffect(() => {
    fetchDevices(true);
  }, []);

  // ✅ Filter devices by search query
  const filteredDevices = devices.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main">
        <Topbar onRefresh={() => fetchDevices(true)} />

        <section className="section-container card">
          <div className="section-title">
            <h3 style={{ margin: 0 }}>All Devices</h3>

            <button
              className="btn btn-accent"
              onClick={() => setShowAdd(true)}
              style={{ marginLeft: "auto" }}
            >
              + Add Device
            </button>
          </div>

          {/* ✅ Search Bar */}
          <input
            type="text"
            placeholder="Search devices..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              marginBottom: 12,
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "10px 14px",
              width: "100%",
            }}
          />

          {loading ? (
            <div className="loader-center">
              <div className="spinner-border"></div>
            </div>
          ) : (
            <div className="device-grid">
              {filteredDevices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onToggle={toggleDevice}
                  onOptions={(dev) => {
                    setTargetDevice(dev);
                    setOptionsOpen(true);
                  }}
                />
              ))}

              {/* ✅ If no devices */}
              {!filteredDevices.length && (
                <div
                  style={{
                    opacity: 0.7,
                    textAlign: "center",
                    marginTop: 20,
                    fontSize: 15,
                  }}
                >
                  No matching devices found 😴
                </div>
              )}
            </div>
          )}
        </section>

        {/* ✅ Modals */}
        <AddDeviceModal
          open={showAdd}
          onClose={() => setShowAdd(false)}
          onCreated={() => fetchDevices(true)}
        />

        <DeviceOptionsModal
          open={optionsOpen}
          device={targetDevice}
          onClose={() => setOptionsOpen(false)}
          onDelete={deleteDevice}
        />
      </main>
    </div>
  );
}
