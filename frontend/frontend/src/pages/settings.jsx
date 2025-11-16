import React, { useContext, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/settings.css";

export default function Settings() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [newPassword, setNewPassword] = useState("");

  const handlePasswordUpdate = () => {
    if (!newPassword) {
      alert("Please enter a new password.");
      return;
    }
    alert("Password updated successfully!");
    setNewPassword("");
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <Topbar />
        <h2 className="settings-title">Settings</h2>
        <p className="settings-subtitle">
          Manage your Zentra profile and preferences
        </p>

        <div className="settings-grid">
          {/* Email */}
          <div className="settings-card">
            <h4>Email</h4>
            <input
              type="email"
              value="pprajwal716@gmail.com"
              readOnly
              className="input-field"
            />
          </div>

          {/* Password */}
          <div className="settings-card">
            <h4>Password</h4>
            <input
              type="password"
              placeholder="Enter new password"
              className="input-field"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button className="btn-accent" onClick={handlePasswordUpdate}>
              Update Password
            </button>
          </div>

          {/* Theme Toggle */}
          <div className="settings-card">
            <h4>Theme</h4>
            <div className="theme-toggle">
              <button
                className={`theme-btn ${theme === "dark" ? "active" : ""}`}
                onClick={() => setTheme("dark")}
              >
                🌙 Dark
              </button>
              <button
                className={`theme-btn ${theme === "light" ? "active" : ""}`}
                onClick={() => setTheme("light")}
              >
                ☀️ Light
              </button>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="btn-save">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
