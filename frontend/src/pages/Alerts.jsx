import React from "react";
import { FiBell, FiCheckCircle } from "react-icons/fi";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import AlertsWidget from "../components/widgets/AlertsWidget";
import { useAqua } from "../context/AquaDataContext";

export default function Alerts() {
  const { alerts, ponds, resolveAlert } = useAqua();

  const bySev = (s) => alerts.filter((a) => a.severity === s).length;

  return (
    <>
      <PageHeader title="Alerts" desc="Threshold breaches requiring operator attention" />

      <div className="stat-grid">
        <StatCard index={0} icon={<FiBell />} label="Active Alerts" value={alerts.length} gradient="var(--grad-warm)" />
        <StatCard index={1} icon={<FiBell />} label="High Severity" value={bySev("high")} gradient="linear-gradient(135deg,#fb7185,#ef4444)" />
        <StatCard index={2} icon={<FiBell />} label="Medium Severity" value={bySev("medium")} gradient="var(--grad-warm)" />
        <StatCard index={3} icon={<FiCheckCircle />} label="Monitored Ponds" value={ponds.length} gradient="var(--grad-green)" />
      </div>

      <AlertsWidget alerts={alerts} ponds={ponds} onResolve={resolveAlert} />
    </>
  );
}
