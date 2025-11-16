import React, { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import mqtt from "mqtt";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DeviceCard from "../components/DeviceCard";
import AddDeviceModal from "../components/AddDeviceModal";
import DeviceOptionsModal from "../components/DeviceOptionsModal";

import WeatherWidget from "../components/WeatherWidget";
import ACWidget from "../components/ACWidget";
import FanDialWidget from "../components/FanDialWidget";
import ScenesWidget from "../components/ScenesWidget";

import "../styles/theme.css";
import "../styles/dashboard.css";
import "../styles/topbar.css";
import "../styles/sidebar.css";
import "../styles/modal.css";

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [targetDevice, setTargetDevice] = useState(null);

  const acDevice = useMemo(
    () => devices.find((d) => /ac/i.test(d.type) || /ac/i.test(d.name)),
    [devices]
  );
  const fanDevice = useMemo(
    () => devices.find((d) => /fan/i.test(d.type) || /fan/i.test(d.name)),
    [devices]
  );

  const fetchDevices = async (initial = false) => {
    try {
      if (initial) setLoading(true);
      const res = await api.get("/devices");
      setDevices(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      if (e?.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
      }
    } finally {
      if (initial) setLoading(false);
    }
  };

  const toggleDevice = async (d) => {
    await api.post(`/devices/toggle/${d.id}?state=${!d.status}`);
    fetchDevices();
  };

  const deleteDevice = async (id) => {
    await api.delete(`/devices/${id}`);
    setOptionsOpen(false);
    fetchDevices(true);
  };

  // ✅ Fetch devices on load
  useEffect(() => {
    fetchDevices(true);
  }, []);

  // ✅ MQTT live updates
  useEffect(() => {
    const client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");

    client.on("connect", () => {
      console.log("[MQTT] Connected to broker");
      devices.forEach((d) => {
        const topic = `/home/${d.room?.toLowerCase()}/${d.name?.toLowerCase()}/status`;
        client.subscribe(topic, (err) => {
          if (!err) console.log("Subscribed to:", topic);
        });
      });
    });

    client.on("message", (topic, msg) => {
      const message = msg.toString();
      console.log("📩 MQTT Message:", topic, message);
      setDevices((prev) =>
        prev.map((d) =>
          topic.includes(d.name?.toLowerCase())
            ? { ...d, status: message === "ON" }
            : d
        )
      );
    });

    client.on("error", (err) => console.error("[MQTT] Error:", err));
    return () => client.end();
  }, [devices.length]);

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main">
        <Topbar onRefresh={() => fetchDevices(true)} />

        {/* ✅ Greeting Section */}
        <section className="welcome-section card">
          <h3>
            Welcome back, {localStorage.getItem("email") || "Homeowner"} 👋
          </h3>
          <p style={{ opacity: 0.8 }}>
            It’s{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            — your home is feeling cozy ✨
          </p>
        </section>

        {/* ======= HERO Section with Widgets ======= */}
        <section className="hero hero-two">
          <div className="tile card">
            <h3 style={{ margin: 0 }}>
              Devices <b>{devices.length}</b> • Live Status ⚡
            </h3>
            <p style={{ color: "var(--muted)", marginTop: 6 }}>
              Control and monitor your smart devices in real-time.
            </p>
          </div>

          <div className="widget-row">
            <div className="widget-slot">
              <WeatherWidget />
            </div>

            {acDevice && (
              <div className="widget-slot">
                <ACWidget device={acDevice} />
              </div>
            )}

            {fanDevice && (
              <div className="widget-slot">
                <FanDialWidget device={fanDevice} initial={3} />
              </div>
            )}

            <div className="widget-slot">
              <ScenesWidget devices={devices} />
            </div>
          </div>
        </section>

        {/* ======= DEVICE GRID ======= */}
        <section className="card section-container">
          <div className="section-title">
            <h3 style={{ margin: 0 }}>Devices</h3>
            <button
              className="btn btn-accent"
              onClick={() => setShowAdd(true)}
            >
              + Add Device
            </button>
          </div>

          {loading ? (
            <div className="loader-center">
              <div className="spinner-border" />
            </div>
          ) : (
            <div className="device-grid">
              {devices.map((device) => (
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
              {!devices.length && (
                <div
                  style={{
                    opacity: 0.7,
                    textAlign: "center",
                    marginTop: 20,
                    fontSize: 15,
                  }}
                >
                  No devices found. Add one to get started!
                </div>
              )}
            </div>
          )}
        </section>

        {/* ======= MODALS ======= */}
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
          onEdit={() => setOptionsOpen(false)}
        />
      </main>
    </div>
  );
}
