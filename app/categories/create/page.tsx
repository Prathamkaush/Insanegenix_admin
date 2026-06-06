"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiFolder, FiSave } from "react-icons/fi";

export default function CreateCategoryPage() {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const create = async () => {
    if (!name.trim()) return;

    try {
      setCreating(true);
      const formData = new FormData();
      formData.append("name", name);
      if (image) formData.append("image", image);

      await api.post("/categories", formData);
      router.push("/categories");
    } catch (err) {
      alert("Error creating category");
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page max-w-3xl">
        <div className="admin-hero">
          <div>
            <button
              onClick={() => router.back()}
              className="mb-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition hover:text-white"
            >
              <FiArrowLeft size={14} /> Back to Categories
            </button>
            <h1 className="admin-hero-title">
              New <span className="text-brandRed">Category</span>
            </h1>
            <p className="admin-hero-subtitle">
              Create a top-level catalog group for the supplement inventory.
            </p>
          </div>
          <div className="admin-dark-button pointer-events-none">
            <FiFolder size={16} /> Catalog
          </div>
        </div>

        <section className="admin-surface p-6 md:p-8 space-y-6">
          <div>
            <label className="admin-label mb-2 block">Category Name</label>
            <input
              className="admin-field"
              placeholder="Enter category name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && create()}
              autoFocus
            />
          </div>

          <div>
            <label className="admin-label mb-2 block">Category Image</label>
            <input
              className="admin-field"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
            {image ? (
              <div className="mt-4 flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-3">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Category preview"
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <p className="text-xs font-semibold text-zinc-300">{image.name}</p>
              </div>
            ) : null}
          </div>

          <button
            onClick={create}
            disabled={creating || !name.trim()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brandRed px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-brandBlack disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            {creating ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <FiSave size={14} /> Save Category
              </>
            )}
          </button>
        </section>
      </div>
    </AdminLayout>
  );
}
