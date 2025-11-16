import React, { useState } from "react";
import api from "../lib/api";
import { FaPlusCircle } from "react-icons/fa";

const ROOM_OPTIONS = ["Living Room", "Bedroom", "Kitchen", "Hall", "Balcony", "Office"];
const TYPE_OPTIONS = ["LIGHT", "FAN", "AC", "TV", "HEATER", "FRIDGE"];

export default function AddDeviceModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    room: ROOM_OPTIONS[0],
    type: TYPE_OPTIONS[0],
  });

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  if (!open) return null;

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");

    try {
      const res = await api.post("/devices/add", form);

      setMsg("✅ Device added!");
      onCreated?.(res.data);

      setTimeout(() => {
        setForm({ name: "", room: ROOM_OPTIONS[0], type: TYPE_OPTIONS[0] });
        onClose?.();
      }, 800);
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to add device");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop-smart" onClick={onClose}>
      <div className="modal-card-smart" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header-smart">
          <FaPlusCircle className="modal-icon" />
          <h3>Add New Device</h3>
        </div>

        <form onSubmit={submit} className="modal-form">
          
          <label>Name</label>
          <input
            className="input-smart"
            placeholder="Sofa Lamp"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
          />

          <label>Room</label>
          <select
            className="select-smart"
            value={form.room}
            onChange={(e) => set("room", e.target.value)}
          >
            {ROOM_OPTIONS.map(r => <option key={r}>{r}</option>)}
          </select>

          <label>Type</label>
          <select
            className="select-smart"
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
          >
            {TYPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
          </select>

          {msg && <div className="alert-smart">{msg}</div>}

          <div className="modal-actions-smart">
            <button
              type="button"
              className="btn-smart btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-smart btn-save"
              disabled={busy}
            >
              {busy ? "Saving…" : "Save Device"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
