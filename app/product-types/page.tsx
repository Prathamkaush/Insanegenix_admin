import { Suspense } from "react";
import AdminLayout from "@/components/AdminLayout";
import ProductTypesClient from "./ProductTypesClient";

export default function ProductTypesPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<div className="p-10">Loading…</div>}>
        <ProductTypesClient />
      </Suspense>
    </AdminLayout>
  );
}
