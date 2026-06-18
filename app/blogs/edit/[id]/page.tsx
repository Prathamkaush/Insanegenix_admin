"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import BlogForm, { BlogFormValues } from "@/components/blogs/BlogForm";
import { api } from "@/lib/api";
import { ArrowLeft, FileText } from "lucide-react";

function toDateTimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
}

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [initialValues, setInitialValues] = useState<Partial<BlogFormValues> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/blogs/admin/${id}`);
        const blog = res.data;
        setInitialValues({
          title: blog.title || "",
          slug: blog.slug || "",
          excerpt: blog.excerpt || "",
          content: blog.content || "",
          authorName: blog.authorName || "InsaneGenix Team",
          tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
          status: blog.status || "DRAFT",
          metaTitle: blog.metaTitle || "",
          metaDescription: blog.metaDescription || "",
          metaKeywords: blog.metaKeywords || "",
          publishedAt: toDateTimeLocal(blog.publishedAt),
          coverImage: blog.coverImage || null,
        });
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id]);

  const updateBlog = async (formData: FormData) => {
    try {
      setSaving(true);
      await api.patch(`/blogs/${id}`, formData);
      router.push("/blogs");
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Error updating blog");
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
              Edit <span className="text-brandRed">Blog</span>
            </h1>
            <p className="admin-hero-subtitle">
              Update article content, publish status, and SEO metadata.
            </p>
          </div>
          <div className="admin-dark-button pointer-events-none">
            <FileText size={16} /> #{id}
          </div>
        </div>

        {loading || !initialValues ? (
          <div className="admin-table p-14 text-center">
            <div className="mb-3 inline-block h-7 w-7 animate-spin rounded-full border-2 border-brandRed border-t-transparent" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Loading blog...
            </p>
          </div>
        ) : (
          <BlogForm
            initialValues={initialValues}
            submitLabel="Save Blog"
            saving={saving}
            onSubmit={updateBlog}
          />
        )}
      </div>
    </AdminLayout>
  );
}
