"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import TrackingTimeline from "@/components/order/TrackingTimeline";

export default function UserOrderTracking({ params }: any) {
  const [tracking, setTracking] = useState<any>(null);

  useEffect(() => {
    api.get(`/orders/${params.id}/tracking`).then((res) => {
      setTracking(res.data);
    });
  }, [params.id]);

  if (!tracking) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">
        Track Your Order
      </h1>

      <p className="text-sm mb-4">
        Current Status: <b>{tracking.status}</b>
      </p>

      <TrackingTimeline scans={tracking.scans} />
    </div>
  );
}
