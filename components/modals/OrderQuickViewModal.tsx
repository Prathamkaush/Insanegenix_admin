"use client";

import React from "react";

interface OrderQuickViewModalProps {
  order: any | null;
  onClose: () => void;
}

export default function OrderQuickViewModal({
  order,
  onClose,
}: OrderQuickViewModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-950/90 border border-white/10 w-full max-w-md rounded-xl shadow-2xl p-6 relative text-white">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-zinc-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <h2 className="text-xl font-black uppercase tracking-tight text-brandRed mb-4">
          Order ID: {order.id}
        </h2>

        <div className="space-y-2 text-sm text-zinc-300">
          <p>
            <span className="font-bold text-zinc-400">Status:</span>{" "}
            <span className="uppercase font-semibold">{order.status}</span>
          </p>

          <p>
            <span className="font-bold text-zinc-400">Total Amount:</span>{" "}
            <span className="font-semibold text-white">₹{order.totalAmount}</span>
          </p>

          <p>
            <span className="font-bold text-zinc-400">Placed On:</span>{" "}
            <span className="font-semibold">{new Date(order.createdAt).toLocaleString()}</span>
          </p>

          {order.user && (
            <>
              <p>
                <span className="font-bold text-zinc-400">Customer:</span>{" "}
                <span className="font-semibold">{order.user.name || "N/A"}</span>
              </p>
              <p>
                <span className="font-bold text-zinc-400">Phone:</span>{" "}
                <span className="font-semibold">{order.user.phone || "N/A"}</span>
              </p>
            </>
          )}
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-brandRed text-white text-[11px] font-black uppercase tracking-widest rounded-md hover:bg-white hover:text-brandBlack transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
