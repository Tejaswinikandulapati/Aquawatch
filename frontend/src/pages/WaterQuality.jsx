import React from "react";
import PageHeader from "../components/ui/PageHeader";
import GlassCard from "../components/ui/GlassCard";
import WaterQualityWidget from "../components/widgets/WaterQualityWidget";
import EnvironmentSummary from "../components/widgets/EnvironmentSummary";
import Badge from "../components/ui/Badge";
import { useAqua } from "../context/AquaDataContext";
import {
  avgOf, avgQualityScore, latestByPond, waterQualityScore, healthStatus, fishFor,
} from "../utils/derive";

export default function WaterQuality() {
  const { ponds, readings } = useAqua();
  const byPond = latestByPond(readings);
  const avg = {
    temperature: avgOf(readings, "temperature"),
    dissolved_oxygen: avgOf(readings, "dissolved_oxygen"),
    ph: avgOf(readings, "ph"),
    ammonia: avgOf(readings, "ammonia"),
  };

  return (
    <>
      <PageHeader title="Water Quality" desc="Composite quality scoring and safe-range monitoring" />

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <WaterQualityWidget score={avgQualityScore(readings)} />
        <EnvironmentSummary avg={avg} />
      </div>

      <GlassCard className="card-pad" hover>
        <div className="widget-title"><h3>Per-Pond Quality Breakdown</h3></div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 640 }}>
            <thead>
              <tr style={{ color: "var(--text-faint)", textAlign: "left" }}>
                {["Pond", "Temp", "pH", "DO", "NH₃", "Score", "Status"].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", borderBottom: "1px solid var(--glass-border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ponds.map((p) => {
                const r = byPond[p.id];
                const score = waterQualityScore(r);
                const h = healthStatus(r);
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                    <td style={cell}>{fishFor(p.id)} {p.name}</td>
                    <td style={cell}>{r ? `${r.temperature}°C` : "—"}</td>
                    <td style={cell}>{r ? r.ph : "—"}</td>
                    <td style={cell}>{r ? r.dissolved_oxygen : "—"}</td>
                    <td style={cell}>{r ? r.ammonia : "—"}</td>
                    <td style={{ ...cell, fontWeight: 700, color: "var(--cyan)" }}>{score ?? "—"}</td>
                    <td style={cell}><Badge level={h.level} label={h.label} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </>
  );
}

const cell = { padding: "11px 12px" };
