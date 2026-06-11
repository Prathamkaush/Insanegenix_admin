"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import Link from "next/link";
import { AxiosError } from "axios";
import {
  FiChevronDown,
  FiChevronRight,
  FiEdit2,
  FiFolder,
  FiGrid,
  FiLayers,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

type Category = {
  id: number;
  name: string;
  image?: string | null;
};

type ProductType = {
  id: number;
  name: string;
  category?: { id: number; name: string } | null;
};

type ProductSubtype = {
  id: number;
  name: string;
  type?: { id: number; name: string } | null;
};

function categoryImageUrl(image?: string | null) {
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return `${API_URL}/uploads/categories/${image}`;
}

function errorMessage(error: unknown, fallback: string) {
  const response = (error as AxiosError<{ message?: string }>).response;
  return response?.data?.message || fallback;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [subtypes, setSubtypes] = useState<ProductSubtype[]>([]);
  const [openCategories, setOpenCategories] = useState<Set<number>>(new Set());
  const [openTypes, setOpenTypes] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const loadHierarchy = async () => {
    try {
      setLoading(true);
      const [categoriesRes, typesRes, subtypesRes] = await Promise.all([
        api.get("/categories"),
        api.get("/product-types"),
        api.get("/product-subtypes"),
      ]);
      setCategories(categoriesRes.data || []);
      setTypes(typesRes.data || []);
      setSubtypes(subtypesRes.data || []);
    } catch (error) {
      console.error("Error loading catalog structure:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHierarchy();
  }, []);

  const typesByCategory = useMemo(() => {
    const grouped = new Map<number, ProductType[]>();
    types.forEach((type) => {
      if (!type.category?.id) return;
      grouped.set(type.category.id, [...(grouped.get(type.category.id) || []), type]);
    });
    return grouped;
  }, [types]);

  const subtypesByType = useMemo(() => {
    const grouped = new Map<number, ProductSubtype[]>();
    subtypes.forEach((subtype) => {
      if (!subtype.type?.id) return;
      grouped.set(subtype.type.id, [...(grouped.get(subtype.type.id) || []), subtype]);
    });
    return grouped;
  }, [subtypes]);

  const toggle = (
    id: number,
    setter: React.Dispatch<React.SetStateAction<Set<number>>>,
  ) => {
    setter((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const deleteCategory = async (category: Category) => {
    if (!confirm(`Delete category "${category.name}"?`)) return;
    try {
      await api.delete(`/categories/${category.id}`);
      await loadHierarchy();
    } catch (error) {
      alert(errorMessage(error, "Error deleting category"));
    }
  };

  const deleteType = async (type: ProductType) => {
    if (!confirm(`Delete product type "${type.name}"?`)) return;
    try {
      await api.delete(`/product-types/${type.id}`);
      await loadHierarchy();
    } catch (error) {
      alert(errorMessage(error, "Error deleting product type"));
    }
  };

  const deleteSubtype = async (subtype: ProductSubtype) => {
    if (!confirm(`Delete subtype "${subtype.name}"?`)) return;
    try {
      await api.delete(`/product-subtypes/${subtype.id}`);
      await loadHierarchy();
    } catch (error) {
      alert(errorMessage(error, "Error deleting subtype"));
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-hero">
          <div>
            <h1 className="admin-hero-title">
              Catalog <span className="text-brandRed">Structure</span>
            </h1>
            <p className="admin-hero-subtitle">
              Manage categories, types, and subtypes together in one place.
            </p>
          </div>

          <div className="flex w-full flex-wrap gap-3 md:w-auto">
            <div className="admin-dark-button pointer-events-none">
              <FiFolder size={16} /> {categories.length} Categories
            </div>
            <Link href="/categories/create" className="admin-red-button flex-1 md:flex-none">
              <FiPlus size={14} /> Add Category
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-md border border-white/10 bg-white/5 px-5 py-4">
          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-300">
            <FiFolder className="text-brandRed" /> {categories.length} Categories
          </span>
          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-300">
            <FiGrid className="text-brandRed" /> {types.length} Types
          </span>
          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-300">
            <FiLayers className="text-brandRed" /> {subtypes.length} Subtypes
          </span>
          <span className="ml-auto hidden text-[10px] font-bold uppercase tracking-widest text-zinc-500 md:block">
            Select a row to expand it
          </span>
        </div>

        {loading ? (
          <div className="admin-table p-14 text-center">
            <div className="mb-3 inline-block h-7 w-7 animate-spin rounded-full border-2 border-brandRed border-t-transparent" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Loading catalog structure...
            </p>
          </div>
        ) : categories.length === 0 ? (
          <div className="admin-table p-14 text-center">
            <FiFolder className="mx-auto mb-3 text-zinc-600" size={28} />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              No categories found.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => {
              const categoryTypes = typesByCategory.get(category.id) || [];
              const categoryOpen = openCategories.has(category.id);

              return (
                <section key={category.id} className="admin-surface overflow-hidden">
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={() => toggle(category.id, setOpenCategories)}
                      className="flex min-w-0 flex-1 items-center gap-4 text-left"
                      aria-expanded={categoryOpen}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/5 text-zinc-400">
                        {categoryOpen ? <FiChevronDown /> : <FiChevronRight />}
                      </span>
                      {category.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={categoryImageUrl(category.image)}
                          alt={category.name}
                          className="h-14 w-14 shrink-0 rounded-md object-cover"
                        />
                      ) : (
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-white/5 text-zinc-500">
                          <FiFolder size={20} />
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="block truncate text-base font-black text-white">
                          {category.name}
                        </span>
                        <span className="mt-1 block text-[10px] font-black uppercase tracking-widest text-zinc-500">
                          {categoryTypes.length} {categoryTypes.length === 1 ? "Type" : "Types"}
                        </span>
                      </span>
                    </button>

                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <Link
                        href={`/product-types/create?categoryId=${category.id}&returnTo=/categories`}
                        className="inline-flex items-center gap-2 rounded-md bg-brandRed px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-white hover:text-black"
                      >
                        <FiPlus /> Add Type
                      </Link>
                      <Link
                        href={`/categories/edit/${category.id}`}
                        className="inline-flex items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 transition hover:bg-white/10 hover:text-white"
                      >
                        <FiEdit2 /> Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteCategory(category)}
                        className="inline-flex items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition hover:bg-brandRed hover:text-white"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>

                  {categoryOpen && (
                    <div className="border-t border-white/10 bg-black/20 p-3 sm:p-5">
                      {categoryTypes.length === 0 ? (
                        <div className="rounded-md border border-dashed border-white/10 px-5 py-8 text-center">
                          <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            No types in this category yet
                          </p>
                          <Link
                            href={`/product-types/create?categoryId=${category.id}&returnTo=/categories`}
                            className="text-[10px] font-black uppercase tracking-widest text-brandRed hover:text-white"
                          >
                            Add the first type
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {categoryTypes.map((type) => {
                            const typeSubtypes = subtypesByType.get(type.id) || [];
                            const typeOpen = openTypes.has(type.id);

                            return (
                              <div key={type.id} className="overflow-hidden rounded-md border border-white/10 bg-white/[0.03]">
                                <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
                                  <button
                                    type="button"
                                    onClick={() => toggle(type.id, setOpenTypes)}
                                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                                    aria-expanded={typeOpen}
                                  >
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center text-zinc-500">
                                      {typeOpen ? <FiChevronDown /> : <FiChevronRight />}
                                    </span>
                                    <FiGrid className="shrink-0 text-brandRed" />
                                    <span className="min-w-0">
                                      <span className="block truncate text-sm font-bold text-white">{type.name}</span>
                                      <span className="block text-[9px] font-black uppercase tracking-widest text-zinc-500">
                                        {typeSubtypes.length} {typeSubtypes.length === 1 ? "Subtype" : "Subtypes"}
                                      </span>
                                    </span>
                                  </button>

                                  <div className="flex flex-wrap gap-2 pl-10 sm:pl-0">
                                    <Link
                                      href={`/product-subtypes/create?typeId=${type.id}&returnTo=/categories`}
                                      className="inline-flex items-center gap-1 rounded-md bg-white/10 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-white transition hover:bg-brandRed"
                                    >
                                      <FiPlus /> Add Subtype
                                    </Link>
                                    <Link
                                      href={`/product-types/edit/${type.id}`}
                                      className="inline-flex items-center rounded-md bg-white/5 p-2 text-zinc-400 transition hover:text-white"
                                      aria-label={`Edit ${type.name}`}
                                    >
                                      <FiEdit2 />
                                    </Link>
                                    <button
                                      type="button"
                                      onClick={() => deleteType(type)}
                                      className="inline-flex items-center rounded-md bg-white/5 p-2 text-zinc-500 transition hover:bg-brandRed hover:text-white"
                                      aria-label={`Delete ${type.name}`}
                                    >
                                      <FiTrash2 />
                                    </button>
                                  </div>
                                </div>

                                {typeOpen && (
                                  <div className="border-t border-white/10 bg-black/20 px-3 py-2 sm:pl-14">
                                    {typeSubtypes.length === 0 ? (
                                      <p className="py-3 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                                        No subtypes added
                                      </p>
                                    ) : (
                                      typeSubtypes.map((subtype) => (
                                        <div
                                          key={subtype.id}
                                          className="flex items-center gap-3 border-b border-white/5 py-3 last:border-0"
                                        >
                                          <FiLayers className="shrink-0 text-zinc-600" />
                                          <span className="min-w-0 flex-1 truncate text-sm text-zinc-300">
                                            {subtype.name}
                                          </span>
                                          <Link
                                            href={`/product-subtypes/edit/${subtype.id}`}
                                            className="p-2 text-zinc-500 transition hover:text-white"
                                            aria-label={`Edit ${subtype.name}`}
                                          >
                                            <FiEdit2 />
                                          </Link>
                                          <button
                                            type="button"
                                            onClick={() => deleteSubtype(subtype)}
                                            className="p-2 text-zinc-600 transition hover:text-brandRed"
                                            aria-label={`Delete ${subtype.name}`}
                                          >
                                            <FiTrash2 />
                                          </button>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
