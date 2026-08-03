"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type TrafficPoint = { date: string; visitors: number; views: number };

export default function TrafficChart({ data }: { data: TrafficPoint[] }) {
  const formatted = data.map((point) => ({
    ...point,
    label: new Date(`${point.date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={formatted} margin={{ left: -18, right: 12, top: 8, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="label" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ backgroundColor: "#080808", borderColor: "rgba(255,255,255,0.12)", color: "#fff" }} />
        <Line type="monotone" dataKey="visitors" name="Visitors" stroke="#e50914" strokeWidth={3} dot={false} />
        <Line type="monotone" dataKey="views" name="Page views" stroke="#ffffff" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
