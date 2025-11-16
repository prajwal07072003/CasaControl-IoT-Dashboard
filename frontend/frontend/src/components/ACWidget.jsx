import React, { useState } from "react";
import { FaPowerOff, FaSnowflake } from "react-icons/fa";
import "../styles/acwidget.css";

export default function ACWidget({ initialTemp = 24 }) {
  const [isOn, setIsOn] = useState(false);
  const [temperature, setTemperature] = useState(initialTemp);

  const togglePower = () => setIsOn(!isOn);
  const handleTempChange = (e) => setTemperature(parseInt(e.target.value));

  return (
    <div className={`ac-card-small ${isOn ? "active" : ""}`}>
      <div className="ac-top">
        <FaSnowflake className="ac-icon" />
        <h3 className="ac-title">AC Control</h3>
      </div>

      <div className="ac-center">
        <div className={`power-btn ${isOn ? "on" : ""}`} onClick={togglePower}>
          <FaPowerOff />
        </div>
        <p className="power-text">{isOn ? "On" : "Off"}</p>
      </div>

      <div className="ac-temp-section">
        <p>Temperature</p>
        <h2 className="temp-value">{temperature}°C</h2>
        <input
          type="range"
          min="16"
          max="30"
          value={temperature}
          onChange={handleTempChange}
          className="temp-slider"
        />
      </div>
    </div>
  );
}
