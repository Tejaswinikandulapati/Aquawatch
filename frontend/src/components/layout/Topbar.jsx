import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu, FiSearch, FiBell, FiChevronDown,
  FiUser, FiSettings, FiLogOut, FiHelpCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAqua } from "../../context/AquaDataContext";

export default function Topbar({ onMenu }) {
  const { alerts } = useAqua();
  const [now, setNow] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const time = now.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const date = now.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" });

  return (
    <header className="topbar">
      <button className="hamburger" onClick={onMenu} aria-label="Menu"><FiMenu /></button>

      <div className="search">
        <FiSearch />
        <input
          placeholder="Search ponds, sensors, alerts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && query.trim()) navigate("/ponds"); }}
        />
      </div>

      <div className="topbar-right">
        <button className="icon-btn" onClick={() => navigate("/alerts")} aria-label="Notifications">
          <FiBell />
          {alerts.length > 0 && <span className="icon-dot" />}
        </button>

        <div className="clock">
          <div className="t">{time}</div>
          <div className="d">{date}</div>
        </div>

        <div style={{ position: "relative" }} ref={ref}>
          <button
            className="profile"
            onClick={() => setMenuOpen((v) => !v)}
            style={{ border: "1px solid var(--glass-border)", background: "rgba(255,255,255,.05)" }}
          >
            <div className="avatar">Aq</div>
            <div style={{ textAlign: "left" }}>
              <div className="profile-name">Farm Admin</div>
              <div className="profile-role">Operator</div>
            </div>
            <FiChevronDown color="var(--text-faint)" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className="glass dropdown"
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.16 }}
              >
                <div className="dropdown-item"><FiUser /> My Profile</div>
                <div className="dropdown-item" onClick={() => { navigate("/settings"); setMenuOpen(false); }}>
                  <FiSettings /> Settings
                </div>
                <div className="dropdown-item"><FiHelpCircle /> Help Center</div>
                <div className="dropdown-sep" />
                <div className="dropdown-item" style={{ color: "var(--danger-soft)" }}>
                  <FiLogOut /> Sign Out
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
