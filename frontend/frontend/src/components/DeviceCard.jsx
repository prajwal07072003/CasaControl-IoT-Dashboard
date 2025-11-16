import React, { useState } from "react";
import {
  FaEllipsisV,
  FaLightbulb,
  FaFan,
  FaSnowflake,
  FaTv,
  FaFireAlt,
  FaBlender
} from "react-icons/fa";

export default function DeviceCard({ device, onToggle, onOptions }) {
  const [animating, setAnimating] = useState(false);

  const name = (device.name || "").toLowerCase();
  const icon =
    name.includes("fan") ? <FaFan /> :
    name.includes("ac") ? <FaSnowflake /> :
    name.includes("tv") ? <FaTv /> :
    name.includes("heater") ? <FaFireAlt /> :
    name.includes("fridge") ? <FaBlender /> :
    <FaLightbulb />;

  const triggerToggle = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 450); // animation reset
    onToggle(device);
  };

  return (
    <div
      className={`device-card ${device.status ? "on" : "off"} ${animating ? "anim" : ""}`}
      onClick={triggerToggle}
    >
      {/* ✅ 3-dot menu button */}
      <div className="device-card-header">
        <FaEllipsisV
          className="device-menu"
          onClick={(e) => {
            e.stopPropagation();   // stop toggle when clicking menu
            onOptions?.(device);
          }}
        />
      </div>

      {/* ✅ Icon + name + status */}
      <div className="device-icon">{icon}</div>
      <div className="device-name">{device.name}</div>
      <div className="device-status">{device.status ? "On" : "Off"}</div>

      {/* ✅ ripple */}
      <span className="ripple"></span>
    </div>
  );
}
