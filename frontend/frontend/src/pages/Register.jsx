import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("info"); // success, danger, warning
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Validate before submitting
  const validateForm = async () => {
    const { name, username, email, password } = formData;

    if (!name || !username || !email || !password) {
      setAlertType("warning");
      setMessage("⚠️ Please fill in all fields!");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setAlertType("warning");
      setMessage("⚠️ Please enter a valid email address!");
      return false;
    }

    try {
      // ✅ Check if email already exists
      const res = await fetch("http://localhost:8888/api/users");
      const users = await res.json();
      const exists = users.some((user) => user.email === email);
      if (exists) {
        setAlertType("danger");
        setMessage("❌ Email already registered. Please log in instead!");
        return false;
      }
    } catch (error) {
      console.error("Error checking email:", error);
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) return;

    setAlertType("info");
    setMessage("⏳ Registering...");

    try {
      const response = await fetch("http://localhost:8888/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setAlertType("success");
        setMessage("✅ Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        const data = await response.json();
        setAlertType("danger");
        setMessage(`❌ Registration failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setAlertType("danger");
      setMessage("❌ Failed to connect to backend!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="auth-card p-5 shadow-lg bg-white rounded" style={{ width: "450px" }}>
        <h2 className="text-center mb-4 fw-bold text-dark">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2">
            Register
          </button>
        </form>

        {message && (
          <div className={`alert alert-${alertType} mt-4 text-center`} role="alert">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
