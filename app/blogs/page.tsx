"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { Edit, FileText, Plus, Search, Trash2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  status: "DRAFT" | "PUBLISHED";
  publishedAt?: string | null;
  updatedAt: string;
};

function blogImageUrl(image?: string | null) {
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return `${API_URL}/uploads/blogs/${image}`;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const loadBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/blogs/admin", {
        params: {
          page,
          limit: 10,
          search: search || undefined,
          status: status || undefined,
        },
      });
      setBlogs(res.data.blogs || []);
      setPages(res.data.pages || 1);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const deleteBlog = async (blog: BlogPost) => {
    if (!confirm(`Delete blog "${blog.title}"?`)) return;
    await api.delete(`/blogs/${blog.id}`);
    await loadBlogs();
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-hero">
          <div>
            <h1 className="admin-hero-title">
              SEO <span className="text-brandRed">Blogs</span>
            </h1>
            <p className="admin-hero-subtitle">
              Publish article content with images, slugs, and search metadata.
            </p>
          </div>
          <Link href="/blogs/create" className="admin-red-button">
            <Plus size={15} /> New Blog
          </Link>
        </div>

        <div className="admin-surface grid gap-3 p-4 md:grid-cols-[1fr_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              className="admin-field pl-10"
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              placeholder="Search blogs..."
            />
          </div>
          <select
            className="admin-field"
            value={status}
            onChange={(event) => {
              setPage(1);
              setStatus(event.target.value);
            }}
          >
            <option value="">All status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>

        <div className="relative min-h-[360px]">
          {loading ? (
            <div className="admin-table p-14 text-center">
              <div className="mb-3 inline-block h-7 w-7 animate-spin rounded-full border-2 border-brandRed border-t-transparent" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Loading blogs...
              </p>
            </div>
          ) : blogs.length ? (
            <div className="grid gap-4">
              {blogs.map((blog) => (
                <article key={blog.id} className="admin-surface flex flex-col gap-4 p-4 md:flex-row md:items-center">
                  {blog.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={blogImageUrl(blog.coverImage)}
                      alt={blog.title}
                      className="aspect-[4/3] w-full rounded-md object-cover md:w-36"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] w-full items-center justify-center rounded-md bg-white/5 text-zinc-600 md:w-36">
                      <FileText size={28} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`rounded-md px-2 py-1 text-[9px] font-black uppercase tracking-widest ${
                        blog.status === "PUBLISHED"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-zinc-500/10 text-zinc-400"
                      }`}>
                        {blog.status}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        /{blog.slug}
                      </span>
                    </div>
                    <h2 className="truncate text-lg font-black text-white">{blog.title}</h2>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                      {blog.excerpt || "No excerpt added yet."}
                    </p>
                    <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                      Updated {new Date(blog.updatedAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/blogs/edit/${blog.id}`} className="admin-dark-button px-3">
                      <Edit size={14} /> Edit
                    </Link>
                    <button onClick={() => deleteBlog(blog)} className="admin-dark-button px-3 hover:bg-brandRed">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="admin-table p-14 text-center">
              <FileText className="mx-auto mb-3 text-zinc-700" size={34} />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                No blogs found.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <button className="admin-dark-button" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
            Previous
          </button>
          <span className="admin-chip py-3">Page {page} of {pages}</span>
          <button className="admin-dark-button" disabled={page >= pages} onClick={() => setPage((current) => Math.min(pages, current + 1))}>
            Next
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
