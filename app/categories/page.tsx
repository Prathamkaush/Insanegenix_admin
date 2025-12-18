"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.log("Error loading categories:", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const deleteCategory = async (id: number) => {
    if (!confirm("Delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`);
      loadCategories(); // refresh list
    } catch (err) {
      alert("Error deleting category");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-brandPink">Categories</h1>

        <Link
          href="/categories/create"
          className="px-4 py-2 rounded-lg bg-brandPink text-white hover:bg-brandPinkLight"
        >
          + Add Category
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat: any) => (
              <tr key={cat.id} className="border-b hover:bg-brandCream">
                <td className="p-3">{cat.id}</td>
                <td className="p-3">{cat.name}</td>
                <td className="p-3 text-right">
                  <Link
                    href={`/categories/edit/${cat.id}`}
                    className="px-3 py-1 bg-brandPink text-white rounded mr-2"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="px-3 py-1 bg-brandRed text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && (
          <p className="text-center text-brandGray mt-6">No categories found.</p>
        )}
      </div>
    </AdminLayout>
  );
}
