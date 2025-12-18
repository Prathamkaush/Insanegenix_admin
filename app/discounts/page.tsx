"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import DiscountModal from "@/components/modals/DiscountModal";
import AdminLayout from "@/components/AdminLayout";

export default function DiscountsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  const fetchProducts = () => {
    api.get("/products").then((res) => {
      setProducts(res.data.products || []);
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Product Discounts</h1>

        <div className="space-y-4">
          {products.map((p) => {
            const hasDiscount = p.discountType === "PERCENT";
            const price = Number(p.price);
const discountValue = Number(p.discountValue || 0);

const finalPrice = hasDiscount
  ? price - (price * discountValue) / 100
  : price;

                return (
              <div
                key={p.id}
                className="flex items-center justify-between bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition"
              >
                {/* LEFT */}
                <div className="flex-1 pr-4">
                  <h3 className="font-medium text-brandBlack line-clamp-2">
                    {p.title}
                  </h3>

                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <span className="text-gray-400 line-through">
                      ₹{p.price}
                    </span>

                    <span className="text-lg font-semibold text-brandPink">
                      ₹{finalPrice.toFixed(0)}
                    </span>

                    {hasDiscount && (
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                        {p.discountValue}% OFF
                      </span>
                    )}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500 text-right">
                    <div>Discount</div>
                    <div className="font-medium">
                      {hasDiscount
                        ? `${p.discountValue}%`
                        : "—"}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelected(p)}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-brandPink text-white hover:bg-brandPinkLight transition"
                  >
                    {hasDiscount ? "Edit" : "Add"} Discount
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* MODAL */}
        {selected && (
          <DiscountModal
            product={selected}
            onClose={() => setSelected(null)}
            onSaved={() => {
              setSelected(null);
              fetchProducts();
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}
