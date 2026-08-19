import React from "react";
import { motion } from "framer-motion";

export default function GlassCard({ children, className = "", hover = false, delay = 0, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={`glass ${hover ? "glass-hover" : ""} ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
