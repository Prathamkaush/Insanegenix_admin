"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import { FiLayers, FiPlus } from "react-icons/fi";

export default function ProductSubtypesClient() {
  const [subtypes, setSubtypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const typeId = searchParams.get("typeId");

  useEffect(() => {
    const loadSubtypes = async () => {
      try {
        setLoading(true);
        const res = await api.get("/product-subtypes", {
          params: typeId ? { typeId } : {},
        });
        setSubtypes(res.data);
      } catch (err) {
        console.error("Error loading subtypes:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSubtypes();
  }, [typeId]);

  const deleteSubtype = async (id: number) => {
    if (!confirm("Delete this subtype?")) return;
    try {
      await api.delete(`/product-subtypes/${id}`);
      setSubtypes((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert("Error deleting subtype");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-hero">
        <div>
          <h1 className="admin-hero-title">
            Product <span className="text-brandRed">Subtypes</span>
          </h1>
          <p className="admin-hero-subtitle">
            Fine tune product discovery beneath each supplement type.
          </p>
          {typeId && (
            <button
              onClick={() => router.push("/product-types")}
              className="text-[10px] font-black uppercase tracking-widest text-brandRed hover:text-white mt-3 block transition-colors"
            >
              Back to All Types
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
        <div className="admin-dark-button pointer-events-none">
          <FiLayers size={16} /> Subtypes
        </div>
        <Link
          href={typeId ? `/product-subtypes/create?typeId=${typeId}` : "/product-subtypes/create"}
          className="admin-red-button w-full md:w-auto"
        >
          <FiPlus size={14} /> Add Subtype
        </Link>
        </div>
      </div>

      <div className="admin-table">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="admin-table-head">
                <th className="admin-th text-left">ID</th>
                <th className="admin-th text-left">Name</th>
                <th className="admin-th text-left">Parent Type</th>
                <th className="admin-th text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {!loading && subtypes.map((s) => (
                <tr key={s.id} className="admin-row">
                  <td className="p-4 text-brandBlack font-black text-sm">#{s.id}</td>
                  <td className="p-4 text-brandBlack font-semibold">{s.name}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-zinc-100 text-zinc-700 text-[10px] font-black uppercase tracking-widest rounded-md">
                      {s.type?.name || "N/A"}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <Link
                      href={`/product-subtypes/edit/${s.id}`}
                      className="inline-block px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-red-50 text-brandRed rounded-md hover:bg-brandRed hover:text-white transition-all"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteSubtype(s.id)}
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
          <div className="p-14 text-center">
            <div className="animate-spin inline-block w-7 h-7 border-[3px] border-brandRed border-t-transparent rounded-full mb-3"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading subtypes...</p>
          </div>
        )}

        {!loading && subtypes.length === 0 && (
          <div className="p-14 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
            No subtypes found.
          </div>
        )}
      </div>
    </div>
  );
}
