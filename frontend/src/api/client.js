// Central API client

export const API = "http://127.0.0.1:8000/api";

const json = (res) => {
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return res.json();
};

export const api = {
  getPonds: () =>
    fetch(`${API}/ponds`).then(json),

  getReadings: (pondId) =>
    fetch(
      `${API}/readings${pondId ? `?pond_id=${pondId}` : ""}`
    ).then(json),

  getAlerts: (resolved = false) =>
    fetch(
      `${API}/alerts?resolved=${resolved}`
    ).then(json),

  getFeedingLogs: (pondId) =>
    fetch(
      `${API}/feeding-logs${pondId ? `?pond_id=${pondId}` : ""}`
    ).then(json),

  getSummary: () =>
    fetch(`${API}/dashboard-summary`).then(json),

  simulateReading: (pondId) =>
    fetch(`${API}/simulate/${pondId}`, {
      method: "POST",
    }).then(json),

  resolveAlert: (alertId) =>
    fetch(`${API}/alerts/${alertId}/resolve`, {
      method: "PUT",
    }).then(json),
};