import React, { useState } from "react";
import { FiThermometer, FiActivity, FiWind, FiZap, FiCpu } from "react-icons/fi";
import PageHeader from "../components/ui/PageHeader";
import GlassCard from "../components/ui/GlassCard";
import TrendChart from "../components/charts/TrendChart";
import { useAqua } from "../context/AquaDataContext";
import { trendSeries, fmtTime, latestByPond } from "../utils/derive";

export default function Sensors() {
  const { ponds, readings, simulateReading } = useAqua();
  const [pondId, setPondId] = useState("all");

  const filtered = pondId === "all" ? readings : readings.filter((r) => r.pond_id === +pondId);
  const byPond = latestByPond(readings);
  const online = Object.keys(byPond).length;
  const pondName = (id) => ponds.find((p) => p.id === id)?.name || `Pond ${id}`;

  return (
    <>
      <PageHeader
        title="Sensors"
        desc="Live sensor telemetry across all ponds"
        actions={<span className="live-tag"><span className="live-dot" /> {online} sensors online</span>}
      />

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <button className={pondId === "all" ? "btn btn-sm" : "btn btn-ghost btn-sm"} onClick={() => setPondId("all")}>
          All Ponds
        </button>
        {ponds.map((p) => (
          <button key={p.id} className={pondId === String(p.id) ? "btn btn-sm" : "btn btn-ghost btn-sm"} onClick={() => setPondId(String(p.id))}>
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", marginBottom: 20 }}>
        <GlassCard className="card-pad" hover>
          <div className="section-title"><FiThermometer /> Temperature</div>
          <TrendChart data={trendSeries(filtered, "temperature")} color="#22d3ee" unit="°C" height={160} id="s-temp" />
        </GlassCard>
        <GlassCard className="card-pad" hover>
          <div className="section-title"><FiActivity /> pH</div>
          <TrendChart data={trendSeries(filtered, "ph")} color="#60a5fa" height={160} id="s-ph" />
        </GlassCard>
        <GlassCard className="card-pad" hover>
          <div className="section-title"><FiWind /> Dissolved O₂</div>
          <TrendChart data={trendSeries(filtered, "dissolved_oxygen")} color="#34d399" unit=" mg/L" height={160} id="s-do" />
        </GlassCard>
      </div>

      <GlassCard className="card-pad" hover>
        <div className="widget-title">
          <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}><FiCpu color="var(--cyan)" /> Raw Readings Feed</h3>
          {pondId !== "all" && (
            <button className="btn btn-ghost btn-sm" onClick={() => simulateReading(+pondId)}>
              <FiZap /> Simulate
            </button>
          )}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 620 }}>
            <thead>
              <tr style={{ color: "var(--text-faint)", textAlign: "left" }}>
                {["Time", "Pond", "Temp °C", "pH", "DO mg/L", "NH₃ mg/L"].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", fontWeight: 600, borderBottom: "1px solid var(--glass-border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 20).map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                  <td style={cell}>{fmtTime(r.recorded_at)}</td>
                  <td style={cell}>{pondName(r.pond_id)}</td>
                  <td style={cell}>{r.temperature}</td>
                  <td style={cell}>{r.ph}</td>
                  <td style={cell}>{r.dissolved_oxygen}</td>
                  <td style={cell}>{r.ammonia}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="empty">No readings yet</p>}
        </div>
      </GlassCard>
    </>
  );
}

const cell = { padding: "10px 12px" };
