"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import DiscountModal from "@/components/modals/DiscountModal";
import AdminLayout from "@/components/AdminLayout";
import { FiPercent } from "react-icons/fi";

export default function DiscountsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Error fetching products for discounts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const activeOffers = products.filter(
    (p) => ["PERCENT", "FLAT"].includes(p.discountType) && Number(p.discountValue) > 0,
  ).length;

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-hero">
          <div>
            <h1 className="admin-hero-title">
              Product <span className="text-brandRed">Discounts</span>
            </h1>
            <p className="admin-hero-subtitle">
              Apply percentage offers to the supplement catalog.
            </p>
          </div>
          <div className="admin-dark-button pointer-events-none">
            <FiPercent size={16} /> {activeOffers} Active Offers
          </div>
        </div>

        {loading ? (
          <div className="bg-white border border-zinc-200 rounded-md p-16 text-center shadow-sm">
            <div className="animate-spin w-9 h-9 border-[3px] border-brandRed border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Calculating prices...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((p) => {
              const hasDiscount =
                ["PERCENT", "FLAT"].includes(p.discountType) &&
                Number(p.discountValue) > 0;
              const price = Number(p.price);
              const discountValue = Number(p.discountValue || 0);
              const finalPrice =
                p.discountType === "PERCENT"
                  ? price - (price * discountValue) / 100
                  : p.discountType === "FLAT"
                    ? price - discountValue
                    : price;

              return (
                <div
                  key={p.id}
                  className="group flex flex-col md:flex-row items-start md:items-center justify-between bg-white rounded-md border border-zinc-200 p-5 hover:shadow-md hover:border-brandRed/30 transition-all"
                >
                  <div className="flex-1 w-full md:pr-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: #{p.id}</span>
                      {hasDiscount && (
                        <span className="bg-emerald-500 text-white px-2 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest">
                          Active
                        </span>
                      )}
                    </div>
                    <h3 className="font-black text-brandBlack text-lg line-clamp-1 group-hover:text-brandRed transition-colors">
                      {p.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-5 mt-4">
                      <div>
                        <span className="admin-label block mb-1">Final Price</span>
                        <span className="text-2xl font-black text-brandBlack">Rs. {finalPrice.toFixed(0)}</span>
                      </div>

                      {hasDiscount && (
                        <>
                          <div>
                            <span className="admin-label block mb-1">Original</span>
                            <span className="text-sm text-gray-400 line-through font-bold">Rs. {p.price}</span>
                          </div>
                          <div className="bg-brandRed text-white px-3 py-2 rounded-md text-[10px] font-black uppercase tracking-widest">
                            -{p.discountValue}{p.discountType === "PERCENT" ? "%" : " Rs."}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelected(p)}
                    className={`mt-5 md:mt-0 w-full md:w-auto px-6 py-3 rounded-md text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                      hasDiscount
                        ? "bg-brandRed text-white hover:bg-brandBlack"
                        : "bg-brandBlack text-white hover:bg-brandRed"
                    }`}
                  >
                    {hasDiscount ? "Edit Discount" : "Add Discount"}
                  </button>
                </div>
              );
            })}

            {products.length === 0 && (
              <div className="bg-white p-16 text-center rounded-md border-2 border-dashed border-zinc-200">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No products found to discount.</p>
              </div>
            )}
          </div>
        )}

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
