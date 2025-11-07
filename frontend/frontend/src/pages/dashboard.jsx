import React, { useEffect, useState } from "react";
import axios from "axios";
import DeviceCard from "../components/DeviceCard";
import Navbar from "../components/Navbar";
import "../styles/theme.css";

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDevices = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const res = await axios.get("http://localhost:8888/devices");

      // ✅ Compare with existing data before re-rendering
      const newData = res.data;
      const hasChanged =
        JSON.stringify(newData) !== JSON.stringify(devices);

      if (hasChanged) {
        setDevices(newData);
      }
    } catch (err) {
      console.error("Error fetching devices:", err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  const toggleDevice = async (device) => {
    try {
      await axios.post(
        `http://localhost:8888/devices/toggle/${device.topic.split("/").pop()}?state=${!device.status}`
      );
      fetchDevices();
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  useEffect(() => {
    fetchDevices(true); // initial load with spinner
    const interval = setInterval(() => fetchDevices(false), 2000); // silent refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column bg-dark">
      <Navbar refreshDevices={() => fetchDevices(true)} />

      <div className="flex-grow-1 d-flex justify-content-center align-items-center text-white">
        {loading ? (
          <div
            className="d-flex flex-column align-items-center justify-content-center"
            style={{ minHeight: "60vh" }}
          >
            <div
              className="spinner-border text-info mb-3"
              style={{ width: "3rem", height: "3rem" }}
            ></div>
            <p className="fs-5">Loading devices...</p>
          </div>
        ) : (
          <div className="container-fluid py-5 fade-in">
            <div className="d-flex flex-wrap justify-content-center align-items-center gap-4">
              {devices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onToggle={toggleDevice}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
