import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ✅ Theme Provider
import { ThemeProvider } from "./context/ThemeContext.jsx";

// ✅ Pages
import LandingPage from "./pages/Landingpage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard";
import Devices from "./pages/devices";
import Schedules from "./pages/schedules";
import Settings from "./pages/settings";

// ✅ Styles
import "./styles/theme.css";
import "./styles/landingpage.css";
import "./index.css";

// ✅ Auth Protection
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

// ✅ Zentra App
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/devices"
            element={
              <ProtectedRoute>
                <Devices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedules"
            element={
              <ProtectedRoute>
                <Schedules />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
import { AnimatePresence, motion } from "framer-motion";

<AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>
    <Route
      path="/dashboard"
      element={
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
        >
          <Dashboard />
        </motion.div>
      }
    />
    {/* repeat for other pages */}
  </Routes>
</AnimatePresence>
