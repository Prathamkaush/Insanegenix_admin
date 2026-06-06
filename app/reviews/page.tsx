"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { FiStar } from "react-icons/fi";

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
        setReviews(res.data.data || []);
        setPages(res.data.pages || 1);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-hero">
          <div>
            <h1 className="admin-hero-title">
              Product <span className="text-brandRed">Reviews</span>
            </h1>
            <p className="admin-hero-subtitle">
              Moderate ratings, product proof, and customer comments.
            </p>
          </div>
          <div className="admin-dark-button pointer-events-none">
            <FiStar size={16} /> Reviews
          </div>
        </div>

        {loading && (
          <div className="bg-white border border-zinc-200 rounded-md p-14 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading reviews...</p>
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <div className="bg-white border-2 border-dashed border-zinc-200 rounded-md p-14 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No reviews found.</p>
          </div>
        )}

        {!loading && reviews.length > 0 && (
          <div className="bg-white border border-zinc-200 rounded-md shadow-sm divide-y divide-gray-100">
            {reviews.map((r) => (
              <div key={r.id} className="p-5 space-y-2 hover:bg-gray-50/60 transition-colors">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <p className="font-black text-brandBlack uppercase tracking-tight">
                    {r.product.title}
                  </p>

                  <p className="text-brandRed text-[11px] font-black uppercase tracking-widest">
                    {"★".repeat(r.rating)}
                  </p>
                </div>

                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {r.user?.name || "Anonymous"}
                </p>

                {r.comment && (
                  <p className="text-sm mt-3 text-gray-700">
                    {r.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-12 mb-8 gap-4 items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-md hover:border-brandRed hover:text-brandRed transition-all disabled:opacity-30"
          >
            ←
          </button>

          <p className="bg-white px-6 py-2 rounded-md border border-gray-100 shadow-sm font-bold text-brandBlack">
            Page {page} <span className="text-brandGray font-normal mx-1">of</span> {pages}
          </p>

          <button
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
            className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-md hover:border-brandRed hover:text-brandRed transition-all disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
