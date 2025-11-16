import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../lib/api";
import "../styles/theme.css";
import "../styles/dashboard.css";
import "../styles/modal.css";

export default function Schedules() {
  const [devices, setDevices] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [time, setTime] = useState("18:30");
  const [repeat, setRepeat] = useState(new Set(["MON", "TUE", "WED", "THU", "FRI"]));
  const [picked, setPicked] = useState({}); // deviceId -> "ON"/"OFF"

  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const load = async () => {
    try {
      const [d, s] = await Promise.all([
        api.get("/devices"),
        api.get("/schedules")
      ]);
      setDevices(Array.isArray(d.data) ? d.data : []);
      setSchedules(Array.isArray(s.data) ? s.data : []);
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleDay = (d) => {
    const next = new Set(repeat);
    next.has(d) ? next.delete(d) : next.add(d);
    setRepeat(next);
  };

  const setAction = (id, val) => {
    setPicked((prev) => ({ ...prev, [id]: val }));
  };

  const create = async (e) => {
    e.preventDefault();
    const actions = Object.entries(picked)
      .filter(([, v]) => v === "ON" || v === "OFF")
      .map(([k, v]) => ({ deviceId: Number(k), action: v }));

    if (actions.length === 0) return alert("Pick at least one device action");

    const body = {
      name: name || "Routine",
      time,
      repeatDays: repeat.size ? Array.from(repeat) : ["ONCE"],
      enabled: true,
      actions,
    };
    await api.post("/schedules", body);
    setOpen(false);
    setName("");
    setTime("18:30");
    setRepeat(new Set(["MON", "TUE", "WED", "THU", "FRI"]));
    setPicked({});
    load();
  };

  const remove = async (id) => {
    await api.delete(`/schedules/${id}`);
    load();
  };

  const toggleEnabled = async (id, enabled) => {
    await api.patch(`/schedules/${id}/enabled?enabled=${!enabled}`);
    load();
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <Topbar />

        <section className="card section-container">
          <div className="section-title">
            <h3 style={{ margin: 0 }}>Schedules</h3>
            <button className="btn btn-accent" onClick={() => setOpen(true)}>
              + New Schedule
            </button>
          </div>

          {/* List */}
          <div className="list" style={{ marginTop: 12, display: "grid", gap: 12 }}>
            {schedules.map((s) => (
              <div key={s.id} className="card" style={{ padding: 14, display: "grid", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 600 }}>{s.name}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-sm" onClick={() => toggleEnabled(s.id, s.enabled)}>
                      {s.enabled ? "Disable" : "Enable"}
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => remove(s.id)}>
                      Delete
                    </button>
                  </div>
                </div>
                <div style={{ opacity: 0.8 }}>
                  Time: <b>{s.time}</b> • Repeat: <b>{s.repeatDays}</b> • Status:{" "}
                  <b>{s.enabled ? "ON" : "OFF"}</b>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {s.actions?.map((a) => (
                    <span
                      key={a.id}
                      className="badge"
                      style={{
                        background: "#111827",
                        border: "1px solid rgba(255,255,255,.08)",
                        borderRadius: 999,
                        padding: "4px 10px",
                      }}
                    >
                      #{a.deviceId} → {a.action}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {!schedules.length && <div style={{ opacity: 0.7 }}>No schedules yet.</div>}
          </div>
        </section>

        {/* ✅ Create modal */}
        {open && (
          <div className="modal-backdrop-smart" onClick={() => setOpen(false)}>
            <div
              className="modal-card-smart"
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: "80vh", overflowY: "auto" }}
            >
              <h3 style={{ marginTop: 0 }}>New Schedule</h3>

              <form onSubmit={create} className="modal-form">
                <label>Name</label>
                <input
                  className="input-smart"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Evening routine"
                />

                <label>Time</label>
                <input
                  className="input-smart"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />

                <label>Repeat Days</label>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: 12,
                  }}
                >
                  {days.map((d) => (
                    <button
                      type="button"
                      key={d}
                      className="btn-smart"
                      style={{
                        padding: "8px 12px",
                        borderRadius: 999,
                        background: repeat.has(d)
                          ? "var(--accent)"
                          : "rgba(255,255,255,.06)",
                        color: repeat.has(d) ? "#000" : "#fff",
                        border: "1px solid rgba(255,255,255,.12)",
                      }}
                      onClick={() => toggleDay(d)}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                {/* ✅ Devices & Actions (Enhanced Spacing + Fat Card) */}
<label>Devices & Actions</label>
{devices.length === 0 ? (
  <p style={{ opacity: 0.6, marginBottom: 8 }}>
    No devices available. Please add one first.
  </p>
) : (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: 14,
      maxHeight: 280,
      overflowY: "auto",
      paddingRight: 6,
      paddingBottom: 8,
      scrollbarWidth: "thin"
    }}
  >
    {devices.map((d) => (
      <div
        key={d.id}
        className="card"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "14px 16px",
          borderRadius: 16,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          minHeight: 100, /* 👈 makes the card “fatter” */
          transition: "all 0.25s ease",
          boxShadow: "0 0 8px rgba(0,0,0,0.25)"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>{d.name}</span>
            <span
              style={{
                display: "block",
                opacity: 0.7,
                fontSize: 13,
                marginTop: 4
              }}
            >
              {d.room} • {d.type}
            </span>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setAction(d.id, "ON")}
              style={{
                opacity: picked[d.id] === "ON" ? 1 : 0.6,
                padding: "6px 10px",
                fontSize: 13,
                borderRadius: 8,
              }}
            >
              ON
            </button>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setAction(d.id, "OFF")}
              style={{
                opacity: picked[d.id] === "OFF" ? 1 : 0.6,
                padding: "6px 10px",
                fontSize: 13,
                borderRadius: 8,
              }}
            >
              OFF
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
)}

                <div className="modal-actions-smart">
                  <button
                    type="button"
                    className="btn-smart btn-cancel"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-smart btn-save">
                    Save Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
