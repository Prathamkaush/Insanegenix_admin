"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RevenueLineChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickLine={false} />
        <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
        <Tooltip contentStyle={{ backgroundColor: '#080808', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#e50914"
          strokeWidth={3}
          dot={{ fill: '#ff2a35' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
