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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-brandPink mb-4">
          Order ID: {order.id}
        </h2>

        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span className="uppercase">{order.status}</span>
          </p>

          <p>
            <span className="font-semibold">Total Amount:</span> ₹
            {order.totalAmount}
          </p>

          <p>
            <span className="font-semibold">Placed On:</span>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>

          {order.user && (
            <>
              <p>
                <span className="font-semibold">Customer:</span>{" "}
                {order.user.name || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {order.user.phone || "N/A"}
              </p>
            </>
          )}
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-brandPink text-white rounded-lg hover:bg-brandPinkLight"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
