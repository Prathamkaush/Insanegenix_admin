"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { useRouter, useParams } from "next/navigation";
import { FiArrowLeft, FiFolder, FiSave } from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

function categoryImageUrl(image?: string | null) {
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return `${API_URL}/uploads/categories/${image}`;
}

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const loadCategory = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/categories/${id}`);
      setName(res.data.name);
      setCurrentImage(res.data.image || "");
    } catch (err) {
      console.error("Error loading category:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategory();
  }, [id]);

  const update = async () => {
    if (!name.trim()) return;

    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append("name", name);
      if (image) formData.append("image", image);

      await api.patch(`/categories/${id}`, formData);
      router.push("/categories");
    } catch (err) {
      alert("Error updating category");
    } finally {
      setUpdating(false);
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
              Edit <span className="text-brandRed">Category</span>
            </h1>
            <p className="admin-hero-subtitle">
              Update this top-level catalog grouping.
            </p>
          </div>
          <div className="admin-dark-button pointer-events-none">
            <FiFolder size={16} /> #{id}
          </div>
        </div>

        <section className="admin-surface p-6 md:p-8">
          {loading ? (
            <div className="flex flex-col items-center py-10">
              <div className="mb-3 h-7 w-7 animate-spin rounded-full border-2 border-brandRed border-t-transparent" />
              <p className="text-[10px] font-black uppercase tracking-widest text-brandGray">Fetching details...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="admin-label mb-2 block">Category Name</label>
                <input
                  className="admin-field"
                  placeholder="Enter category name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && update()}
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
                {image || currentImage ? (
                  <div className="mt-4 flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-3">
                    <img
                      src={image ? URL.createObjectURL(image) : categoryImageUrl(currentImage)}
                      alt="Category preview"
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <p className="text-xs font-semibold text-zinc-300">
                      {image ? image.name : "Current image"}
                    </p>
                  </div>
                ) : null}
              </div>

              <button
                onClick={update}
                disabled={updating || !name.trim()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brandRed px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-brandBlack disabled:cursor-not-allowed disabled:bg-zinc-300"
              >
                {updating ? "Saving Changes..." : <><FiSave size={14} /> Update Category</>}
              </button>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
