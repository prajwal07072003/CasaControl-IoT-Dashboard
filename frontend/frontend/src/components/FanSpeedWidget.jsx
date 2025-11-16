import React, { useState } from "react";
import api from "../lib/api";

export default function FanSpeedWidget({ device }) {
  const [speed, setSpeed] = useState(1);

  const update = async (s) => {
    setSpeed(s);
    await api.post(`/devices/${device.id}/speed?level=${s}`);
  };

  return (
    <div className="widget-card">
      <h4>Fan Speed</h4>
      <div className="speed-buttons">
        {[1,2,3,4,5].map(n => (
          <button
            key={n}
            className={speed === n ? "active-speed" : ""}
            onClick={() => update(n)}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
