import React from "react";
import { TbFishHook } from "react-icons/tb";
import GlassCard from "../ui/GlassCard";
import { timeAgo } from "../../utils/derive";

export default function FeedingLogsWidget({ logs, ponds, limit = 5 }) {
  const pondName = (id) => ponds.find((p) => p.id === id)?.name || `Pond ${id}`;

  return (
    <GlassCard className="card-pad" hover>
      <div className="widget-title">
        <h3>Recent Feeding Logs</h3>
        <span className="faint" style={{ fontSize: 11 }}>{logs.length} total</span>
      </div>
      {logs.length === 0 && <p className="empty">No feeding records yet</p>}
      {logs.slice(0, limit).map((log) => (
        <div className="list-row" key={log.id}>
          <div className="list-ico" style={{ background: "rgba(52,211,153,0.14)", color: "var(--green)" }}>
            <TbFishHook />
          </div>
          <div className="list-main">
            <div className="t">{log.feed_type} · {log.quantity_kg} kg</div>
            <div className="s">{pondName(log.pond_id)}{log.notes ? ` — ${log.notes}` : ""}</div>
          </div>
          <div className="list-time">{timeAgo(log.fed_at)}</div>
        </div>
      ))}
    </GlassCard>
  );
}
