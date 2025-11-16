import React, { useState } from "react";
import api from "../lib/api";

export default function LightBrightnessWidget({ device }) {
  const [value, setValue] = useState(50);

  const update = async (v) => {
    setValue(v);
    await api.post(`/devices/${device.id}/brightness?value=${v}`);
  };

  return (
    <div className="widget-card">
      <h4>Brightness</h4>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => update(e.target.value)}
        className="slider"
      />
      <div>{value}%</div>
    </div>
  );
}
