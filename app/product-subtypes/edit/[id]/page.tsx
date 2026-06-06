"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { FiArrowLeft, FiLayers, FiSave } from "react-icons/fi";

export default function EditProductSubtypePage() {
  const router = useRouter();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [productTypeId, setProductTypeId] = useState<number | "">("");
  const [productTypes, setProductTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [typesRes, subtypeRes] = await Promise.all([
        api.get("/product-types"),
        api.get(`/product-subtypes/${id}`),
      ]);

      setProductTypes(typesRes.data);
      setName(subtypeRes.data.name);
      setProductTypeId(subtypeRes.data.productTypeId);
    } catch (err) {
      console.error("Failed to load data", err);
      alert("Error loading subtype details");
      router.push("/product-subtypes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !productTypeId) return;

    try {
      setSubmitting(true);
      await api.patch(`/product-subtypes/${id}`, { name, typeId: productTypeId });
      router.push("/product-subtypes");
    } catch (err) {
      alert("Error updating product subtype");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page max-w-3xl">
        <div className="admin-hero">
          <div>
            <button onClick={() => router.back()} className="mb-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition hover:text-white">
              <FiArrowLeft size={14} /> Back to Subtypes
            </button>
            <h1 className="admin-hero-title">
              Edit <span className="text-brandRed">Subtype</span>
            </h1>
            <p className="admin-hero-subtitle">Update subtype naming and parent type.</p>
          </div>
          <div className="admin-dark-button pointer-events-none">
            <FiLayers size={16} /> #{id}
          </div>
        </div>

        <section className="admin-surface p-6 md:p-8">
          {loading ? (
            <div className="py-10 text-center">
              <div className="mb-3 inline-block h-7 w-7 animate-spin rounded-full border-2 border-brandRed border-t-transparent" />
              <p className="text-[10px] font-black uppercase tracking-widest text-brandGray">Loading details...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="admin-label mb-2 block">Subtype Name</label>
                <input className="admin-field" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Micronized" required />
              </div>

              <div>
                <label className="admin-label mb-2 block">Parent Product Type</label>
                <select className="admin-field cursor-pointer" value={productTypeId} onChange={(e) => setProductTypeId(Number(e.target.value))} required>
                  <option value="">Select product type</option>
                  {productTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-zinc-100 pt-6">
                <button type="button" onClick={() => router.back()} className="rounded-md border border-zinc-200 bg-white px-5 py-3 text-[11px] font-black uppercase tracking-widest text-zinc-600 transition hover:border-brandBlack hover:text-brandBlack">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-brandRed px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-brandBlack disabled:cursor-not-allowed disabled:bg-zinc-300"
                >
                  {submitting ? "Saving..." : <><FiSave size={14} /> Update Subtype</>}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
