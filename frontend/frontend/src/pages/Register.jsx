import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import "../styles/auth.css";

export default function Register() {
  const [form, setForm] = useState({ email: "", name: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setMsg("Registration failed. Try again.");
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-card glass-card" onSubmit={submit}>
        <h2>Create Account</h2>

        <input 
          type="text" 
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input 
          type="email" 
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input 
          type="password" 
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button className="btn-glow">Register</button>

        {msg && <p className="auth-error">{msg}</p>}
      </form>
    </div>
  );
}
