import React, { useState } from "react";
import {
  FiDroplet, FiBell, FiThermometer, FiWind, FiActivity, FiShield, FiArrowRight,
} from "react-icons/fi";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import GlassCard from "../components/ui/GlassCard";
import PondCard from "../components/cards/PondCard";
import PondDetailModal from "../components/modal/PondDetailModal";
import TrendChart from "../components/charts/TrendChart";
import FeedingBarChart from "../components/charts/FeedingBarChart";
import WeatherWidget from "../components/widgets/WeatherWidget";
import WaterQualityWidget from "../components/widgets/WaterQualityWidget";
import FeedingLogsWidget from "../components/widgets/FeedingLogsWidget";
import AlertsWidget from "../components/widgets/AlertsWidget";
import EnvironmentSummary from "../components/widgets/EnvironmentSummary";
import { useAqua } from "../context/AquaDataContext";
import {
  latestByPond, avgOf, avgQualityScore, trendSeries, weeklyFeeding,
} from "../utils/derive";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { ponds, readings, alerts, feedingLogs, summary, simulateReading, resolveAlert } = useAqua();
  const [selected, setSelected] = useState(null);

  const byPond = latestByPond(readings);
  const avg = {
    temperature: summary.avg_temperature ?? avgOf(readings, "temperature"),
    dissolved_oxygen: summary.avg_dissolved_oxygen ?? avgOf(readings, "dissolved_oxygen"),
    ph: avgOf(readings, "ph"),
    ammonia: avgOf(readings, "ammonia"),
  };
  const wqScore = avgQualityScore(readings);

  const stats = [
    { icon: <FiDroplet />, label: "Total Ponds", value: summary.total_ponds ?? ponds.length, gradient: "var(--grad-cyan)", trend: 0 },
    { icon: <FiBell />, label: "Active Alerts", value: summary.active_alerts ?? alerts.length, gradient: "var(--grad-warm)", trend: alerts.length ? -1 * alerts.length : 0 },
    { icon: <FiThermometer />, label: "Avg Temperature", value: avg.temperature ?? "—", unit: "°C", gradient: "var(--grad-blue)", trend: 2 },
    { icon: <FiWind />, label: "Dissolved O₂", value: avg.dissolved_oxygen ?? "—", unit: "mg/L", gradient: "var(--grad-green)", trend: 1 },
    { icon: <FiActivity />, label: "pH Level", value: avg.ph ?? "—", gradient: "var(--grad-blue)", trend: 0 },
    { icon: <FiShield />, label: "Water Quality", value: wqScore ?? "—", unit: "/100", gradient: "var(--grad-green)", trend: 3 },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        desc="Live overview of your aquaculture operation"
        actions={<span className="live-tag"><span className="live-dot" /> Live · auto-refresh 8s</span>}
      />

      <div className="stat-grid">
        {stats.map((s, i) => <StatCard key={s.label} index={i} {...s} />)}
      </div>

      <div className="grid-2">
        <div className="col">
          <GlassCard className="card-pad" hover>
            <div className="widget-title">
              <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FiThermometer color="var(--cyan)" /> Temperature Trend
              </h3>
              <span className="faint" style={{ fontSize: 11 }}>last {Math.min(readings.length, 14)} readings</span>
            </div>
            <TrendChart data={trendSeries(readings, "temperature")} color="#22d3ee" unit="°C" id="dash-temp" />
          </GlassCard>

          <div className="grid-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <GlassCard className="card-pad" hover>
              <div className="section-title"><FiActivity /> pH Trend</div>
              <TrendChart data={trendSeries(readings, "ph")} color="#60a5fa" height={160} id="dash-ph" />
            </GlassCard>
            <GlassCard className="card-pad" hover>
              <div className="section-title"><FiWind /> Dissolved O₂ Trend</div>
              <TrendChart data={trendSeries(readings, "dissolved_oxygen")} color="#34d399" unit=" mg/L" height={160} id="dash-do" />
            </GlassCard>
          </div>

          <GlassCard className="card-pad" hover>
            <div className="widget-title">
              <h3>Weekly Feeding Analysis</h3>
              <Link to="/feeding" className="faint" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                Details <FiArrowRight />
              </Link>
            </div>
            <FeedingBarChart data={weeklyFeeding(feedingLogs)} />
          </GlassCard>
        </div>

        <div className="col">
          <WaterQualityWidget score={wqScore} />
          <WeatherWidget avgWaterTemp={avg.temperature} />
          <AlertsWidget alerts={alerts} ponds={ponds} onResolve={resolveAlert} limit={4} />
          <EnvironmentSummary avg={avg} />
          <FeedingLogsWidget logs={feedingLogs} ponds={ponds} limit={4} />
        </div>
      </div>

      <div style={{ margin: "26px 0 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: 19 }}>Ponds Overview</h2>
        <Link to="/ponds" className="btn btn-ghost btn-sm" style={{ textDecoration: "none" }}>
          View All <FiArrowRight />
        </Link>
      </div>
      <div className="pond-grid">
        {ponds.slice(0, 6).map((pond, i) => (
          <PondCard
            key={pond.id} pond={pond} reading={byPond[pond.id]} index={i}
            onView={setSelected} onSimulate={simulateReading}
          />
        ))}
      </div>

      <PondDetailModal pond={selected} readings={readings} onClose={() => setSelected(null)} onSimulate={simulateReading} />
    </>
  );
}
