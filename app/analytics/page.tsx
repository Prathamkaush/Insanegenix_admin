"use client";

import { useCallback, useEffect, useState } from "react";
import { BarChart3, Eye, MousePointerClick, RefreshCw, Users } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import AdminLoader from "@/components/AdminLoader";
import TrafficChart from "@/components/charts/TrafficChart";
import { api } from "@/lib/api";

type AnalyticsData = {
  rangeDays: number;
  summary: {
    visitors: number;
    sessions: number;
    pageViews: number;
    todayVisitors: number;
    todayPageViews: number;
    pagesPerSession: number;
  };
  trend: { date: string; visitors: number; views: number }[];
  topPages: { path: string; views: number }[];
  sources: { source: string; views: number }[];
  devices: { device: string; views: number }[];
};

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get<AnalyticsData>(`/analytics/overview?days=${days}`);
      setData(response.data);
    } catch {
      setError("Analytics data could not be loaded. Confirm the backend migration has been deployed.");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AdminLayout>
      <div className="admin-page mx-auto max-w-7xl">
        <div className="admin-hero">
          <div>
            <p className="admin-page-kicker">Storefront Intelligence</p>
            <h1 className="admin-hero-title mt-1">Traffic Analytics</h1>
            <p className="admin-hero-subtitle mt-2">Anonymous visitors, page views, ad sources, and browsing trends.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select className="admin-field w-auto" value={days} onChange={(event) => setDays(Number(event.target.value))}>
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <button className="admin-dark-button" onClick={load} disabled={loading}>
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
        </div>

        {loading && !data ? (
          <AdminLoader />
        ) : error ? (
          <div className="admin-surface p-10 text-center text-sm font-bold text-red-400">{error}</div>
        ) : data ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Metric icon={Users} label="Visitors today" value={data.summary.todayVisitors} accent />
              <Metric icon={Eye} label={`Visitors · ${days} days`} value={data.summary.visitors} />
              <Metric icon={MousePointerClick} label="Page views" value={data.summary.pageViews} />
              <Metric icon={BarChart3} label="Pages / session" value={data.summary.pagesPerSession} />
            </div>

            <section className="admin-surface p-5 md:p-7">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="admin-label">Traffic trend</p>
                  <h2 className="mt-1 text-xl font-black uppercase text-white">Visitors and page views</h2>
                </div>
                <span className="admin-chip">{data.summary.sessions} sessions</span>
              </div>
              <TrafficChart data={data.trend} />
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <Ranking title="Top pages" label="Page" rows={data.topPages.map((row) => ({ name: row.path, value: row.views }))} />
              <Ranking title="Traffic sources" label="Source" rows={data.sources.map((row) => ({ name: row.source, value: row.views }))} />
              <Ranking title="Devices" label="Device" rows={data.devices.map((row) => ({ name: row.device, value: row.views }))} />
              <section className="admin-surface p-6">
                <p className="admin-label">Measurement notes</p>
                <h2 className="mt-2 text-lg font-black uppercase text-white">Privacy-conscious tracking</h2>
                <p className="mt-4 text-sm leading-6 text-zinc-400">
                  Counts are anonymous and exclude common bots and visitors with browser Do Not Track enabled. Ad traffic is attributed through UTM parameters, Google click IDs, and Meta click IDs.
                </p>
              </section>
            </div>
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
}

function Metric({ icon: Icon, label, value, accent = false }: { icon: React.ElementType; label: string; value: number; accent?: boolean }) {
  return (
    <div className="admin-surface p-5">
      <div className={`mb-5 inline-flex rounded-md p-2.5 ${accent ? "bg-brandRed text-white" : "bg-white/10 text-zinc-300"}`}>
        <Icon size={18} />
      </div>
      <p className="text-3xl font-black text-white">{value.toLocaleString("en-IN")}</p>
      <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">{label}</p>
    </div>
  );
}

function Ranking({ title, label, rows }: { title: string; label: string; rows: { name: string; value: number }[] }) {
  return (
    <section className="admin-surface overflow-hidden">
      <div className="border-b border-white/10 p-6">
        <p className="admin-label">{label}</p>
        <h2 className="mt-1 text-lg font-black uppercase text-white">{title}</h2>
      </div>
      {rows.length ? (
        <div className="divide-y divide-white/10">
          {rows.map((row, index) => (
            <div key={row.name} className="flex items-center gap-4 px-6 py-4">
              <span className="text-xs font-black text-zinc-600">{String(index + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1 truncate text-sm font-bold capitalize text-zinc-200">{row.name}</span>
              <span className="admin-chip">{row.value.toLocaleString("en-IN")} views</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="p-8 text-center text-sm text-zinc-500">No visits recorded in this period.</p>
      )}
    </section>
  );
}
