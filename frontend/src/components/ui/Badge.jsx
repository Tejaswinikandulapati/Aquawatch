import React from "react";
import { FiCheckCircle, FiAlertTriangle, FiAlertOctagon, FiHelpCircle } from "react-icons/fi";

const MAP = {
  ok: { cls: "badge-ok", icon: <FiCheckCircle /> },
  warn: { cls: "badge-warn", icon: <FiAlertTriangle /> },
  crit: { cls: "badge-crit", icon: <FiAlertOctagon /> },
  none: { cls: "badge-warn", icon: <FiHelpCircle /> },
};

export default function Badge({ level = "ok", label }) {
  const m = MAP[level] || MAP.none;
  return (
    <span className={`badge ${m.cls}`}>
      {m.icon}
      {label}
    </span>
  );
}
