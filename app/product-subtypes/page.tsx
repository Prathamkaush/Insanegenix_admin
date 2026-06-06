import { Suspense } from "react";
import AdminLayout from "@/components/AdminLayout";
import ProductSubtypesClient from "./ProductSubtypesClient";

export default function ProductSubtypesPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<Loading />}>
        <ProductSubtypesClient />
      </Suspense>
    </AdminLayout>
  );
}

function Loading() {
  return (
    <div className="p-16 text-center">
      <div className="animate-spin inline-block w-8 h-8 border-[3px] border-brandRed border-t-transparent rounded-full mb-3"></div>
      <p className="text-brandGray text-sm font-medium">
        Loading product subtypes...
      </p>
    </div>
  );
}
