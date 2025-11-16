import React, { useEffect, useState } from "react";
import "../styles/weather.css";

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);

  const API_KEY = "966eec9ee9f43a1f1e22d2ad78701854"; // ✅ Replace with OpenWeather API key
  const CITY = "Bangalore";       // ✅ or use auto-detect later

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch(console.error);
  }, []);

  if (!weather)
    return (
      <div className="weather-card loading-card">
        Loading weather...
      </div>
    );

  return (
    <div className="weather-card">
      <div className="weather-top">
        <h4>Weather</h4>
        <span className="weather-city">{weather.name}</span>
      </div>

      <div className="weather-main">
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt="icon"
          className="weather-icon"
        />
        <div className="weather-temp">{Math.round(weather.main.temp)}°C</div>
      </div>

      <div className="weather-bottom">
        <div>Humidity: {weather.main.humidity}%</div>
        <div>{weather.weather[0].description}</div>
      </div>
    </div>
  );
}
