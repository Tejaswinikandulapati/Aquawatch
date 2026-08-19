import React from "react";
import {
  ComposedChart, Area, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

export default function ProductionChart({ data, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="yieldArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={44} />
        <Tooltip cursor={{ fill: "rgba(59,130,246,0.06)" }} />
        <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-dim)" }} />
        <Bar dataKey="feed" name="Feed (kg)" fill="#22d3ee" radius={[5, 5, 0, 0]} maxBarSize={28} opacity={0.85} />
        <Area type="monotone" dataKey="yield" name="Est. Yield (kg)" stroke="#60a5fa" strokeWidth={2.5} fill="url(#yieldArea)" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
