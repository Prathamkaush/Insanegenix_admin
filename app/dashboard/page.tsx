"use client";

import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import RevenueLineChart from "@/components/charts/RevenueLineChart";
import OrdersBarChart from "@/components/charts/OrdersBarChart";
import OrderStatusPie from "@/components/charts/OrderStatusPie";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DASHBOARD DATA ================= */
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

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <AdminLayout>
        <p className="text-center py-24 text-gray-500">
          Loading dashboard…
        </p>
      </AdminLayout>
    );
  }

  if (!stats || !charts) {
    return (
      <AdminLayout>
        <p className="text-center py-24 text-red-500">
          Failed to load dashboard
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto w-full space-y-10">

        {/* ================= HEADER ================= */}
        <h1 className="text-3xl font-bold text-brandPink">
          Admin Dashboard
        </h1>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { label: "Products", value: stats.products },
            { label: "Orders", value: stats.totalOrders },
            { label: "Today Orders", value: stats.todayOrders },
            { label: "Revenue", value: `₹${stats.revenue}` },
            { label: "Today Revenue", value: `₹${stats.todayRevenue}` },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-5 border"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-2xl font-bold text-brandPink">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* ================= LOW STOCK ALERT ================= */}
        {lowStockItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h3 className="font-semibold text-red-700 mb-2">
              Low Stock Alert
            </h3>

            <ul className="text-sm space-y-1">
              {lowStockItems.map((p) => (
                <li key={p.id}>
                  {p.title} — <b>{p.stock}</b> left
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ================= CHARTS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">
              Revenue (Last 7 Days)
            </h3>
            <RevenueLineChart data={charts.revenueTrend} />
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">
              Orders (Last 7 Days)
            </h3>
            <OrdersBarChart data={charts.ordersTrend} />
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">
              Order Status
            </h3>
            <OrderStatusPie data={charts.orderStatus} />
          </div>
        </div>

        {/* ================= RECENT PRODUCTS ================= */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Recent Products
          </h2>

          <div className="space-y-4">
            {stats.recentProducts.map((p: any) => (
              <div
                key={p.id}
                className="flex items-center gap-4 border-b pb-4 last:border-none"
              >
                <img
                  src={`http://localhost:3030/uploads/products/${p.img1}`}
                  className="w-16 h-16 rounded object-cover"
                />

                <div className="flex-1">
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-gray-500">₹{p.price}</p>
                </div>

                <a
                  href={`/products/edit/${p.id}`}
                  className="text-brandPink font-semibold text-sm"
                >
                  Edit
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
