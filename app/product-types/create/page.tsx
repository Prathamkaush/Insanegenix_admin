"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateProductTypePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const create = async () => {
    try {
      await api.post("/product-types", {
        name,
        categoryId: Number(categoryId),
      });

      router.push("/product-types");
    } catch {
      alert("Error creating product type");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-brandPink mb-6">Create Product Type</h1>

      <div className="bg-white p-6 rounded-xl shadow w-96">
        <label className="block mb-2">Type Name</label>
        <input
          className="border p-2 rounded w-full mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block mb-2">Select Category</label>
        <select
          className="border p-2 rounded w-full mb-4"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">-- choose category --</option>

          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <button
          onClick={create}
          className="w-full bg-brandPink text-white p-2 rounded hover:bg-brandPinkLight"
        >
          Save
        </button>
      </div>
    </AdminLayout>
  );
}
