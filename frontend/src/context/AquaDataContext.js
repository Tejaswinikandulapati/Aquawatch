import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AquaCtx = createContext(null);

export function AquaDataProvider({ children }) {
  const [ponds, setPonds] = useState([]);
  const [readings, setReadings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [feedingLogs, setFeedingLogs] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      const [p, r, a, f, s] = await Promise.all([
        api.getPonds(),
        api.getReadings(),
        api.getAlerts(false),
        api.getFeedingLogs(),
        api.getSummary(),
      ]);
      setPonds(p);
      setReadings(r);
      setAlerts(a);
      setFeedingLogs(f);
      setSummary(s);
      setLastSync(new Date());
    } catch (e) {
      console.error("Fetch error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, 8000);
    return () => clearInterval(id);
  }, [fetchAll]);

  const simulateReading = useCallback(
    async (pondId) => {
      await api.simulateReading(pondId);
      fetchAll();
    },
    [fetchAll]
  );

  const resolveAlert = useCallback(
    async (alertId) => {
      await api.resolveAlert(alertId);
      fetchAll();
    },
    [fetchAll]
  );

  const value = {
    ponds, readings, alerts, feedingLogs, summary, loading, lastSync,
    fetchAll, simulateReading, resolveAlert,
  };

  return <AquaCtx.Provider value={value}>{children}</AquaCtx.Provider>;
}

export const useAqua = () => {
  const ctx = useContext(AquaCtx);
  if (!ctx) throw new Error("useAqua must be used within AquaDataProvider");
  return ctx;
};
