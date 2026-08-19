import React, { useState } from "react";
import { FiUser, FiBell, FiSliders, FiCheck } from "react-icons/fi";
import PageHeader from "../components/ui/PageHeader";
import GlassCard from "../components/ui/GlassCard";
import { RANGES } from "../utils/derive";

function Toggle({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 44, height: 24, borderRadius: 20, border: "none", padding: 3,
        background: on ? "var(--grad-cyan)" : "rgba(255,255,255,.12)",
        display: "flex", justifyContent: on ? "flex-end" : "flex-start", transition: "background .2s",
      }}
    >
      <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", display: "block" }} />
    </button>
  );
}

function Row({ label, sub, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
        {sub && <div className="faint" style={{ fontSize: 12, marginTop: 2 }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const [toggles, setToggles] = useState({ email: true, push: false, autoResolve: false, dark: true });
  const flip = (k) => setToggles((t) => ({ ...t, [k]: !t[k] }));

  return (
    <>
      <PageHeader title="Settings" desc="Preferences and monitoring configuration (UI demo)" />

      <div className="grid-2">
        <div className="col">
          <GlassCard className="card-pad" hover>
            <div className="section-title"><FiUser /> Profile</div>
            <Row label="Display Name" sub="Shown across the dashboard">
              <input defaultValue="Farm Admin" style={input} />
            </Row>
            <Row label="Email" sub="Notification recipient">
              <input defaultValue="admin@aquawatch.io" style={input} />
            </Row>
            <Row label="Farm Site" sub="Primary facility label">
              <input defaultValue="Coastal Site A" style={input} />
            </Row>
          </GlassCard>

          <GlassCard className="card-pad" hover>
            <div className="section-title"><FiBell /> Notifications</div>
            <Row label="Email Alerts" sub="Send breaches to your inbox">
              <Toggle on={toggles.email} onClick={() => flip("email")} />
            </Row>
            <Row label="Push Notifications" sub="Browser push on new alerts">
              <Toggle on={toggles.push} onClick={() => flip("push")} />
            </Row>
            <Row label="Auto-resolve stale alerts" sub="Clear alerts after 24h">
              <Toggle on={toggles.autoResolve} onClick={() => flip("autoResolve")} />
            </Row>
          </GlassCard>
        </div>

        <div className="col">
          <GlassCard className="card-pad" hover>
            <div className="section-title"><FiSliders /> Safe-Range Thresholds</div>
            <p className="faint" style={{ fontSize: 12, marginBottom: 6 }}>
              Reference bounds used for scoring &amp; health badges.
            </p>
            {Object.entries(RANGES).map(([k, v]) => (
              <Row key={k} label={k.replace("_", " ")} sub={`Hard limit ${v.hard[0]} – ${v.hard[1]}`}>
                <span style={{ fontWeight: 700, color: "var(--cyan)" }}>{v.min} – {v.max}</span>
              </Row>
            ))}
          </GlassCard>

          <GlassCard className="card-pad" hover>
            <div className="section-title">System</div>
            <Row label="Auto-refresh" sub="Live polling interval">
              <span style={{ fontWeight: 700 }}>8s</span>
            </Row>
            <Row label="API Endpoint" sub="Backend base URL">
              <span className="faint" style={{ fontSize: 12 }}>localhost:8000</span>
            </Row>
            <button className="btn" style={{ marginTop: 16 }}><FiCheck /> Save Changes</button>
          </GlassCard>
        </div>
      </div>
    </>
  );
}

const input = {
  background: "rgba(255,255,255,.05)", border: "1px solid var(--glass-border)",
  borderRadius: 10, padding: "8px 12px", color: "var(--text)", fontSize: 13,
  width: 200, maxWidth: "45vw", outline: "none",
};
