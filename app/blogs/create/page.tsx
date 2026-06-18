"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import BlogForm from "@/components/blogs/BlogForm";
import { api } from "@/lib/api";
import { ArrowLeft, FileText } from "lucide-react";

export default function CreateBlogPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const createBlog = async (formData: FormData) => {
    try {
      setSaving(true);
      await api.post("/blogs", formData);
      router.push("/blogs");
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Error creating blog");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-hero">
          <div>
            <button
              onClick={() => router.back()}
              className="mb-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition hover:text-white"
            >
              <ArrowLeft size={14} /> Back to Blogs
            </button>
            <h1 className="admin-hero-title">
              New <span className="text-brandRed">Blog</span>
            </h1>
            <p className="admin-hero-subtitle">
              Create an SEO article for supplement education and organic traffic.
            </p>
          </div>
          <div className="admin-dark-button pointer-events-none">
            <FileText size={16} /> Content
          </div>
        </div>
        <BlogForm submitLabel="Publish Blog" saving={saving} onSubmit={createBlog} />
      </div>
    </AdminLayout>
  );
}
