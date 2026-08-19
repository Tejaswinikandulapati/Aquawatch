import React from "react";
import { motion } from "framer-motion";

export default function PageHeader({ title, desc, actions }) {
  return (
    <motion.div
      className="page-head"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div>
        <h1 className="page-title">{title}</h1>
        {desc && <p className="page-desc">{desc}</p>}
      </div>
      {actions && <div style={{ display: "flex", gap: 10 }}>{actions}</div>}
    </motion.div>
  );
}
