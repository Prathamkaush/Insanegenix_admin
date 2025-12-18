"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import Link from "next/link";

export default function ProductTypesPage() {
  const [types, setTypes] = useState([]);

  const loadTypes = async () => {
    try {
      const res = await api.get("/product-types");
      setTypes(res.data);
    } catch (err) {
      console.log("Error loading product types", err);
    }
  };

  useEffect(() => {
    loadTypes();
  }, []);

  const deleteType = async (id: number) => {
    if (!confirm("Delete this product type?")) return;

    try {
      await api.delete(`/product-types/${id}`);
      loadTypes();
    } catch {
      alert("Error deleting type");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-brandPink">Product Types</h1>

        <Link
          href="/product-types/create"
          className="px-4 py-2 bg-brandPink text-white rounded hover:bg-brandPinkLight"
        >
          + Add Product Type
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {types.map((type: any) => (
              <tr key={type.id} className="border-b">
                <td className="p-3">{type.id}</td>
                <td className="p-3">{type.name}</td>
                <td className="p-3">{type.category?.name || "-"}</td>

                <td className="p-3 text-right">
                  <Link
                    href={`/product-types/edit/${type.id}`}
                    className="px-3 py-1 bg-brandPink text-white rounded mr-2"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteType(type.id)}
                    className="px-3 py-1 bg-brandRed text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {types.length === 0 && (
          <p className="text-center text-brandGray mt-6">No types found.</p>
        )}
      </div>
    </AdminLayout>
  );
}
