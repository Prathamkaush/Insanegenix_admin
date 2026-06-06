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

  useEffect(() => {
    if (!productId) return;

    api
      .get(`/products/${productId}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error(err);
        alert("Unable to load product");
      })
      .finally(() => setLoading(false));
  }, [productId]);

  return (
    <AdminLayout>
      {loading ? (
        <AdminLoader />
      ) : (
        <SupplementProductForm mode="edit" productId={productId} initialProduct={product} />
      )}
    </AdminLayout>
  );
}
