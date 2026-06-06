"use client";

import { useState } from "react";
import { api } from "@/lib/api";

type Props = {
  productId: number;
  initialSeo?: {
    slug?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  };
};

export default function ProductSeoForm({ productId, initialSeo }: Props) {
  const [form, setForm] = useState({
    slug: initialSeo?.slug || "",
    metaTitle: initialSeo?.metaTitle || "",
    metaDescription: initialSeo?.metaDescription || "",
    metaKeywords: initialSeo?.metaKeywords || "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveSeo = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await api.patch(`/products/${productId}/seo`, form);

      setSuccess("SEO settings saved successfully");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to update SEO"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border space-y-4">
      <h3 className="text-lg font-semibold">SEO Settings</h3>

      <div>
        <label className="text-sm font-medium">Custom Slug</label>
        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          placeholder="women-red-kurti"
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Meta Title</label>
        <input
          name="metaTitle"
          value={form.metaTitle}
          onChange={handleChange}
          placeholder="Buy Red Kurti for Women | FirstFemale"
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Meta Description</label>
        <textarea
          name="metaDescription"
          value={form.metaDescription}
          onChange={handleChange}
          rows={3}
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Meta Keywords</label>
        <input
          name="metaKeywords"
          value={form.metaKeywords}
          onChange={handleChange}
          placeholder="women kurti, red kurti, ethnic wear"
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <button
        onClick={saveSeo}
        disabled={loading}
        className="bg-brandRed text-white px-5 py-2 rounded disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save SEO"}
      </button>
    </div>
  );
}
