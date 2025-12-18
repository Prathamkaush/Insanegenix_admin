"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function DiscountModal({ product, onClose, onSaved }) {
  const [type, setType] = useState(product.discountType || "");
  const [value, setValue] = useState(product.discountValue || "");

  const save = async () => {
    await api.put(`/products/${product.id}/discount`, {
      discountType: type || null,
      discountValue: type ? Number(value) : null,
    });

    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-xl p-5 space-y-4">

        <h2 className="text-lg font-bold">
          Discount – {product.title}
        </h2>

        <select
          className="border p-2 w-full"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setValue("");
          }}
        >
          <option value="">No Discount</option>
          <option value="PERCENT">Percentage</option>
          <option value="FLAT">Flat Amount</option>
        </select>

        <input
          type="number"
          disabled={!type}
          placeholder="Discount value"
          className="border p-2 w-full"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={save}
            className="bg-brandPink text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
