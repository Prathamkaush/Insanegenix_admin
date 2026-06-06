"use client";

import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import Link from "next/link";
import { Flame, Search } from "lucide-react";

export default function AdminTrendingProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrending = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/products", {
        params: { trending: "true", limit: 50 },
      });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Error fetching trending products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  const removeTrending = async (id: number) => {
    if (!confirm("Remove this product from trending?")) return;

    try {
      await api.put(`/products/${id}`, {
        isTrending: "false",
      });
      fetchTrending();
    } catch (err) {
      alert("Error removing trending status");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-hero">
          <div>
            <h1 className="admin-hero-title">
              Trending <span className="text-brandRed">Products</span>
            </h1>
            <p className="admin-hero-subtitle">
              Manage spotlight supplements appearing across homepage rails.
            </p>
          </div>
          <div className="admin-dark-button pointer-events-none">
            <Flame size={16} /> {products.length} Trending
          </div>
        </div>

        <div className="admin-table">
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin inline-block w-8 h-8 border-[3px] border-brandRed border-t-transparent rounded-full mb-3"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-brandGray">Scanning catalog...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center">
              <Search className="mx-auto text-gray-200 mb-4" size={52} />
              <p className="text-[10px] font-black uppercase tracking-widest text-brandGray">No trending products found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse">
                <thead>
                  <tr className="admin-table-head">
                    <th className="admin-th text-left">Product</th>
                    <th className="admin-th text-center">Price</th>
                    <th className="admin-th text-center">Stock</th>
                    <th className="admin-th text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="admin-row group">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-zinc-100 border border-zinc-200 flex-shrink-0">
                            {p.img1 ? (
                              <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${p.img1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                alt={p.title}
                              />
                            ) : (
                              <img src="/insanegenix/product/Whey.png" className="w-full h-full object-contain p-2" alt="" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-brandBlack truncate max-w-[220px] lg:max-w-md group-hover:text-brandRed transition-colors">
                              {p.title}
                            </p>
                            <p className="text-[10px] text-brandGray font-black uppercase tracking-widest">ID: #{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-black text-brandBlack">Rs. {Number(p.price || 0).toLocaleString()}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                          p.stock < 5 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                        }`}>
                          {p.stock} in stock
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2 text-nowrap">
                        <Link
                          href={`/products/edit/${p.id}`}
                          className="inline-block px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-red-50 text-brandRed rounded-md hover:bg-brandRed hover:text-white transition-all"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => removeTrending(p.id)}
                          className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-zinc-100 text-zinc-700 rounded-md hover:bg-brandBlack hover:text-white transition-all"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
