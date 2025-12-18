"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { useRouter, useParams } from "next/navigation";

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");

  const loadCategory = async () => {
    const res = await api.get(`/categories/${id}`);
    setName(res.data.name);
  };

  useEffect(() => {
    loadCategory();
  }, []);

  const update = async () => {
    try {
      await api.patch(`/categories/${id}`, { name });
      router.push("/categories");
    } catch (err) {
      alert("Error updating category");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-brandPink mb-6">
        Edit Category
      </h1>

      <div className="bg-white p-6 rounded-xl shadow w-96">
        <label className="block mb-2">Category Name</label>
        <input
          className="border p-2 rounded w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={update}
          className="mt-4 px-4 py-2 bg-brandPink text-white rounded hover:bg-brandPinkLight"
        >
          Update
        </button>
      </div>
    </AdminLayout>
  );
}
