import React from "react";
import { motion } from "framer-motion";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

export default function StatCard({ icon, label, value, unit, gradient, glow, trend, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="glass glass-hover stat-card"
    >
      <div className="stat-glow" style={{ background: gradient || glow }} />
      <div className="stat-top">
        <div className="stat-icon" style={{ background: gradient }}>{icon}</div>
        {trend != null && (
          <span className={`stat-trend ${trend >= 0 ? "trend-up" : "trend-down"}`}>
            {trend >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="stat-value">
        {value}
        {unit && <span style={{ fontSize: 15, color: "var(--text-dim)", marginLeft: 4 }}>{unit}</span>}
      </div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );
}
