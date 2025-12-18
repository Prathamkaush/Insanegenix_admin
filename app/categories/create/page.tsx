"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { useRouter } from "next/navigation";

export default function CreateCategoryPage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const create = async () => {
    try {
      await api.post("/categories", { name });
      router.push("/categories");
    } catch (err) {
      alert("Error creating category");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-brandPink mb-6">
        Create Category
      </h1>

      <div className="bg-white p-6 rounded-xl shadow w-96">
        <label className="block mb-2">Category Name</label>
        <input
          className="border p-2 rounded w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={create}
          className="mt-4 px-4 py-2 bg-brandPink text-white rounded hover:bg-brandPinkLight"
        >
          Save
        </button>
      </div>
    </AdminLayout>
  );
}
