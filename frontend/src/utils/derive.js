// Pure client-side derivations from the existing API data.
// No backend/schema changes — everything here is computed from
// ponds / readings / alerts / feeding-logs that the API already returns.

// Safe operating ranges used for scoring + health badges.
export const RANGES = {
  temperature: { min: 26, max: 30, hard: [22, 34] },
  ph: { min: 6.5, max: 8.5, hard: [6.0, 9.0] },
  dissolved_oxygen: { min: 5, max: 8, hard: [4, 10] },
  ammonia: { min: 0, max: 0.5, hard: [0, 1] },
};

export const latestReadingFor = (readings, pondId) =>
  readings.find((r) => r.pond_id === pondId);

// map each pond -> its most recent reading
export const latestByPond = (readings) => {
  const map = {};
  for (const r of readings) if (!(r.pond_id in map)) map[r.pond_id] = r;
  return map;
};

const inRange = (v, { min, max }) => v >= min && v <= max;

// 0-100 water-quality score from a single reading
export function waterQualityScore(r) {
  if (!r) return null;
  let score = 0;
  const weights = { temperature: 25, ph: 25, dissolved_oxygen: 30, ammonia: 20 };
  for (const key of Object.keys(weights)) {
    const val = r[key];
    const { min, max, hard } = RANGES[key];
    if (inRange(val, { min, max })) {
      score += weights[key];
    } else {
      // partial credit while still inside the hard bounds
      const [lo, hi] = hard;
      const clamped = Math.max(lo, Math.min(hi, val));
      const dist = clamped < min ? (min - clamped) / (min - lo) : (clamped - max) / (hi - max);
      score += weights[key] * Math.max(0, 1 - dist) * 0.6;
    }
  }
  return Math.round(score);
}

export function avgQualityScore(readings) {
  const latest = Object.values(latestByPond(readings));
  if (!latest.length) return null;
  const sum = latest.reduce((a, r) => a + (waterQualityScore(r) || 0), 0);
  return Math.round(sum / latest.length);
}

export function avgOf(readings, key) {
  const latest = Object.values(latestByPond(readings));
  const vals = latest.map((r) => r[key]).filter((v) => v != null);
  if (!vals.length) return null;
  return +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
}

// health status for a pond from its latest reading
export function healthStatus(r) {
  if (!r) return { level: "none", label: "No Data" };
  let critical = 0;
  let warn = 0;
  for (const key of ["temperature", "ph", "dissolved_oxygen", "ammonia"]) {
    const { min, max, hard } = RANGES[key];
    const [lo, hi] = hard;
    if (r[key] < lo || r[key] > hi) critical++;
    else if (!inRange(r[key], { min, max })) warn++;
  }
  if (critical > 0) return { level: "crit", label: "Critical" };
  if (warn > 1) return { level: "warn", label: "At Risk" };
  if (warn === 1) return { level: "warn", label: "Watch" };
  return { level: "ok", label: "Healthy" };
}

// build an ascending time-series for a metric from readings history
export function trendSeries(readings, key, limit = 14) {
  const sorted = [...readings]
    .sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at))
    .slice(-limit);
  return sorted.map((r) => ({
    time: fmtTime(r.recorded_at),
    value: r[key],
  }));
}

// weekly feeding: sum quantity per weekday from feeding logs
export function weeklyFeeding(logs) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const buckets = days.map((d) => ({ day: d, kg: 0 }));
  for (const l of logs) {
    const d = new Date(l.fed_at).getDay();
    buckets[d].kg += l.quantity_kg || 0;
  }
  // reorder Mon..Sun for a natural week
  const order = [1, 2, 3, 4, 5, 6, 0];
  return order.map((i) => ({ day: buckets[i].day, kg: +buckets[i].kg.toFixed(1) }));
}

// monthly production proxy: total feed volume grouped by month
export function monthlyProduction(logs) {
  const months = {};
  for (const l of logs) {
    const d = new Date(l.fed_at);
    const key = d.toLocaleString("en", { month: "short", year: "2-digit" });
    months[key] = (months[key] || 0) + (l.quantity_kg || 0);
  }
  const entries = Object.entries(months).map(([month, kg]) => ({
    month,
    feed: +kg.toFixed(1),
    yield: +(kg * 1.8).toFixed(1), // est. biomass yield from feed (FCR ~1.8)
  }));
  return entries.length ? entries : placeholderMonths();
}

function placeholderMonths() {
  return ["Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((month, i) => ({
    month,
    feed: 0,
    yield: 0,
  }));
}

export function fmtTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });
}

export function timeAgo(ts) {
  const diff = (Date.now() - new Date(ts).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// deterministic fish emoji + banner gradient per pond
const FISH = ["🐟", "🦐", "🐠", "🦀", "🐡", "🦑"];
const BANNERS = [
  "linear-gradient(135deg,#0e7490,#0369a1)",
  "linear-gradient(135deg,#0f766e,#0891b2)",
  "linear-gradient(135deg,#1d4ed8,#0e7490)",
  "linear-gradient(135deg,#065f46,#0891b2)",
  "linear-gradient(135deg,#155e75,#1e40af)",
];
export const fishFor = (id) => FISH[id % FISH.length];
export const bannerFor = (id) => BANNERS[id % BANNERS.length];
