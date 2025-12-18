"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    api
      .get(`/reviews/admin?page=${page}&limit=5`)
      .then((res) => {
        setReviews(res.data.data);   // ✅ FIX
        setPages(res.data.pages);    // ✅ STORE TOTAL PAGES
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">

        <h1 className="text-2xl font-bold text-brandPink">
          Product Reviews
        </h1>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-500 py-10">
            Loading reviews…
          </p>
        )}

        {/* EMPTY */}
        {!loading && reviews.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            No reviews found.
          </p>
        )}

        {/* LIST */}
        <div className="bg-white rounded-xl shadow divide-y">
          {reviews.map((r) => (
            <div key={r.id} className="p-5 space-y-1">

              <div className="flex justify-between items-center">
                <p className="font-semibold">
                  {r.product.title}
                </p>

                <p className="text-yellow-500 text-sm">
                  {"★".repeat(r.rating)}
                </p>
              </div>

              <p className="text-sm text-gray-500">
                {r.user?.name || "Anonymous"}
              </p>

              {r.comment && (
                <p className="text-sm mt-2 text-gray-700">
                  {r.comment}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <p className="text-sm text-gray-500">
            Page {page} of {pages}
          </p>

          <button
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

      </div>
    </AdminLayout>
  );
}
