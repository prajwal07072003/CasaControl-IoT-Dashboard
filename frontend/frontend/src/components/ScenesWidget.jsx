import React, { useState } from "react";
import api from "../lib/api";

/**
 * Simple scene launcher:
 * - Pass the full devices array
 * - It will toggle by type/name keywords
 * Customize actions per scene below.
 */
export default function ScenesWidget({ devices = [] }) {
  const [busy, setBusy] = useState(false);

  const find = (pred) => devices.filter(pred);

  const runScene = async (scene) => {
    if (busy) return;
    setBusy(true);
    try {
      const tasks = [];
      if (scene === "movie") {
        // dim lights, fan speed 1, TV on if present
        for (const d of find(x => /light/i.test(x.type) || /light/i.test(x.name))) {
          tasks.push(api.post(`/devices/toggle/${d.id}?state=true`)); // ensure ON
        }
        for (const d of find(x => /tv/i.test(x.type) || /tv/i.test(x.name))) {
          tasks.push(api.post(`/devices/toggle/${d.id}?state=true`));
        }
        for (const d of find(x => /fan/i.test(x.type) || /fan/i.test(x.name))) {
          tasks.push(api.post(`/devices/${d.id}/speed?level=1`));
        }
      }
      if (scene === "relax") {
        // warm lights on, fan 2, AC 24
        for (const d of find(x => /light/i.test(x.type) || /light/i.test(x.name))) {
          tasks.push(api.post(`/devices/toggle/${d.id}?state=true`));
        }
        for (const d of find(x => /ac/i.test(x.type) || /ac/i.test(x.name))) {
          tasks.push(api.post(`/devices/${d.id}/temperature?temp=24`));
          tasks.push(api.post(`/devices/toggle/${d.id}?state=true`));
        }
        for (const d of find(x => /fan/i.test(x.type) || /fan/i.test(x.name))) {
          tasks.push(api.post(`/devices/${d.id}/speed?level=2`));
        }
      }
      if (scene === "sleep") {
        // everything off except bedroom fan speed 1 (best-effort)
        for (const d of devices) {
          tasks.push(api.post(`/devices/toggle/${d.id}?state=false`));
        }
        for (const d of find(x => /fan/i.test(x.type) || /fan/i.test(x.name))) {
          tasks.push(api.post(`/devices/${d.id}/speed?level=1`));
          tasks.push(api.post(`/devices/toggle/${d.id}?state=true`));
        }
      }
      await Promise.allSettled(tasks);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="widget card scenes-widget">
      <div className="widget-head">
        <div className="widget-title">Scenes</div>
        {busy && <div className="spinner tiny" />}
      </div>

      <div className="scene-row">
        <button className="scene-btn" onClick={() => runScene("movie")}>🎬 Movie</button>
        <button className="scene-btn" onClick={() => runScene("relax")}>🌙 Relax</button>
        <button className="scene-btn" onClick={() => runScene("sleep")}>😴 Sleep</button>
      </div>
      <div className="hint">One-tap routines. Fully customizable later.</div>
    </div>
  );
}
