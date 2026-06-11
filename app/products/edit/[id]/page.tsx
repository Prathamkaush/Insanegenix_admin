"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import SupplementProductForm from "@/components/products/SupplementProductForm";
import { api } from "@/lib/api";
import AdminLoader from "@/components/AdminLoader";

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!productId) return;

    api
      .get(`/products/${productId}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error(err);
        setLoadError(
          err.response?.data?.message || "Unable to load this product",
        );
      })
      .finally(() => setLoading(false));
  }, [productId]);

  return (
    <AdminLayout>
      {loading ? (
        <AdminLoader />
      ) : loadError || !product ? (
        <div className="admin-surface mx-auto max-w-xl p-8 text-center">
          <h1 className="text-lg font-black uppercase tracking-tight text-white">
            Product could not be loaded
          </h1>
          <p className="mt-3 text-sm text-zinc-400">{loadError}</p>
        </div>
      ) : (
        <SupplementProductForm mode="edit" productId={productId} initialProduct={product} />
      )}
    </AdminLayout>
  );
}
