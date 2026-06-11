"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { AxiosError } from "axios";

interface DiscountProduct {
  id: number;
  title: string;
  price: number | string;
  discountType?: string | null;
  discountValue?: number | string | null;
}

interface DiscountModalProps {
  product: DiscountProduct;
  onClose: () => void;
  onSaved: () => void;
}

export default function DiscountModal({ product, onClose, onSaved }: DiscountModalProps) {
  const [type, setType] = useState(product.discountType || "");
  const [value, setValue] = useState(product.discountValue || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const numericValue = Number(value);
  const productPrice = Number(product.price);
  const invalidValue =
    Boolean(type) &&
    (!value ||
      !Number.isFinite(numericValue) ||
      numericValue <= 0 ||
      (type === "PERCENT" && numericValue > 100) ||
      (type === "FLAT" && numericValue >= productPrice));

  const handleValueChange = (nextValue: string) => {
    if (nextValue === "") {
      setValue("");
      setError("");
      return;
    }

    const nextNumber = Number(nextValue);
    if (!Number.isFinite(nextNumber) || nextNumber < 0) return;

    if (type === "PERCENT" && nextNumber > 100) {
      setError("Percentage discount cannot exceed 100%.");
      return;
    }

    if (type === "FLAT" && nextNumber >= productPrice) {
      setError(`Flat discount must be below Rs. ${productPrice}.`);
      return;
    }

    setValue(nextValue);
    setError("");
  };

  const save = async () => {
    if (invalidValue) {
      setError("Enter a discount value greater than 0.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await api.put(`/products/${product.id}/discount`, {
        discountType: type || null,
        discountValue: type ? numericValue : null,
      });
      onSaved();
    } catch (requestError: unknown) {
      const response = (
        requestError as AxiosError<{ message?: string }>
      ).response;
      setError(
        response?.data?.message || "Unable to update this discount.",
      );
    } finally {
      setSaving(false);
    }
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
            setError("");
          }}
        >
          <option value="" className="bg-zinc-950 text-white">No Discount</option>
          <option value="PERCENT" className="bg-zinc-950 text-white">Percentage</option>
          <option value="FLAT" className="bg-zinc-950 text-white">Flat Amount</option>
        </select>

        <input
          type="number"
          disabled={!type}
          min="0.01"
          max={type === "PERCENT" ? 100 : Math.max(0, productPrice - 0.01)}
          step="0.01"
          placeholder={
            type === "PERCENT"
              ? "Enter percentage (maximum 100)"
              : `Enter amount below Rs. ${productPrice}`
          }
          className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-brandRed focus:ring-2 focus:ring-brandRed/20"
          value={value}
          onChange={(e) => handleValueChange(e.target.value)}
        />

        {type && !error && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            {type === "PERCENT"
              ? "Allowed range: 0.01% to 100%"
              : `Allowed range: Rs. 0.01 to below Rs. ${productPrice}`}
          </p>
        )}

        {error && (
          <p className="rounded-md border border-brandRed/30 bg-brandRed/10 px-3 py-2 text-xs font-semibold text-red-300">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-md border border-white/10 bg-white/10 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/20"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving || invalidValue}
            className="px-5 py-2.5 rounded-md bg-brandRed text-white text-[11px] font-black uppercase tracking-widest transition-all hover:bg-white hover:text-brandBlack disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
