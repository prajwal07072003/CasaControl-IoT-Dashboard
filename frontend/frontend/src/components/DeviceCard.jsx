import React from "react";
import {
  FaLightbulb,
  FaFan,
  FaSnowflake,
  FaTv,
  FaFireAlt,
  FaBlender,
} from "react-icons/fa";

export default function DeviceCard({ device, onToggle }) {
  const name = device.name.toLowerCase();

  // 🌟 Dynamic icon selection
  let icon;
  if (name.includes("light")) icon = <FaLightbulb size={40} />;
  else if (name.includes("fan")) icon = <FaFan size={40} />;
  else if (name.includes("ac")) icon = <FaSnowflake size={40} />;
  else if (name.includes("tv")) icon = <FaTv size={40} />;
  else if (name.includes("heater")) icon = <FaFireAlt size={40} />;
  else if (name.includes("fridge")) icon = <FaBlender size={40} />;
  else icon = <FaLightbulb size={40} />;

  return (
    <div
      className={`device-card ${device.status ? "on" : "off"}`}
      onClick={() => onToggle(device)}
    >
      <div className="mb-2" style={{ fontSize: "2rem" }}>
        {icon}
      </div>
      <h6 className="fw-semibold mb-1">{device.name}</h6>
      <p className="small">{device.status ? "🟢 ON" : "🔴 OFF"}</p>
    </div>
  );
}
