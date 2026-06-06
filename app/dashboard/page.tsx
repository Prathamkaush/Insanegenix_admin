"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import AdminLoader from "@/components/AdminLoader";
import { api } from "@/lib/api";
import RevenueLineChart from "@/components/charts/RevenueLineChart";
import OrdersBarChart from "@/components/charts/OrdersBarChart";
import OrderStatusPie from "@/components/charts/OrderStatusPie";
import UserStatsCards from "@/components/common/UserStatsCards";
import UsersLineChart from "@/components/charts/UsersChart";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsRes, chartsRes, stockRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/charts"),
          api.get("/products/admin/low-stock"),
        ]);

        setStats(statsRes.data);
        setCharts(chartsRes.data);
        setLowStockItems(stockRes.data || []);
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <AdminLoader />
      </AdminLayout>
    );
  }

  if (!stats || !charts) {
    return (
      <AdminLayout>
        <div className="admin-surface p-10 text-center">
          <p className="font-black uppercase tracking-widest text-brandRed">Failed to load dashboard data.</p>
        </div>
      </AdminLayout>
    );
  }

  const cards = [
    { label: "Supplements", value: stats.products },
    { label: "Orders", value: stats.totalOrders },
    { label: "Today Orders", value: stats.todayOrders },
    { label: "Revenue", value: `₹${stats.revenue}` },
    { label: "Today Revenue", value: `₹${stats.todayRevenue}` },
  ];

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="relative overflow-hidden rounded-sm bg-brandBlack p-6 text-white">
          <img
            src="/insanegenix/product/ISO.png"
            alt=""
            className="absolute right-8 top-1/2 hidden h-44 -translate-y-1/2 object-contain opacity-20 lg:block"
          />
          <div className="relative max-w-3xl">
            <p className="admin-page-kicker">InsaneGenix Control Room</p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight md:text-4xl">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Track revenue, orders, customers, product stock, and supplement catalog health.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          <UserStatsCards users={stats.users} />
          {cards.map((item) => (
            <div key={item.label} className="admin-surface flex min-h-[110px] flex-col justify-center p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{item.label}</p>
              <p className="mt-2 text-2xl font-black text-white">{item.value}</p>
            </div>
          ))}
        </div>

        {lowStockItems.length > 0 && (
          <div className="rounded-sm border-l-4 border-brandRed bg-brandRed/10 p-4 shadow-sm">
            <h3 className="font-black uppercase tracking-tight text-red-400">Low Stock Alert</h3>
            <ul className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2 lg:grid-cols-3">
              {lowStockItems.map((p) => (
                <li key={p.id} className="rounded-sm border border-brandRed/20 bg-white/5 p-2 text-red-300">
                  {p.title} <span className="font-black">{p.stock}</span> units left
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartPanel title="Users" tone="bg-brandRed">
            <UsersLineChart data={charts.usersTrend} />
          </ChartPanel>
          <ChartPanel title="Revenue" tone="bg-emerald-500">
            <RevenueLineChart data={charts.revenueTrend} />
          </ChartPanel>
          <ChartPanel title="Orders" tone="bg-zinc-950">
            <OrdersBarChart data={charts.ordersTrend} />
          </ChartPanel>
          <ChartPanel title="Order Status" tone="bg-amber-500">
            <div className="flex h-full justify-center">
              <OrderStatusPie data={charts.orderStatus} />
            </div>
          </ChartPanel>
        </div>

        <div className="admin-surface overflow-hidden">
          <div className="border-b border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-black uppercase tracking-tight text-white">Recent Supplements</h2>
          </div>

          <div className="divide-y divide-white/10">
            {stats.recentProducts.map((p: any) => (
              <div key={p.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-white/5">
                <img
                  src={p.img1 ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${p.img1}` : "/insanegenix/product/Whey.png"}
                  alt={p.title}
                  className="h-14 w-14 rounded-sm border border-white/10 object-cover shadow-sm"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-white">{p.title}</p>
                  <p className="mt-1 text-sm font-black text-brandRed">₹{p.price}</p>
                </div>

                <Link
                  href={`/products/edit/${p.id}`}
                  className="rounded-sm border border-brandRed/20 px-4 py-2 text-xs font-black uppercase tracking-widest text-brandRed transition-all hover:bg-brandRed hover:text-white"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function ChartPanel({ title, tone, children }: { title: string; tone: string; children: React.ReactNode }) {
  return (
    <div className="admin-surface p-6">
      <h3 className="mb-6 flex items-center text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
        <span className={`mr-2 h-2 w-2 rounded-full ${tone}`} />
        {title} (Last 7 Days)
      </h3>
      <div className="h-[300px] w-full">{children}</div>
    </div>
  );
}
