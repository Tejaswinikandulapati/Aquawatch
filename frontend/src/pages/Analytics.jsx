import React from "react";
import { FiBarChart2, FiThermometer, FiActivity, FiWind } from "react-icons/fi";
import PageHeader from "../components/ui/PageHeader";
import GlassCard from "../components/ui/GlassCard";
import TrendChart from "../components/charts/TrendChart";
import ProductionChart from "../components/charts/ProductionChart";
import FeedingBarChart from "../components/charts/FeedingBarChart";
import { useAqua } from "../context/AquaDataContext";
import { trendSeries, weeklyFeeding, monthlyProduction } from "../utils/derive";

export default function Analytics() {
  const { readings, feedingLogs } = useAqua();

  return (
    <>
      <PageHeader title="Analytics" desc="Production statistics and long-run environmental trends" />

      <GlassCard className="card-pad" hover style={{ marginBottom: 20 }}>
        <div className="widget-title">
          <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}><FiBarChart2 color="var(--cyan)" /> Monthly Production Statistics</h3>
          <span className="faint" style={{ fontSize: 11 }}>Feed input vs. estimated biomass yield</span>
        </div>
        <ProductionChart data={monthlyProduction(feedingLogs)} height={300} />
      </GlassCard>

      <div className="grid-3" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", marginBottom: 20 }}>
        <GlassCard className="card-pad" hover>
          <div className="section-title"><FiThermometer /> Temperature</div>
          <TrendChart data={trendSeries(readings, "temperature")} color="#22d3ee" unit="°C" height={170} id="a-temp" />
        </GlassCard>
        <GlassCard className="card-pad" hover>
          <div className="section-title"><FiActivity /> pH</div>
          <TrendChart data={trendSeries(readings, "ph")} color="#60a5fa" height={170} id="a-ph" />
        </GlassCard>
        <GlassCard className="card-pad" hover>
          <div className="section-title"><FiWind /> Dissolved O₂</div>
          <TrendChart data={trendSeries(readings, "dissolved_oxygen")} color="#34d399" unit=" mg/L" height={170} id="a-do" />
        </GlassCard>
      </div>

      <GlassCard className="card-pad" hover>
        <div className="widget-title"><h3>Weekly Feeding Analysis</h3></div>
        <FeedingBarChart data={weeklyFeeding(feedingLogs)} height={260} />
      </GlassCard>
    </>
  );
}
