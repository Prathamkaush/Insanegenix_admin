"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import OrderQuickViewModal from "@/components/modals/OrderQuickViewModal";
import OrderCardSkeleton from "@/components/skeletons/OrderCardSkeleton";
import { FiCalendar, FiPackage, FiShoppingCart } from "react-icons/fi";

const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<
    "today" | "yesterday" | "week" | "custom" | ""
  >("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const getDateRange = () => {
    const today = new Date();
    let from = "";
    let to = today.toISOString().split("T")[0];

    if (dateFilter === "today") {
      from = to;
    }

    if (dateFilter === "yesterday") {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      from = y.toISOString().split("T")[0];
      to = from;
    }

    if (dateFilter === "week") {
      const w = new Date(today);
      w.setDate(w.getDate() - 7);
      from = w.toISOString().split("T")[0];
    }

    if (dateFilter === "custom") {
      from = fromDate;
      to = toDate;
    }

    return {
      from: from ? `${from}T00:00:00` : undefined,
      to: to ? `${to}T23:59:59` : undefined,
    };
  };

  const fetchOrders = async () => {
    setLoading(true);

    const { from, to } = getDateRange();

    const res = await api.get("/orders", {
      params: {
        page,
        status,
        fromDate: from || undefined,
        toDate: to || undefined,
      },
    });

    setOrders(res.data.orders || []);
    setPages(res.data.pages || 1);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [page, status, dateFilter, fromDate, toDate]);

  const statusColor = (s: string) =>
    ({
      PENDING: "bg-yellow-500",
      CONFIRMED: "bg-blue-500",
      SHIPPED: "bg-teal-500",
      DELIVERED: "bg-green-600",
      CANCELLED: "bg-red-600",
    }[s] || "bg-gray-400");

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-hero">
          <div>
          <h1 className="admin-hero-title">
            Order <span className="text-brandRed">Command</span>
          </h1>
          <p className="admin-hero-subtitle">
            Track customer hauls, fulfillment status, and date windows.
          </p>
          </div>
          <div className="admin-dark-button pointer-events-none">
            <FiShoppingCart size={16} /> Orders
          </div>
        </div>

        <div className="admin-surface p-5 space-y-4">
          <div className="hidden md:flex gap-3 flex-wrap">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s.value}
                onClick={() => {
                  setStatus(s.value);
                  setDateFilter("");
                  setFromDate("");
                  setToDate("");
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition ${
                  status === s.value
                    ? "bg-brandRed text-white"
                    : "bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap items-center">
            {[
              { label: "Today", value: "today" },
              { label: "Yesterday", value: "yesterday" },
              { label: "Last 7 Days", value: "week" },
            ].map((d) => (
              <button
                key={d.value}
                onClick={() => {
                  setDateFilter(d.value as any);
                  setFromDate("");
                  setToDate("");
                  setPage(1);
                }}
                className={`px-3 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition ${
                  dateFilter === d.value
                    ? "bg-brandRed text-white"
                    : "bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {d.label}
              </button>
            ))}

            <button
              onClick={() => setDateFilter("custom")}
              className={`px-3 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition ${
                dateFilter === "custom"
                  ? "bg-brandRed text-white"
                  : "bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              Custom
            </button>
          </div>

          {dateFilter === "custom" && (
            <div className="border-t border-white/10 pt-4 flex flex-wrap gap-4 items-end">
              <div>
                <label className="admin-label">From</label>
                <input
                  type="date"
                  className="admin-field mt-1"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">To</label>
                <input
                  type="date"
                  className="admin-field mt-1"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              <button
                onClick={() => {
                  if (page !== 1) {
                    setPage(1);
                  } else {
                    fetchOrders();
                  }
                }}
                className="inline-flex items-center justify-center rounded-md bg-brandRed px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-white hover:text-brandBlack disabled:opacity-60"
                disabled={!fromDate || !toDate}
              >
                Apply
              </button>
            </div>
          )}

          <div className="md:hidden">
            <select
              className="admin-field"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:hidden">
            <select
              className="admin-field"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value as any);
                setPage(1);
              }}
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 Days</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))
          ) : (
            orders.map((o) => (
              <div
                key={o.id}
                className="group admin-surface p-5 rounded-md hover:border-brandRed/30 transition cursor-pointer"
                onClick={() => setSelectedOrder(o)}
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <p className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <FiPackage className="text-brandRed" />
                    Order ID: {o.id}
                  </p>

                  <span
                    className={`px-3 py-1 rounded-sm text-white text-[10px] font-black uppercase tracking-widest ${statusColor(
                      o.status
                    )}`}
                  >
                    {o.status}
                  </span>
                </div>

                <div className="mt-4 text-sm text-zinc-400 flex flex-col sm:flex-row sm:justify-between gap-2">
                  <span className="font-black text-white">
                    Payable: Rs. {o.finalAmount ?? o.totalAmount}
                  </span>
                  <span className="text-xs text-zinc-500 flex items-center gap-2">
                    <FiCalendar /> {new Date(o.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="mt-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  <div>Items: Rs. {o.totalAmount}</div>
                  {o.shippingCharge !== undefined && (
                    <div>Shipping: Rs. {o.shippingCharge}</div>
                  )}
                </div>

                <button
                    className="mt-5 px-5 py-3 bg-brandRed text-white rounded-md hover:bg-brandBlack text-[10px] font-black uppercase tracking-widest transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/orders/${o.id}`);
                  }}
                >
                  View / Edit
                </button>
              </div>
            ))
          )}

          {!loading && orders.length === 0 && (
            <div className="admin-surface border-2 border-dashed border-white/10 rounded-md text-center py-20">
              <p className="text-sm font-black text-white uppercase tracking-widest">
                No orders found
              </p>
              <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-widest">
                Try changing filters or check back later.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="w-10 h-10 flex items-center justify-center border-2 border-white/10 rounded-md hover:border-brandRed hover:text-brandRed transition-all disabled:opacity-30"
          >
            ←
          </button>

          <span className="admin-surface px-6 py-2 rounded-md border border-white/10 shadow-sm font-bold text-white">
            Page {page} <span className="text-zinc-500 font-normal mx-1">of</span> {pages}
          </span>

          <button
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
            className="w-10 h-10 flex items-center justify-center border-2 border-white/10 rounded-md hover:border-brandRed hover:text-brandRed transition-all disabled:opacity-30"
          >
            →
          </button>
        </div>

        <OrderQuickViewModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      </div>
    </AdminLayout>
  );
}
