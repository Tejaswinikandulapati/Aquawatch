import React from "react";
import GlassCard from "../ui/GlassCard";

function scoreColor(s) {
  if (s == null) return "#6f93a5";
  if (s >= 80) return "#34d399";
  if (s >= 60) return "#22d3ee";
  if (s >= 40) return "#fbbf24";
  return "#fb7185";
}
function scoreLabel(s) {
  if (s == null) return "No Data";
  if (s >= 80) return "Excellent";
  if (s >= 60) return "Good";
  if (s >= 40) return "Fair";
  return "Poor";
}

// Circular SVG gauge for the aggregate water-quality score.
export default function WaterQualityWidget({ score }) {
  const pct = score ?? 0;
  const R = 50, C = 2 * Math.PI * R;
  const color = scoreColor(score);

  return (
    <GlassCard className="card-pad" hover>
      <div className="widget-title"><h3>Water Quality Index</h3></div>
      <div className="gauge-wrap">
        <div className="gauge">
          <svg width="118" height="118" viewBox="0 0 118 118">
            <circle cx="59" cy="59" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
            <circle
              cx="59" cy="59" r={R} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C - (C * pct) / 100}
              transform="rotate(-90 59 59)"
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>
          <div className="g-center">
            <div>
              <div className="g-num" style={{ color }}>{score ?? "—"}</div>
              <div className="g-lab">/ 100</div>
            </div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color }}>{scoreLabel(score)}</div>
          <p className="faint" style={{ fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>
            Composite of temperature, pH, dissolved oxygen &amp; ammonia across all active ponds.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
