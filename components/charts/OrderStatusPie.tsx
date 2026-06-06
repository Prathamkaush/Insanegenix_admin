"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#e50914", "#9f0712", "#f4f4f5", "#6b7280"];

export default function OrderStatusPie({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="status"
          outerRadius={85}
          label={{ fill: '#fff', fontSize: 10 }}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#080808" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: '#080808', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
