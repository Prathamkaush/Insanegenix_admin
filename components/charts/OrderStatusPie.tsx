"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#ef4444", "#f97316", "#22c55e", "#38bdf8", "#a78bfa", "#facc15"];

function OrderStatusTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;

  const item = payload[0];

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: 8,
        boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
        color: "#111827",
        fontSize: 13,
        fontWeight: 800,
        padding: "10px 12px",
      }}
    >
      <span style={{ color: item.color }}>{item.name}</span>
      <span style={{ color: "#111827" }}> : {item.value}</span>
    </div>
  );
}

export default function OrderStatusPie({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="status"
          outerRadius={85}
          label={{ fill: "#ffffff", fontSize: 12, fontWeight: 800 }}
          labelLine={{ stroke: "#ffffff", strokeWidth: 1.5 }}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#080808" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip content={<OrderStatusTooltip />} cursor={false} />
      </PieChart>
    </ResponsiveContainer>
  );
}
