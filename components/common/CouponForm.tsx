"use client";

import { useState } from "react";

type Props = {
  initial?: any;
  onSubmit: (data: any) => Promise<void>;
};



export default function CouponForm({ initial, onSubmit }: Props) {
  const [form, setForm] = useState({
    code: initial?.code || "",
    type: initial?.type || "PERCENT",
    value: initial?.value || "",
    minOrderValue: initial?.minOrderValue || "",
    maxDiscount: initial?.maxDiscount || "",
    usageLimit: initial?.usageLimit || "",
    expiresAt: initial?.expiresAt?.slice(0, 10) || "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4 bg-white p-6 rounded-xl shadow max-w-xl"
    >
      <input
        placeholder="Coupon Code"
        className="input"
        value={form.code}
        onChange={(e) => setForm({ ...form, code: e.target.value })}
        required
      />

      <select
        className="input"
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option value="PERCENT">Percent</option>
        <option value="FLAT">Flat</option>
      </select>

      <input
        type="number"
        placeholder="Value"
        className="input"
        value={form.value}
        onChange={(e) => setForm({ ...form, value: e.target.value })}
        required
      />

      <input type="number" placeholder="Min Order Value" className="input" />
      <input type="number" placeholder="Max Discount" className="input" />
      <input type="number" placeholder="Usage Limit" className="input" />
      <input type="date" className="input" />

      <button className="w-full bg-brandRed text-white py-3 rounded-lg">
        Save Coupon
      </button>
    </form>
  );
}
