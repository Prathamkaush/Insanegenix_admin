"use client";

import AdminLayout from "@/components/AdminLayout";
import SupplementProductForm from "@/components/products/SupplementProductForm";

export default function CreateProductPage() {
  return (
    <AdminLayout>
      <SupplementProductForm mode="create" />
    </AdminLayout>
  );
}
