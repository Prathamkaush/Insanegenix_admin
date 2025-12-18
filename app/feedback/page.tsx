"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
  api
    .get(`/feedback?page=${page}&limit=5`)
    .then((res) => {
      setFeedback(res.data.data || []);
      setPages(res.data.pages || 1);
    })
    .catch(() => {
      setFeedback([]);
      setPages(1);
    });
}, [page]);


  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">

        <h1 className="text-2xl font-bold text-brandPink">
          Customer Feedback
        </h1>

        {/* LIST */}
        <div className="space-y-3">
            {feedback.length === 0 && (
  <p className="text-gray-500 text-sm">No feedback found.</p>
)}
          {feedback.map((f) => (
            <div
  key={f.id}
  onClick={() => setSelected(f)}
  className="cursor-pointer bg-white rounded-lg border p-4 hover:shadow transition"
>
  <div className="flex justify-between items-center">
    <p className="font-semibold">
      {f.user?.name || "Anonymous"}
    </p>
    <span className="text-xs text-gray-400">
      {new Date(f.createdAt).toLocaleDateString()}
    </span>
  </div>

  <p className="text-sm text-gray-500 mt-1">
    Page: {f.page || "N/A"}
  </p>

  <p className="text-sm mt-2 line-clamp-2 text-gray-700">
    {f.message}
  </p>
</div>

          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between mt-6">
  <button
    disabled={page === 1}
    onClick={() => setPage((p) => p - 1)}
    className="px-3 py-1 border rounded disabled:opacity-50"
  >
    Prev
  </button>

  <span className="text-sm text-gray-500">
    Page {page} of {pages}
  </span>

  <button
    disabled={page === pages}
    onClick={() => setPage((p) => p + 1)}
    className="px-3 py-1 border rounded disabled:opacity-50"
  >
    Next
  </button>
</div>

      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Feedback Details</h2>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <p>
                <span className="font-semibold">User:</span>{" "}
                {selected.user?.name || "Anonymous"}
              </p>

              {selected.user?.email && (
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {selected.user.email}
                </p>
              )}

              <p>
                <span className="font-semibold">Page:</span>{" "}
                {selected.page || "N/A"}
              </p>

              <p>
                <span className="font-semibold">Submitted:</span>{" "}
                {new Date(selected.createdAt).toLocaleString()}
              </p>

              <div className="pt-3 border-t">
                <p className="font-semibold mb-1">Message</p>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
