"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiGrid, FiSave } from "react-icons/fi";

export default function EditProductTypePage() {
  const { id } = useParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [typeRes, catRes] = await Promise.all([
        api.get(`/product-types/${id}`),
        api.get("/categories"),
      ]);

      setName(typeRes.data.name);
      setCategoryId(typeRes.data.categoryId);
      setCategories(catRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Could not load product type data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const update = async () => {
    if (!name.trim() || !categoryId) return;

    try {
      setUpdating(true);
      await api.patch(`/product-types/${id}`, { name, categoryId: Number(categoryId) });
      router.push("/product-types");
    } catch {
      alert("Error updating product type");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page max-w-3xl">
        <div className="admin-hero">
          <div>
            <button onClick={() => router.back()} className="mb-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition hover:text-white">
              <FiArrowLeft size={14} /> Back to Types
            </button>
            <h1 className="admin-hero-title">
              Edit <span className="text-brandRed">Product Type</span>
            </h1>
            <p className="admin-hero-subtitle">Update type naming and category placement.</p>
          </div>
          <div className="admin-dark-button pointer-events-none">
            <FiGrid size={16} /> #{id}
          </div>
        </div>

        <section className="admin-surface p-6 md:p-8">
          {loading ? (
            <div className="py-10 text-center">
              <div className="mb-3 inline-block h-7 w-7 animate-spin rounded-full border-2 border-brandRed border-t-transparent" />
              <p className="text-[10px] font-black uppercase tracking-widest text-brandGray">Loading details...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="admin-label mb-2 block">Type Name</label>
                <input className="admin-field" placeholder="Enter type name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <label className="admin-label mb-2 block">Category</label>
                <select className="admin-field cursor-pointer" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={update}
                disabled={updating || !name.trim()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brandRed px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-brandBlack disabled:cursor-not-allowed disabled:bg-zinc-300"
              >
                {updating ? "Saving Changes..." : <><FiSave size={14} /> Update Product Type</>}
              </button>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
