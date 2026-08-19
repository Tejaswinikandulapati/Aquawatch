import React from "react";
import GlassCard from "../ui/GlassCard";
import { RANGES } from "../../utils/derive";

function Bar({ label, value, unit, min, max, hard, grad }) {
  const [lo, hi] = hard;
  const pct = value == null ? 0 : Math.max(0, Math.min(100, ((value - lo) / (hi - lo)) * 100));
  const ok = value != null && value >= min && value <= max;
  return (
    <div className="env-bar-wrap">
      <div className="env-bar-top">
        <span className="muted">{label}</span>
        <span style={{ fontWeight: 700, color: ok ? "var(--text)" : "var(--warn)" }}>
          {value != null ? `${value} ${unit}` : "—"}
        </span>
      </div>
      <div className="env-bar">
        <span style={{ width: `${pct}%`, background: grad }} />
      </div>
    </div>
  );
}

// avg = { temperature, ph, dissolved_oxygen, ammonia }
export default function EnvironmentSummary({ avg }) {
  return (
    <GlassCard className="card-pad" hover>
      <div className="widget-title"><h3>Environmental Summary</h3></div>
      <Bar label="Temperature" value={avg.temperature} unit="°C"
        min={RANGES.temperature.min} max={RANGES.temperature.max} hard={RANGES.temperature.hard}
        grad="var(--grad-cyan)" />
      <Bar label="pH Level" value={avg.ph} unit=""
        min={RANGES.ph.min} max={RANGES.ph.max} hard={RANGES.ph.hard}
        grad="var(--grad-blue)" />
      <Bar label="Dissolved Oxygen" value={avg.dissolved_oxygen} unit="mg/L"
        min={RANGES.dissolved_oxygen.min} max={RANGES.dissolved_oxygen.max} hard={RANGES.dissolved_oxygen.hard}
        grad="var(--grad-green)" />
      <Bar label="Ammonia" value={avg.ammonia} unit="mg/L"
        min={RANGES.ammonia.min} max={RANGES.ammonia.max} hard={RANGES.ammonia.hard}
        grad="var(--grad-warm)" />
      <p className="faint" style={{ fontSize: 11, marginTop: 4 }}>
        Bars show current averages within safe operating bounds.
      </p>
    </GlassCard>
  );
}
