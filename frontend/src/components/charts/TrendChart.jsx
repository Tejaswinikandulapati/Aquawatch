import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

// Reusable metric trend area chart.
export default function TrendChart({ data, color = "#22d3ee", unit = "", height = 220, id = "t" }) {
  const gid = `grad-${id}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.45} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="time" tickLine={false} axisLine={false} minTickGap={24} />
        <YAxis tickLine={false} axisLine={false} width={44} />
        <Tooltip formatter={(v) => [`${v}${unit}`, "Value"]} cursor={{ stroke: color, strokeOpacity: 0.3 }} />
        <Area
          type="monotone" dataKey="value" stroke={color} strokeWidth={2.5}
          fill={`url(#${gid})`} dot={false} activeDot={{ r: 4 }} isAnimationActive
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
