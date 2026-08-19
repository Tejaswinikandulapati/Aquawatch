import React from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid, FiDroplet, FiActivity, FiCpu, FiBarChart2,
  FiFileText, FiBell, FiSettings, FiLifeBuoy,
} from "react-icons/fi";
import { TbFishHook } from "react-icons/tb";
import { useAqua } from "../../context/AquaDataContext";

const NAV = [
  { to: "/", label: "Dashboard", icon: <FiGrid />, end: true },
  { to: "/ponds", label: "Ponds", icon: <FiDroplet /> },
  { to: "/sensors", label: "Sensors", icon: <FiCpu /> },
  { to: "/feeding", label: "Feeding", icon: <TbFishHook /> },
  { to: "/water-quality", label: "Water Quality", icon: <FiActivity /> },
  { to: "/analytics", label: "Analytics", icon: <FiBarChart2 /> },
  { to: "/reports", label: "Reports", icon: <FiFileText /> },
  { to: "/alerts", label: "Alerts", icon: <FiBell />, badgeKey: "alerts" },
  { to: "/settings", label: "Settings", icon: <FiSettings /> },
];

export default function Sidebar({ open, onClose }) {
  const { alerts } = useAqua();

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">🌊</div>
          <div>
            <div className="brand-name">AquaWatch</div>
            <div className="brand-sub">Aquaculture</div>
          </div>
        </div>

        <div className="nav-label">Menu</div>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badgeKey === "alerts" && alerts.length > 0 && (
              <span className="nav-badge">{alerts.length}</span>
            )}
          </NavLink>
        ))}

        <div className="sidebar-foot">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <FiLifeBuoy color="var(--cyan)" />
            <strong style={{ fontSize: 13 }}>Need help?</strong>
          </div>
          Check docs at <span style={{ color: "var(--cyan-soft)" }}>localhost:8000/docs</span>
        </div>
      </aside>
    </>
  );
}
