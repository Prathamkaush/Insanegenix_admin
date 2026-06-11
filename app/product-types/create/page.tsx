"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeft, FiGrid, FiSave } from "react-icons/fi";

type CategoryOption = {
  id: number;
  name: string;
};

export default function CreateProductTypePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error loading categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    const selectedCategoryId = searchParams.get("categoryId");
    if (selectedCategoryId) setCategoryId(selectedCategoryId);
  }, [searchParams]);

  const create = async () => {
    if (!name.trim() || !categoryId) return;

    try {
      setCreating(true);
      await api.post("/product-types", { name, categoryId: Number(categoryId) });
      router.push(searchParams.get("returnTo") || "/product-types");
    } catch {
      alert("Error creating product type");
    } finally {
      setCreating(false);
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
              Create <span className="text-brandRed">Product Type</span>
            </h1>
            <p className="admin-hero-subtitle">Attach a product type to a category family.</p>
          </div>
          <div className="admin-dark-button pointer-events-none">
            <FiGrid size={16} /> Type Builder
          </div>
        </div>

        <section className="admin-surface p-6 md:p-8">
          {loading ? (
            <div className="py-10 text-center">
              <div className="mb-3 inline-block h-7 w-7 animate-spin rounded-full border-2 border-brandRed border-t-transparent" />
              <p className="text-[10px] font-black uppercase tracking-widest text-brandGray">Loading categories...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="admin-label mb-2 block">Type Name</label>
                <input className="admin-field" autoFocus placeholder="e.g. Creatine" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <label className="admin-label mb-2 block">Select Category</label>
                <select className="admin-field cursor-pointer" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  <option value="">Choose Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={create}
                disabled={creating || !name.trim() || !categoryId}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brandRed px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-brandBlack disabled:cursor-not-allowed disabled:bg-zinc-300"
              >
                {creating ? "Saving..." : <><FiSave size={14} /> Save Product Type</>}
              </button>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
