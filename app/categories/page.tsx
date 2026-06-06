"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import Link from "next/link";
import { FiFolder, FiPlus } from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

function categoryImageUrl(image?: string | null) {
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return `${API_URL}/uploads/categories/${image}`;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.log("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const deleteCategory = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      loadCategories();
    } catch (err) {
      alert("Error deleting category");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-hero">
          <div>
            <h1 className="admin-hero-title">
              Product <span className="text-brandRed">Categories</span>
            </h1>
            <p className="admin-hero-subtitle">
              Build the top-level structure for supplements and product discovery.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="admin-dark-button pointer-events-none">
              <FiFolder size={16} /> {categories.length} Groups
            </div>
          <Link href="/categories/create" className="admin-red-button w-full sm:w-auto">
            <FiPlus size={14} /> Add Category
          </Link>
          </div>
        </div>

        <div className="admin-table">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="admin-table-head">
                  <th className="admin-th text-left">ID</th>
                  <th className="admin-th text-left">Image</th>
                  <th className="admin-th text-left">Name</th>
                  <th className="admin-th text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {!loading &&
                  categories.map((cat) => (
                    <tr key={cat.id} className="admin-row group">
                      <td className="p-4 text-white font-black text-sm">#{cat.id}</td>
                      <td className="p-4">
                        {cat.image ? (
                          <img
                            src={categoryImageUrl(cat.image)}
                            alt={cat.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 text-zinc-500">
                            <FiFolder size={18} />
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-white font-semibold">{cat.name}</td>
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        <Link
                          href={`/categories/edit/${cat.id}`}
                          className="inline-block px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-brandRed/10 text-brandRed rounded-md hover:bg-brandRed hover:text-white transition-all"
                        >
                          Edit
                        </Link>

                        <Link
                          href={`/product-types?categoryId=${cat.id}`}
                          className="inline-block px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-white/5 text-zinc-300 rounded-md hover:bg-white/10 hover:text-white transition-all"
                        >
                          Types
                        </Link>

                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-white/5 text-zinc-400 rounded-md hover:bg-brandRed hover:text-white transition-all"
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
              <div className="animate-spin inline-block w-6 h-6 border-2 border-brandRed border-t-transparent rounded-full mb-3"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading categories...</p>
            </div>
          )}

          {!loading && categories.length === 0 && (
            <div className="p-14 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No categories found.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
