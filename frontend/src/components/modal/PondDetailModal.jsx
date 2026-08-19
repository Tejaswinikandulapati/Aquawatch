import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiZap, FiMapPin, FiActivity } from "react-icons/fi";
import Badge from "../ui/Badge";
import TrendChart from "../charts/TrendChart";
import {
  healthStatus, fishFor, bannerFor, waterQualityScore, trendSeries, timeAgo,
} from "../../utils/derive";

export default function PondDetailModal({ pond, readings, onClose, onSimulate }) {
  return (
    <AnimatePresence>
      {pond && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal"
            style={{ position: "relative" }}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Content pond={pond} readings={readings} onClose={onClose} onSimulate={onSimulate} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Content({ pond, readings, onClose, onSimulate }) {
  const pondReadings = readings.filter((r) => r.pond_id === pond.id);
  const latest = pondReadings[0];
  const health = healthStatus(latest);
  const score = waterQualityScore(latest);

  return (
    <>
      <button className="modal-close" onClick={onClose}><FiX /></button>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, display: "grid", placeItems: "center",
          fontSize: 30, background: bannerFor(pond.id),
        }}>{fishFor(pond.id)}</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 22 }}>{pond.name}</h2>
          <div className="pond-species" style={{ marginTop: 4 }}>
            <span>{pond.species || "Unspecified"}</span>
            <span className="faint">·</span>
            <FiMapPin size={12} /> {pond.location || "—"}
            {pond.area_sqm ? <span className="faint">· {pond.area_sqm} m²</span> : null}
          </div>
        </div>
        <Badge level={health.level} label={health.label} />
      </div>

      {latest ? (
        <>
          <div className="metric-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            <Cell v={`${latest.temperature}°C`} l="Temperature" />
            <Cell v={latest.ph} l="pH Level" />
            <Cell v={`${latest.dissolved_oxygen}`} l="Diss. O₂ mg/L" />
            <Cell v={`${latest.ammonia}`} l="Ammonia mg/L" />
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center", margin: "16px 0" }}>
            <div style={{ fontSize: 13, color: "var(--text-dim)" }}>
              Water Quality Score
              <div style={{ fontSize: 30, fontWeight: 800, fontFamily: "Sora", color: "var(--cyan)" }}>
                {score ?? "—"}<span style={{ fontSize: 14, color: "var(--text-faint)" }}>/100</span>
              </div>
            </div>
            <span className="faint" style={{ fontSize: 12, marginLeft: "auto" }}>
              Updated {timeAgo(latest.recorded_at)}
            </span>
          </div>

          <div className="section-title" style={{ marginTop: 8 }}><FiActivity /> Temperature Trend</div>
          <TrendChart data={trendSeries(pondReadings, "temperature")} color="#22d3ee" unit="°C" height={180} id={`m-${pond.id}`} />
        </>
      ) : (
        <p className="empty">No sensor readings recorded for this pond yet.</p>
      )}

      <button className="btn" style={{ marginTop: 18 }} onClick={() => onSimulate(pond.id)}>
        <FiZap /> Simulate New Reading
      </button>
    </>
  );
}

function Cell({ v, l }) {
  return (
    <div className="metric">
      <span className="m-val">{v}</span>
      <span className="m-lab">{l}</span>
    </div>
  );
}
