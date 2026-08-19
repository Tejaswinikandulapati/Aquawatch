import React from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiEye, FiZap } from "react-icons/fi";
import Badge from "../ui/Badge";
import { healthStatus, fishFor, bannerFor } from "../../utils/derive";

function Metric({ label, value, warn }) {
  return (
    <div className="metric">
      <span className="m-val" style={warn ? { color: "var(--danger-soft)" } : {}}>{value}</span>
      <span className="m-lab">{label}</span>
    </div>
  );
}

export default function PondCard({ pond, reading, onView, onSimulate, index = 0 }) {
  const health = healthStatus(reading);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass glass-hover pond-card"
    >
      <div className="pond-banner" style={{ background: bannerFor(pond.id) }}>
        <span className="fish-emoji">{fishFor(pond.id)}</span>
        <h3>{pond.name}</h3>
      </div>

      <div className="pond-body">
        <div className="pond-species">
          <span>{pond.species || "Unspecified"}</span>
          <span className="faint">·</span>
          <FiMapPin size={12} /> {pond.location || "—"}
        </div>

        {reading ? (
          <div className="metric-grid">
            <Metric label="Temp" value={`${reading.temperature}°C`} warn={reading.temperature < 24 || reading.temperature > 32} />
            <Metric label="Diss. O₂" value={`${reading.dissolved_oxygen} mg/L`} warn={reading.dissolved_oxygen < 4} />
            <Metric label="pH" value={reading.ph} warn={reading.ph < 6.5 || reading.ph > 8.5} />
            <Metric label="Ammonia" value={`${reading.ammonia} mg/L`} warn={reading.ammonia > 0.5} />
          </div>
        ) : (
          <p className="empty" style={{ padding: "14px 0" }}>No sensor data yet</p>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <Badge level={health.level} label={health.label} />
          <span className="faint" style={{ fontSize: 11 }}>
            {pond.area_sqm ? `${pond.area_sqm} m²` : ""}
          </span>
        </div>

        <div className="pond-actions">
          <button className="btn btn-ghost" onClick={() => onSimulate(pond.id)}>
            <FiZap /> Simulate
          </button>
          <button className="btn" onClick={() => onView(pond)}>
            <FiEye /> View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}
