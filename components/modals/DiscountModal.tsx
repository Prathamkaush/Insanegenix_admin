"use client";

import { useState } from "react";
import { api } from "@/lib/api";


interface DiscountModalProps {
  product: any; // Ideally replace 'any' with your Product interface
  onClose: () => void;
  onSaved: () => void;
}

export default function DiscountModal({ product, onClose, onSaved }: DiscountModalProps) {
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-zinc-950/90 border border-white/10 w-96 rounded-xl p-5 space-y-4 text-white">

        <h2 className="text-lg font-black uppercase tracking-tight text-white">
          Discount – {product.title}
        </h2>

        <select
          className="w-full rounded-md border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-brandRed focus:ring-2 focus:ring-brandRed/20"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setValue("");
          }}
        >
          <option value="" className="bg-zinc-950 text-white">No Discount</option>
          <option value="PERCENT" className="bg-zinc-950 text-white">Percentage</option>
          <option value="FLAT" className="bg-zinc-950 text-white">Flat Amount</option>
        </select>

        <input
          type="number"
          disabled={!type}
          placeholder="Discount value"
          className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-brandRed focus:ring-2 focus:ring-brandRed/20"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-md border border-white/10 bg-white/10 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/20"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-5 py-2.5 rounded-md bg-brandRed text-white text-[11px] font-black uppercase tracking-widest transition-all hover:bg-white hover:text-brandBlack"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
