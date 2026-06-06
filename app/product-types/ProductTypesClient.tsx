"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import { FiGrid, FiPlus } from "react-icons/fi";

export default function ProductTypesClient() {
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = searchParams.get("categoryId");

  const loadTypes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/product-types", {
        params: categoryId ? { categoryId } : {},
      });
      setTypes(res.data);
    } catch (err) {
      console.error("Error loading product types", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTypes();
  }, [categoryId]);

  const deleteType = async (id: number) => {
    if (!confirm("Delete this product type?")) return;
    try {
      await api.delete(`/product-types/${id}`);
      loadTypes();
    } catch {
      alert("Error deleting type");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-hero">
        <div>
          <h1 className="admin-hero-title">
            Product <span className="text-brandRed">Types</span>
          </h1>
          <p className="admin-hero-subtitle">
            Organize category families for clean supplement navigation.
          </p>

          {categoryId && (
            <button
              onClick={() => router.push("/categories")}
              className="text-[10px] font-black uppercase tracking-widest text-brandRed hover:text-white mt-3 block transition-colors"
            >
              Clear Filter (Category ID: {categoryId})
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="admin-dark-button pointer-events-none">
            <FiGrid size={16} /> Types
          </div>
        <Link
          href={
            categoryId
              ? `/product-types/create?categoryId=${categoryId}`
              : "/product-types/create"
          }
          className="admin-red-button w-full md:w-auto"
        >
          <FiPlus size={14} /> Add Product Type
        </Link>
        </div>
      </div>

      <div className="admin-table">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="admin-table-head">
                <th className="admin-th text-left">ID</th>
                <th className="admin-th text-left">Name</th>
                <th className="admin-th text-left">Category</th>
                <th className="admin-th text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                types.map((type) => (
                  <tr key={type.id} className="admin-row">
                    <td className="p-4 text-brandBlack font-black text-sm">#{type.id}</td>
                    <td className="p-4 font-semibold text-brandBlack">{type.name}</td>
                    <td className="p-4 text-sm text-gray-500">
                      {type.category?.name || "Uncategorized"}
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <Link
                        href={`/product-types/edit/${type.id}`}
                        className="inline-block px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-red-50 text-brandRed rounded-md hover:bg-brandRed hover:text-white transition-all"
                      >
                        Edit
                      </Link>

                      <Link
                        href={`/product-subtypes?typeId=${type.id}`}
                        className="inline-block px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-zinc-100 text-zinc-700 rounded-md hover:bg-brandBlack hover:text-white transition-all"
                      >
                        Subtypes
                      </Link>

                      <button
                        onClick={() => deleteType(type.id)}
                        className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-zinc-100 text-zinc-600 rounded-md hover:bg-brandBlack hover:text-white transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="p-14 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
            Loading product types...
          </div>
        )}

        {!loading && types.length === 0 && (
          <div className="p-14 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
            No product types found.
          </div>
        )}
      </div>
    </div>
  );
}
