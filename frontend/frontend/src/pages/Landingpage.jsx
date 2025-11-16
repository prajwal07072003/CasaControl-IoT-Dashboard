import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landingpage.css";
import logo from "../assets/logo.png";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      <div className="landing-glow"></div>

      <div className="landing-content">
        <img src={logo} alt="Zentra Logo" className="landing-logo" />

        <h1 className="landing-title">Zentra</h1>
        <p className="landing-tagline">Your Home. Your Vibe. Your Rizz.</p>

        <div className="landing-buttons">
          <button className="btn-primary" onClick={() => navigate("/login")}>
            Login
          </button>

          <button className="btn-outline" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
