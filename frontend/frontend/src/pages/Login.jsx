import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import "../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", email);
      navigate("/dashboard");
    } catch (err) {
      setMsg("Invalid login. Try again.");
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-card glass-card" onSubmit={submit}>
        <h2>Zentra Login</h2>

        <input 
          type="email" 
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn-glow">Login</button>

        {msg && <p className="auth-error">{msg}</p>}

        <p className="auth-link" onClick={() => navigate("/register")}>
          Don't have an account? Register →
        </p>
      </form>
    </div>
  );
}
