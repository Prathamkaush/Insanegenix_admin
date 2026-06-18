"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { useParams } from "next/navigation";
import TrackingTimeline from "@/components/TrackingTimeline";
import OrderStatusTimeline from "@/components/order/OrderStatusTimeline";
import { FiPackage, FiTruck, FiMapPin, FiCreditCard, FiClock, FiPrinter } from "react-icons/fi";

/* ================= ENHANCED STATUS BADGE ================= */
const StatusBadge = ({ status }: { status: string }) => {
  const colors: any = {
    PENDING: "bg-amber-950/20 text-amber-400 border-amber-800/30",
    CONFIRMED: "bg-blue-950/20 text-blue-400 border-blue-800/30",
    SHIPPED: "bg-purple-950/20 text-purple-400 border-purple-800/30",
    DELIVERED: "bg-emerald-950/20 text-emerald-400 border-emerald-800/30",
    CANCELLED: "bg-rose-950/20 text-rose-400 border-rose-800/30",
  };

  return (
    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${colors[status]}`}>
      {status}
    </span>
  );
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const orderId = String(id);

  const [order, setOrder] = useState<any>(null);
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    const res = await api.get(`/admin/orders/${orderId}`);
    setOrder(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  useEffect(() => {
    if (!order?.trackingId) return;
    api
      .get(`/admin/shipping/track/${orderId}`)
      .then((res) => setTracking(res.data))
      .catch(() => setTracking(null));
  }, [order?.trackingId]);

  const confirmOrder = async () => {
    try {
      setActionLoading(true);
      setError("");
      await api.put(`/orders/${orderId}/status`, { status: "CONFIRMED" });
      await fetchOrder();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to confirm order");
    } finally {
      setActionLoading(false);
    }
  };

  const shipOrder = async () => {
    try {
      setActionLoading(true);
      setError("");
      await api.post(`/admin/shipping/delhivery/${orderId}`);
      await fetchOrder();
    } catch (err: any) {
      setError(err.response?.data?.message || "Delhivery shipment failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-20 flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-brandRed border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Order Data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-page max-w-6xl">

        {/* HEADER SECTION */}
        <div className="admin-hero">
          <div>
            <h1 className="admin-hero-title">
              Order <span className="text-brandRed">#{order.id}</span>
            </h1>
            <p className="admin-hero-subtitle flex items-center gap-2">
              <FiClock /> {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* SUMMARY & ADDRESS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="admin-surface p-6 md:p-8">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-8 flex items-center gap-2">
              <FiCreditCard className="text-brandRed" /> Payment & Financials
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400 font-bold uppercase text-[10px]">Method</span>
                <span className="font-black uppercase tracking-tight text-white">{order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400 font-bold uppercase text-[10px]">Items Subtotal</span>
                <span className="font-bold text-white">₹{order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400 font-bold uppercase text-[10px]">Shipping</span>
                <span className="font-bold text-white">₹{order.shippingCharge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl pt-4 border-t border-white/5">
                <span className="font-black uppercase tracking-tighter text-white">Net Payable</span>
                <span className="font-black text-brandRed">₹{order.finalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Customer Address */}
          <div className="admin-surface p-6 md:p-8">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-8 flex items-center gap-2">
              <FiMapPin className="text-brandRed" /> Customer Logistics
            </h2>
            <div className="space-y-2">
              <p className="text-lg font-black uppercase tracking-tight text-white">{order.address?.name}</p>
              <p className="text-sm font-bold text-brandRed tracking-widest">{order.address?.phone}</p>
              <div className="pt-2 text-sm text-zinc-400 font-medium leading-relaxed uppercase tracking-tight">
                <p>{order.address?.addressLine1 || order.address?.street}</p>
                <p>{order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="admin-table">
          <OrderStatusTimeline
            status={order.status}
            createdAt={order.createdAt}
            shippedAt={order.shippedAt}
            confirmedAt={order.confirmedAt}
            deliveredAt={order.deliveredAt}
          />
        </div>

        {/* ACTIONS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="admin-surface p-6 md:p-8 space-y-6">
                <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <FiTruck className="text-brandRed" /> Fulfillment Actions
                </h2>
                
                <div className="flex flex-col gap-4">
                    {(order.status === "PENDING" || (order.status === "CONFIRMED" && !order.trackingId)) && (
                        <div className="flex gap-4">
                            {order.status === "PENDING" && (
                                <button
                                    disabled={actionLoading}
                                    onClick={confirmOrder}
                                    className="flex-1 rounded-md bg-white/10 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-brandRed"
                                >
                                    Confirm Order
                                </button>
                            )}

                            {order.status === "CONFIRMED" && !order.trackingId && (
                                    <button
                                        disabled={actionLoading}
                                        onClick={shipOrder}
                                        className="flex-1 rounded-md bg-brandRed py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-brandBlack"
                                    >
                                        Ship with Delhivery
                                    </button>
                            )}
                        </div>
                    )}

                    <button
                        onClick={() => window.open(`/orders/${order.id}/invoice`, "_blank")}
                        className="w-full rounded-md border border-white/10 bg-zinc-900 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-brandBlack flex items-center justify-center gap-2"
                    >
                        <FiPrinter size={14} /> Download Invoice
                    </button>
                </div>

                {order.trackingId && (
                    <div className="p-4 bg-emerald-950/20 border border-emerald-800/30 rounded-md">
                        <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                            Shipment Active: <span className="ml-2 font-mono text-xs">{order.trackingId}</span>
                        </p>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-rose-950/20 border border-rose-800/30 text-rose-400 text-[10px] font-bold uppercase tracking-widest rounded-md">
                        {error}
                    </div>
                )}
            </div>

            {/* ITEM LIST */}
            <div className="admin-surface p-6 md:p-8">
                <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-8 flex items-center gap-2">
                    <FiPackage className="text-brandRed" /> Manifest Items
                </h2>
                <div className="divide-y divide-white/5">
                    {order.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between py-4 first:pt-0 last:pb-0">
                            <div>
                                <p className="text-xs font-black uppercase tracking-tight text-white">{item.product.title}</p>
                                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Quantity: {item.quantity} × ₹{item.price}</p>
                            </div>
                            <span className="text-sm font-black text-white">₹{(item.quantity * item.price).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* SHIPMENT TRACKING (External API Data) */}
        {tracking && (
          <div className="admin-surface p-6 md:p-8">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-white mb-8">Detailed Transit Logs</h2>
            <TrackingTimeline scans={tracking.scans} />
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
