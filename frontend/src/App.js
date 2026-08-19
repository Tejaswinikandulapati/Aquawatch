import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AquaDataProvider, useAqua } from "./context/AquaDataContext";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Ponds from "./pages/Ponds";
import Sensors from "./pages/Sensors";
import Feeding from "./pages/Feeding";
import WaterQuality from "./pages/WaterQuality";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";

function Boot({ children }) {
  const { loading } = useAqua();
  if (loading) {
    return (
      <div className="loading-screen">
        <div style={{ textAlign: "center" }}>
          <div className="spinner" />
          <div style={{ fontSize: 20, fontWeight: 700 }} className="gradient-text">🌊 AquaWatch</div>
          <div className="faint" style={{ marginTop: 6, fontSize: 13 }}>Loading your aquaculture dashboard…</div>
        </div>
      </div>
    );
  }
  return children;
}

export default function App() {
  return (
    <AquaDataProvider>
      <Boot>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="/ponds" element={<Ponds />} />
              <Route path="/sensors" element={<Sensors />} />
              <Route path="/feeding" element={<Feeding />} />
              <Route path="/water-quality" element={<WaterQuality />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Boot>
    </AquaDataProvider>
  );
}
