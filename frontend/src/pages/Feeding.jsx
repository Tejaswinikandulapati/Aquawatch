import React from "react";
import { TbFishHook } from "react-icons/tb";
import { FiPackage, FiCalendar } from "react-icons/fi";
import PageHeader from "../components/ui/PageHeader";
import GlassCard from "../components/ui/GlassCard";
import StatCard from "../components/ui/StatCard";
import FeedingBarChart from "../components/charts/FeedingBarChart";
import FeedingLogsWidget from "../components/widgets/FeedingLogsWidget";
import { useAqua } from "../context/AquaDataContext";
import { weeklyFeeding } from "../utils/derive";

export default function Feeding() {
  const { feedingLogs, ponds } = useAqua();

  const totalKg = feedingLogs.reduce((a, l) => a + (l.quantity_kg || 0), 0);
  const feedTypes = new Set(feedingLogs.map((l) => l.feed_type)).size;
  const today = feedingLogs.filter((l) => new Date(l.fed_at).toDateString() === new Date().toDateString());
  const todayKg = today.reduce((a, l) => a + (l.quantity_kg || 0), 0);

  return (
    <>
      <PageHeader title="Feeding" desc="Feed schedule, logs and consumption analytics" />

      <div className="stat-grid">
        <StatCard index={0} icon={<TbFishHook />} label="Total Feed Logged" value={totalKg.toFixed(1)} unit="kg" gradient="var(--grad-green)" />
        <StatCard index={1} icon={<FiCalendar />} label="Fed Today" value={todayKg.toFixed(1)} unit="kg" gradient="var(--grad-cyan)" />
        <StatCard index={2} icon={<FiPackage />} label="Feed Types" value={feedTypes} gradient="var(--grad-blue)" />
        <StatCard index={3} icon={<TbFishHook />} label="Feeding Events" value={feedingLogs.length} gradient="var(--grad-warm)" />
      </div>

      <div className="grid-2">
        <GlassCard className="card-pad" hover>
          <div className="widget-title"><h3>Weekly Feeding Analysis</h3></div>
          <FeedingBarChart data={weeklyFeeding(feedingLogs)} height={280} />
        </GlassCard>
        <FeedingLogsWidget logs={feedingLogs} ponds={ponds} limit={8} />
      </div>
    </>
  );
}
