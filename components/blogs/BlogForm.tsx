"use client";

import { useMemo, useState } from "react";
import { Save, UploadCloud } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

export type BlogFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorName: string;
  tags: string;
  status: "DRAFT" | "PUBLISHED";
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  publishedAt: string;
  coverImage?: string | null;
};

type BlogFormProps = {
  initialValues?: Partial<BlogFormValues>;
  submitLabel: string;
  saving: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
};

function blogImageUrl(image?: string | null) {
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return `${API_URL}/uploads/blogs/${image}`;
}

export default function BlogForm({ initialValues, submitLabel, saving, onSubmit }: BlogFormProps) {
  const [values, setValues] = useState<BlogFormValues>({
    title: initialValues?.title || "",
    slug: initialValues?.slug || "",
    excerpt: initialValues?.excerpt || "",
    content: initialValues?.content || "",
    authorName: initialValues?.authorName || "InsaneGenix Team",
    tags: initialValues?.tags || "",
    status: initialValues?.status || "DRAFT",
    metaTitle: initialValues?.metaTitle || "",
    metaDescription: initialValues?.metaDescription || "",
    metaKeywords: initialValues?.metaKeywords || "",
    publishedAt: initialValues?.publishedAt || "",
    coverImage: initialValues?.coverImage || null,
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const preview = useMemo(() => {
    if (coverImage) return URL.createObjectURL(coverImage);
    return blogImageUrl(values.coverImage);
  }, [coverImage, values.coverImage]);

  const setField = (field: keyof BlogFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("slug", values.slug);
    formData.append("excerpt", values.excerpt);
    formData.append("content", values.content);
    formData.append("authorName", values.authorName);
    formData.append("tags", values.tags);
    formData.append("status", values.status);
    formData.append("metaTitle", values.metaTitle);
    formData.append("metaDescription", values.metaDescription);
    formData.append("metaKeywords", values.metaKeywords);
    formData.append("publishedAt", values.publishedAt);
    if (coverImage) formData.append("coverImage", coverImage);
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <section className="admin-surface space-y-5 p-6 md:p-8">
        <div>
          <label className="admin-label mb-2 block">Title</label>
          <input
            className="admin-field"
            value={values.title}
            onChange={(event) => setField("title", event.target.value)}
            placeholder="Best supplements for lean muscle gain"
            required
          />
        </div>

        <div>
          <label className="admin-label mb-2 block">Slug</label>
          <input
            className="admin-field"
            value={values.slug}
            onChange={(event) => setField("slug", event.target.value)}
            placeholder="auto-generated from title"
          />
        </div>

        <div>
          <label className="admin-label mb-2 block">Excerpt</label>
          <textarea
            className="admin-field min-h-24"
            value={values.excerpt}
            onChange={(event) => setField("excerpt", event.target.value)}
            placeholder="Short summary shown on blog cards and search previews..."
          />
        </div>

        <div>
          <label className="admin-label mb-2 block">Content</label>
          <textarea
            className="admin-field min-h-[360px]"
            value={values.content}
            onChange={(event) => setField("content", event.target.value)}
            placeholder="Write the blog content here. Use blank lines for paragraphs."
            required
          />
        </div>
      </section>

      <aside className="space-y-6">
        <section className="admin-surface space-y-5 p-6">
          <div>
            <label className="admin-label mb-2 block">Cover Image</label>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-white/15 bg-white/5 p-5 text-center transition hover:border-brandRed/70">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Blog cover preview" className="mb-4 aspect-[4/3] w-full rounded-md object-cover" />
              ) : (
                <UploadCloud className="mb-3 text-brandRed" size={28} />
              )}
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
                Upload cover
              </span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => setCoverImage(event.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div>
            <label className="admin-label mb-2 block">Status</label>
            <select
              className="admin-field"
              value={values.status}
              onChange={(event) => setField("status", event.target.value)}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          <div>
            <label className="admin-label mb-2 block">Publish Date</label>
            <input
              className="admin-field"
              type="datetime-local"
              value={values.publishedAt}
              onChange={(event) => setField("publishedAt", event.target.value)}
            />
          </div>

          <div>
            <label className="admin-label mb-2 block">Author</label>
            <input
              className="admin-field"
              value={values.authorName}
              onChange={(event) => setField("authorName", event.target.value)}
            />
          </div>

          <div>
            <label className="admin-label mb-2 block">Tags</label>
            <input
              className="admin-field"
              value={values.tags}
              onChange={(event) => setField("tags", event.target.value)}
              placeholder="protein, creatine, recovery"
            />
          </div>
        </section>

        <section className="admin-surface space-y-5 p-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-white">SEO</h2>
          <div>
            <label className="admin-label mb-2 block">Meta Title</label>
            <input
              className="admin-field"
              value={values.metaTitle}
              onChange={(event) => setField("metaTitle", event.target.value)}
            />
          </div>
          <div>
            <label className="admin-label mb-2 block">Meta Description</label>
            <textarea
              className="admin-field min-h-24"
              value={values.metaDescription}
              onChange={(event) => setField("metaDescription", event.target.value)}
            />
          </div>
          <div>
            <label className="admin-label mb-2 block">Meta Keywords</label>
            <input
              className="admin-field"
              value={values.metaKeywords}
              onChange={(event) => setField("metaKeywords", event.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={saving || !values.title.trim() || !values.content.trim()}
            className="admin-red-button w-full disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            {saving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save size={15} />
            )}
            {saving ? "Saving..." : submitLabel}
          </button>
        </section>
      </aside>
    </form>
  );
}
