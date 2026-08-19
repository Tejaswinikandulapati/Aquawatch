import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiCheck } from "react-icons/fi";
import GlassCard from "../ui/GlassCard";
import { timeAgo } from "../../utils/derive";

const SEV_COLOR = { high: "var(--danger)", medium: "var(--warn)", low: "var(--cyan)" };

export default function AlertsWidget({ alerts, ponds, onResolve, limit }) {
  const pondName = (id) => ponds.find((p) => p.id === id)?.name || `Pond ${id}`;
  const shown = limit ? alerts.slice(0, limit) : alerts;

  return (
    <GlassCard className="card-pad" hover>
      <div className="widget-title">
        <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FiBell color="var(--danger)" /> Active Alerts
        </h3>
        {alerts.length > 0 && <span className="nav-badge">{alerts.length}</span>}
      </div>

      {alerts.length === 0 && <p className="empty">All clear — no active alerts 🎉</p>}

      <AnimatePresence>
        {shown.map((a) => (
          <motion.div
            key={a.id}
            layout
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12, height: 0 }}
            className="list-row alert-row"
          >
            <span className="alert-sev" style={{ background: SEV_COLOR[a.severity] || "var(--warn)" }} />
            <div className="list-main">
              <div className="t">{a.alert_type} <span className="faint" style={{ fontSize: 11 }}>· {pondName(a.pond_id)}</span></div>
              <div className="s" style={{ whiteSpace: "normal" }}>{a.message}</div>
              <div className="list-time" style={{ marginTop: 3 }}>{timeAgo(a.created_at)}</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onResolve(a.id)}>
              <FiCheck /> Resolve
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </GlassCard>
  );
}
