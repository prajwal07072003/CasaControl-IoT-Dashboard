
import React, { useState } from "react";
import api from "../lib/api";

export default function ACTemperatureWidget({ device }) {
  const [temp, setTemp] = useState(24);

  const update = async (t) => {
    setTemp(t);
    await api.post(`/devices/${device.id}/temperature?temp=${t}`);
  };

  return (
    <div className="widget-card">
      <h4>AC Temperature</h4>
      <div className="temp-controls">
        <button onClick={() => update(temp - 1)}>-</button>
        <span>{temp}°C</span>
        <button onClick={() => update(temp + 1)}>+</button>
      </div>
    </div>
  );
}
