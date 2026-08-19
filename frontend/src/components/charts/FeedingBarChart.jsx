import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";

export default function FeedingBarChart({ data, height = 240 }) {
  const max = Math.max(...data.map((d) => d.kg), 1);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="feedBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={44} />
        <Tooltip formatter={(v) => [`${v} kg`, "Feed"]} cursor={{ fill: "rgba(52,211,153,0.08)" }} />
        <Bar dataKey="kg" radius={[6, 6, 0, 0]} maxBarSize={38}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.kg >= max ? "url(#feedBar)" : "url(#feedBar)"} opacity={0.55 + 0.45 * (d.kg / max)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
