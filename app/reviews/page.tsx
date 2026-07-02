"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FiCheck, FiCheckSquare, FiSquare, FiStar, FiTrash2, FiX } from "react-icons/fi";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";

type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

type Review = {
  id: number;
  rating: number;
  comment?: string | null;
  status: ReviewStatus;
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
  product: {
    id: number;
    title: string;
  };
};

const statusStyles: Record<ReviewStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED: "border-red-200 bg-red-50 text-red-700",
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [ratingFilter, setRatingFilter] = useState<"all" | number>("all");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [allMatchingSelected, setAllMatchingSelected] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "5",
      });
      if (ratingFilter !== "all") params.set("rating", String(ratingFilter));

      const res = await api.get(`/reviews/admin?${params.toString()}`);
      setReviews(res.data.data || []);
      setPage(res.data.page || 1);
      setPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
      setSelectedIds([]);
      setAllMatchingSelected(false);
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to load reviews."
          : "Failed to load reviews.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, ratingFilter]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const updateStatus = async (reviewId: number, status: ReviewStatus) => {
    setUpdatingId(reviewId);
    setError("");

    try {
      const res = await api.patch(`/reviews/admin/${reviewId}/status`, { status });
      setReviews((current) =>
        current.map((review) => (review.id === reviewId ? res.data : review)),
      );
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to update review."
          : "Failed to update review.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const allSelected = useMemo(
    () => !allMatchingSelected && reviews.length > 0 && selectedIds.length === reviews.length,
    [allMatchingSelected, reviews.length, selectedIds.length],
  );

  const selectedCount = allMatchingSelected ? total : selectedIds.length;
  const hasMoreMatchingReviews = total > reviews.length;
  const activeRatingLabel = ratingFilter === "all" ? "all ratings" : `${ratingFilter} star`;

  const toggleSelected = (reviewId: number) => {
    setAllMatchingSelected(false);
    setSelectedIds((current) =>
      current.includes(reviewId) ? current.filter((id) => id !== reviewId) : [...current, reviewId],
    );
  };

  const toggleSelectAll = () => {
    setAllMatchingSelected(false);
    setSelectedIds(allSelected ? [] : reviews.map((review) => review.id));
  };

  const selectAllMatching = () => {
    setAllMatchingSelected(true);
    setSelectedIds([]);
  };

  const changeRatingFilter = (rating: "all" | number) => {
    setRatingFilter(rating);
    setPage(1);
    setSelectedIds([]);
    setAllMatchingSelected(false);
  };

  const deleteReview = async (reviewId: number) => {
    if (!confirm("Delete this review permanently?")) return;
    setDeleting(true);
    setError("");

    try {
      await api.delete(`/reviews/admin/${reviewId}`);
      await loadReviews();
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to delete review."
          : "Failed to delete review.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const deleteSelected = async () => {
    if (!selectedCount) return;
    const confirmText = allMatchingSelected
      ? `Delete all ${total} review(s) matching ${activeRatingLabel}?`
      : `Delete ${selectedIds.length} selected review(s) from this page?`;
    if (!confirm(confirmText)) return;
    setDeleting(true);
    setError("");

    try {
      await api.delete("/reviews/admin/bulk", {
        data: allMatchingSelected
          ? {
              allMatching: true,
              ...(ratingFilter !== "all" ? { rating: ratingFilter } : {}),
            }
          : { ids: selectedIds },
      });
      setSelectedIds([]);
      setAllMatchingSelected(false);
      await loadReviews();
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to delete selected reviews."
          : "Failed to delete selected reviews.",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-hero">
          <div>
            <h1 className="admin-hero-title">
              Product <span className="text-brandRed">Reviews</span>
            </h1>
            <p className="admin-hero-subtitle">
              Approve or reject customer ratings before they appear on the store.
            </p>
          </div>
          <div className="admin-dark-button pointer-events-none">
            <FiStar size={16} /> Reviews
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="mb-5 rounded-md border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Filter by rating
              </p>
              <p className="mt-1 text-sm font-bold text-brandBlack">
                Showing {total} review{total === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => changeRatingFilter("all")}
                className={`rounded-md border px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  ratingFilter === "all"
                    ? "border-brandRed bg-brandRed text-white"
                    : "border-zinc-200 text-brandBlack hover:border-brandRed hover:text-brandRed"
                }`}
              >
                All
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => changeRatingFilter(rating)}
                  className={`rounded-md border px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                    ratingFilter === rating
                      ? "border-brandRed bg-brandRed text-white"
                      : "border-zinc-200 text-brandBlack hover:border-brandRed hover:text-brandRed"
                  }`}
                >
                  {rating} ★
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && (
          <div className="rounded-md border border-zinc-200 bg-white p-14 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Loading reviews...
            </p>
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <div className="rounded-md border-2 border-dashed border-zinc-200 bg-white p-14 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              No reviews found.
            </p>
          </div>
        )}

        {!loading && reviews.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-white p-3 shadow-sm">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="inline-flex items-center gap-2 rounded-md border border-zinc-200 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-brandBlack transition-all hover:border-brandRed hover:text-brandRed"
              >
                {allSelected ? <FiCheckSquare size={14} /> : <FiSquare size={14} />}
              Select page
            </button>
            {allSelected && hasMoreMatchingReviews ? (
              <button
                type="button"
                onClick={selectAllMatching}
                className="inline-flex items-center gap-2 rounded-md border border-brandRed px-4 py-2 text-[10px] font-black uppercase tracking-widest text-brandRed transition-all hover:bg-brandRed hover:text-white"
              >
                <FiCheckSquare size={14} />
                Select all {total} matching
              </button>
            ) : null}
            {allMatchingSelected ? (
              <p className="mr-auto text-[10px] font-black uppercase tracking-widest text-brandRed">
                All {total} matching reviews selected
              </p>
            ) : null}
            <button
              type="button"
              disabled={!selectedCount || deleting}
              onClick={deleteSelected}
              className="inline-flex items-center gap-2 rounded-md bg-brandRed px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-brandBlack disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiTrash2 size={14} />
              Delete selected ({selectedCount})
            </button>
          </div>
        )}

        {!loading && reviews.length > 0 && (
          <div className="divide-y divide-gray-100 rounded-md border border-zinc-200 bg-white shadow-sm">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="space-y-2 p-5 transition-colors hover:bg-gray-50/60"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => toggleSelected(review.id)}
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 transition-colors hover:text-brandRed"
                  >
                    {allMatchingSelected || selectedIds.includes(review.id) ? <FiCheckSquare size={16} /> : <FiSquare size={16} />}
                    Select
                  </button>
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={() => deleteReview(review.id)}
                    className="inline-flex items-center gap-2 rounded-md border border-red-100 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-brandRed transition-all hover:bg-brandRed hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiTrash2 size={14} />
                    Delete
                  </button>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-black uppercase tracking-tight text-brandBlack">
                    {review.product.title}
                  </p>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${statusStyles[review.status]}`}
                    >
                      {review.status}
                    </span>
                    <p className="text-[11px] font-black uppercase tracking-widest text-brandRed">
                      {"★".repeat(review.rating)}
                    </p>
                  </div>
                </div>

                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {review.user?.name || "Anonymous"}
                  {review.user?.email ? ` · ${review.user.email}` : ""}
                </p>

                {review.comment && (
                  <p className="mt-3 text-sm text-gray-700">{review.comment}</p>
                )}

                <div className="flex flex-wrap gap-2 pt-3">
                  <button
                    type="button"
                    disabled={updatingId === review.id || review.status === "APPROVED"}
                    onClick={() => updateStatus(review.id, "APPROVED")}
                    className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiCheck size={14} />
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === review.id || review.status === "REJECTED"}
                    onClick={() => updateStatus(review.id, "REJECTED")}
                    className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiX size={14} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mb-8 mt-12 flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((current) => current - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-gray-200 transition-all hover:border-brandRed hover:text-brandRed disabled:opacity-30"
            aria-label="Previous page"
          >
            &larr;
          </button>

          <p className="rounded-md border border-gray-100 bg-white px-6 py-2 font-bold text-brandBlack shadow-sm">
            Page {page} <span className="mx-1 font-normal text-brandGray">of</span> {pages}
          </p>

          <button
            type="button"
            disabled={page === pages}
            onClick={() => setPage((current) => current + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-gray-200 transition-all hover:border-brandRed hover:text-brandRed disabled:opacity-30"
            aria-label="Next page"
          >
            &rarr;
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
