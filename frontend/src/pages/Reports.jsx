import React from "react";
import { FiDownload, FiFileText, FiDatabase } from "react-icons/fi";
import PageHeader from "../components/ui/PageHeader";
import GlassCard from "../components/ui/GlassCard";
import { useAqua } from "../context/AquaDataContext";
import {
  latestByPond, waterQualityScore, healthStatus, avgQualityScore, avgOf,
} from "../utils/derive";

function download(name, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const { ponds, readings, alerts, feedingLogs, summary } = useAqua();
  const byPond = latestByPond(readings);

  const rows = ponds.map((p) => {
    const r = byPond[p.id];
    return {
      pond: p.name, species: p.species || "", location: p.location || "",
      temperature: r?.temperature ?? "", ph: r?.ph ?? "",
      dissolved_oxygen: r?.dissolved_oxygen ?? "", ammonia: r?.ammonia ?? "",
      quality_score: waterQualityScore(r) ?? "", status: healthStatus(r).label,
    };
  });

  const exportCSV = () => {
    const headers = Object.keys(rows[0] || { pond: "" });
    const csv = [headers.join(",")]
      .concat(rows.map((row) => headers.map((h) => `"${row[h]}"`).join(",")))
      .join("\n");
    download("aquawatch-ponds-report.csv", csv, "text/csv");
  };

  const exportJSON = () => {
    const payload = {
      generated_at: new Date().toISOString(),
      summary: {
        ...summary,
        avg_ph: avgOf(readings, "ph"),
        avg_ammonia: avgOf(readings, "ammonia"),
        water_quality_score: avgQualityScore(readings),
      },
      ponds: rows,
      active_alerts: alerts.length,
      feeding_events: feedingLogs.length,
    };
    download("aquawatch-report.json", JSON.stringify(payload, null, 2), "application/json");
  };

  const cards = [
    { icon: <FiFileText />, title: "Pond Status Report", desc: "Per-pond readings, quality scores and health status.", action: exportCSV, label: "Export CSV", grad: "var(--grad-cyan)" },
    { icon: <FiDatabase />, title: "Full Operation Snapshot", desc: "Complete JSON export: summary, ponds, alerts, feeding.", action: exportJSON, label: "Export JSON", grad: "var(--grad-green)" },
  ];

  return (
    <>
      <PageHeader title="Reports" desc="Export operational data generated from live records" />

      <div className="grid-3" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", marginBottom: 22 }}>
        {cards.map((c, i) => (
          <GlassCard key={c.title} className="card-pad" hover delay={i * 0.06}>
            <div className="stat-icon" style={{ background: c.grad, marginBottom: 14 }}>{c.icon}</div>
            <h3 style={{ fontSize: 17 }}>{c.title}</h3>
            <p className="faint" style={{ fontSize: 13, margin: "8px 0 16px", lineHeight: 1.5 }}>{c.desc}</p>
            <button className="btn" onClick={c.action}><FiDownload /> {c.label}</button>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="card-pad" hover>
        <div className="widget-title"><h3>Report Preview · Pond Status</h3></div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 720 }}>
            <thead>
              <tr style={{ color: "var(--text-faint)", textAlign: "left" }}>
                {["Pond", "Species", "Temp", "pH", "DO", "NH₃", "Score", "Status"].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", borderBottom: "1px solid var(--glass-border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                  <td style={cell}>{r.pond}</td>
                  <td style={cell}>{r.species || "—"}</td>
                  <td style={cell}>{r.temperature || "—"}</td>
                  <td style={cell}>{r.ph || "—"}</td>
                  <td style={cell}>{r.dissolved_oxygen || "—"}</td>
                  <td style={cell}>{r.ammonia || "—"}</td>
                  <td style={{ ...cell, color: "var(--cyan)", fontWeight: 700 }}>{r.quality_score || "—"}</td>
                  <td style={cell}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </>
  );
}

const cell = { padding: "11px 12px" };
