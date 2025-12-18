"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { useParams } from "next/navigation";
import TrackingTimeline from "@/components/TrackingTimeline";


const StatusBadge = ({ status }: { status: string }) => {
  const colors: any = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        colors[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
const [updating, setUpdating] = useState(false);


  const fetchOrder = async () => {
    const res = await api.get(`/orders/${id}`);
    setOrder(res.data);
    setStatus(res.data.status);
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const updateStatus = async () => {
  try {
    setUpdating(true);
    await api.put(`/orders/${id}/status`, { status });
    fetchOrder();
    setShowConfirm(false);
  } catch {
    alert("Failed to update order");
  } finally {
    setUpdating(false);
  }
};

  if (!order) {
    return (
      <AdminLayout>
        <p className="py-20 text-center">Loading order...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-brandPink">
            Order id : {order.id}
          </h1>
          <StatusBadge status={order.status} />
        </div>

        {/* SUMMARY + ADDRESS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ORDER SUMMARY */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-500">Total Amount:</span>{" "}
                <span className="font-semibold text-brandPink">
                  ₹{order.totalAmount}
                </span>
              </p>
              <p>
                <span className="text-gray-500">Placed On:</span>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* CUSTOMER ADDRESS */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Customer Address</h2>

            <div className="text-sm text-gray-700 space-y-1">
              <p>{order.address?.name}</p>
              <p>{order.address?.phone}</p>
              <p>{order.address?.street}</p>
              <p>
                {order.address?.city}, {order.address?.state}
              </p>
              <p>{order.address?.pincode}</p>
            </div>
          </div>
        </div>

        {/* TRACKING */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Order Tracking</h2>
          <TrackingTimeline status={order.status} />
        </div>

        {/* ITEMS */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Items</h2>

          <div className="divide-y">
            {order.items.map((item: any) => (
              <div
                key={item.id}
                className="py-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{item.product.title}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>

                <p className="font-semibold text-brandPink">
                  ₹{item.quantity * item.price}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* UPDATE STATUS */}
        <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1">
              Update Order Status
            </h2>
            <p className="text-sm text-gray-500">
              Change order state as it progresses
            </p>
          </div>

          <div className="flex items-center gap-4">
            <select
              className="border px-4 py-2 rounded-lg bg-gray-50"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <button
              onClick={() => setShowConfirm(true)}
              className="px-6 py-2 bg-brandPink text-white rounded-lg hover:bg-brandPinkLight"
            >
              Update
            </button>
          </div>
        {showConfirm && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">

      <h3 className="text-lg font-bold mb-2">
        Confirm Status Change
      </h3>

      <p className="text-gray-600 mb-6">
        Change order status to{" "}
        <span className="font-semibold text-brandPink">
          {status}
        </span>
        ?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowConfirm(false)}
          className="px-4 py-2 rounded border"
        >
          Cancel
        </button>

<button
          onClick={updateStatus}   // ✅ FIXED
          disabled={updating}
          className={`px-5 py-2 rounded-lg text-white font-semibold transition
            ${
              updating
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-brandPink hover:bg-brandPinkLight"
            }`}
        >
          {updating ? "Updating..." : "Confirm Update"}
        </button>

      </div>

    </div>
  </div>
)}

        </div>


      </div>
    </AdminLayout>
  );
}
