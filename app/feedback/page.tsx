"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { FiCheckSquare, FiMessageSquare, FiSquare, FiTrash2, FiX } from "react-icons/fi";

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selected, setSelected] = useState<any | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleting, setDeleting] = useState(false);

  const loadFeedback = useCallback(() => {
    api
      .get(`/feedback?page=${page}&limit=5`)
      .then((res) => {
        setFeedback(res.data.data || []);
        setPages(res.data.pages || 1);
        setSelectedIds([]);
      })
      .catch(() => {
        setFeedback([]);
        setPages(1);
        setSelectedIds([]);
      });
  }, [page]);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  const allSelected = useMemo(
    () => feedback.length > 0 && selectedIds.length === feedback.length,
    [feedback.length, selectedIds.length],
  );

  const toggleSelected = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : feedback.map((item) => item.id));
  };

  const deleteFeedback = async (id: number) => {
    if (!confirm("Delete this feedback permanently?")) return;
    setDeleting(true);
    try {
      await api.delete(`/feedback/${id}`);
      setFeedback((current) => current.filter((item) => item.id !== id));
      setSelectedIds((current) => current.filter((item) => item !== id));
      if (selected?.id === id) setSelected(null);
    } finally {
      setDeleting(false);
    }
  };

  const deleteSelected = async () => {
    if (!selectedIds.length) return;
    if (!confirm(`Delete ${selectedIds.length} selected feedback item(s)?`)) return;
    setDeleting(true);
    try {
      await api.delete("/feedback/bulk", { data: { ids: selectedIds } });
      setFeedback((current) => current.filter((item) => !selectedIds.includes(item.id)));
      if (selected && selectedIds.includes(selected.id)) setSelected(null);
      setSelectedIds([]);
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
            Customer <span className="text-brandRed">Feedback</span>
          </h1>
          <p className="admin-hero-subtitle">
            Listen to customer signals from product, order, and support flows.
          </p>
          </div>
          <div className="admin-dark-button pointer-events-none">
            <FiMessageSquare size={16} /> Feedback
          </div>
        </div>

        {feedback.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-white p-3 shadow-sm">
            <button
              type="button"
              onClick={toggleSelectAll}
              className="inline-flex items-center gap-2 rounded-md border border-zinc-200 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-brandBlack transition-all hover:border-brandRed hover:text-brandRed"
            >
              {allSelected ? <FiCheckSquare size={14} /> : <FiSquare size={14} />}
              Select all
            </button>
            <button
              type="button"
              disabled={!selectedIds.length || deleting}
              onClick={deleteSelected}
              className="inline-flex items-center gap-2 rounded-md bg-brandRed px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-brandBlack disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiTrash2 size={14} />
              Delete selected ({selectedIds.length})
            </button>
          </div>
        )}

        <div className="space-y-3">
          {feedback.length === 0 && (
            <div className="bg-white border-2 border-dashed border-zinc-200 rounded-md p-14 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No feedback found.</p>
            </div>
          )}

          {feedback.map((f) => (
            <div
              key={f.id}
              className="bg-white border border-zinc-200 rounded-md p-5 hover:shadow-md hover:border-brandRed/30 transition-all"
            >
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => toggleSelected(f.id)}
                  className="mt-1 text-gray-400 transition-colors hover:text-brandRed"
                  aria-label={`Select feedback ${f.id}`}
                >
                  {selectedIds.includes(f.id) ? <FiCheckSquare size={18} /> : <FiSquare size={18} />}
                </button>

                <button type="button" onClick={() => setSelected(f)} className="flex-1 text-left">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <p className="font-black text-brandBlack uppercase tracking-tight">
                      {f.user?.name || "Anonymous"}
                    </p>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {new Date(f.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-[10px] font-black uppercase tracking-widest text-brandRed mt-3">
                    Page: {f.page || "N/A"}
                  </p>

                  <p className="text-sm mt-3 line-clamp-2 text-gray-600">
                    {f.message}
                  </p>
                </button>

                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => deleteFeedback(f.id)}
                  className="self-start inline-flex items-center gap-2 rounded-md border border-red-100 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-brandRed transition-all hover:bg-brandRed hover:text-white disabled:opacity-40"
                >
                  <FiTrash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-md hover:border-brandRed hover:text-brandRed transition-all disabled:opacity-30"
          >
            ←
          </button>

          <span className="bg-white px-6 py-2 rounded-md border border-gray-100 shadow-sm font-bold text-brandBlack">
            Page {page} <span className="text-brandGray font-normal mx-1">of</span> {pages}
          </span>

          <button
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
            className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-md hover:border-brandRed hover:text-brandRed transition-all disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-md p-6 w-full max-w-lg shadow-2xl border-t-4 border-brandRed">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-brandBlack">Feedback Details</h2>
              <button
                onClick={() => setSelected(null)}
                className="p-2 text-gray-400 hover:text-brandBlack hover:bg-gray-50 transition-colors"
                aria-label="Close feedback details"
              >
                <FiX />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <p><span className="admin-label block mb-1">User</span>{selected.user?.name || "Anonymous"}</p>
              {selected.user?.email && (
                <p><span className="admin-label block mb-1">Email</span>{selected.user.email}</p>
              )}
              <p><span className="admin-label block mb-1">Page</span>{selected.page || "N/A"}</p>
              <p><span className="admin-label block mb-1">Submitted</span>{new Date(selected.createdAt).toLocaleString()}</p>

              <div className="pt-4 border-t border-gray-100">
                <p className="admin-label mb-2">Message</p>
                <p className="text-gray-700 whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
