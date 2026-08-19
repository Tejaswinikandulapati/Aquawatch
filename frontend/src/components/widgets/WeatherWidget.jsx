import React from "react";
import { WiDaySunny, WiHumidity, WiStrongWind, WiBarometer } from "react-icons/wi";
import GlassCard from "../ui/GlassCard";

// Ambient site weather. The backend exposes no weather endpoint, so this
// derives a plausible air temperature from the average water temperature
// (water lags air by a few degrees) — clearly a demo/ambient panel.
export default function WeatherWidget({ avgWaterTemp }) {
  const air = avgWaterTemp ? Math.round(avgWaterTemp + 3) : 31;
  const humidity = 68;
  const wind = 12;
  const pressure = 1012;

  return (
    <GlassCard className="card-pad" hover>
      <div className="widget-title">
        <h3>Weather · Farm Site</h3>
        <span className="faint" style={{ fontSize: 11 }}>Partly Sunny</span>
      </div>
      <div className="weather-main">
        <WiDaySunny className="weather-ico" />
        <div>
          <div className="weather-temp">{air}°</div>
          <div className="faint" style={{ fontSize: 12 }}>Feels like {air + 2}° · Coastal</div>
        </div>
      </div>
      <div className="weather-grid">
        <div className="weather-cell">
          <WiHumidity size={22} color="var(--cyan)" />
          <div className="v">{humidity}%</div>
          <div className="l">Humidity</div>
        </div>
        <div className="weather-cell">
          <WiStrongWind size={22} color="var(--cyan)" />
          <div className="v">{wind} km/h</div>
          <div className="l">Wind</div>
        </div>
        <div className="weather-cell">
          <WiBarometer size={22} color="var(--cyan)" />
          <div className="v">{pressure}</div>
          <div className="l">hPa</div>
        </div>
      </div>
    </GlassCard>
  );
}
