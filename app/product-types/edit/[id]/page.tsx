"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";

export default function EditProductTypePage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  const loadData = async () => {
    const [typeRes, catRes] = await Promise.all([
      api.get(`/product-types/${id}`),
      api.get("/categories"),
    ]);

    const type = typeRes.data;
    setName(type.name);
    setCategoryId(type.categoryId);
    setCategories(catRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const update = async () => {
    try {
      await api.patch(`/product-types/${id}`, {
        name,
        categoryId: Number(categoryId),
      });
      router.push("/product-types");
    } catch {
      alert("Error updating product type");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-brandPink mb-6">Edit Product Type</h1>

      <div className="bg-white p-6 rounded-xl shadow w-96">
        <label className="block mb-2">Type Name</label>
        <input
          className="border p-2 rounded w-full mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block mb-2">Category</label>
        <select
          className="border p-2 rounded w-full mb-4"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <button
          onClick={update}
          className="w-full bg-brandPink text-white p-2 rounded hover:bg-brandPinkLight"
        >
          Update
        </button>
      </div>
    </AdminLayout>
  );
}
