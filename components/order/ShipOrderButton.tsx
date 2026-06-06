"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function ShipOrderButton({
  orderId,
  status,
  onShipped,
  onError,
}: {
  orderId: number;
  status: string;
  onShipped: () => void;
  onError: (msg: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  if (status !== "CONFIRMED") return null;

  const handleShip = async () => {
    try {
      setLoading(true);
      await api.post(`/admin/shipping/delhivery/${orderId}`);
      onShipped();
    } catch (err: any) {
      onError(
        err.response?.data?.message ||
          "Shipment creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleShip}
      disabled={loading}
      className="px-4 py-2 bg-brandRed text-white rounded"
    >
      {loading ? "Creating shipment…" : "Ship with Delhivery"}
    </button>
  );
}
