"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import ProductPreviewModal from "@/components/ProductPreviewModal";
import BulkUploadModal from "@/components/BulkUploadModal";
import { Filter, PackagePlus, Search, UploadCloud } from "lucide-react";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<any>(null);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sort, setSort] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data || [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setTypes([]);
      return;
    }
    api.get(`/product-types?categoryId=${selectedCategory}`).then((res) => setTypes(res.data || [])).catch(console.error);
  }, [selectedCategory]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/products", {
        params: {
          page,
          limit,
          categoryId: selectedCategory || undefined,
          typeId: selectedType || undefined,
          sort: sort || undefined,
          stock: stockFilter || undefined,
        },
      });
      setProducts(res.data.products || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error("Fetch error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, selectedType, sort, stockFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const confirmDelete = async () => {
    await api.delete(`/products/${deleteId}`);
    setModalOpen(false);
    fetchProducts();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-md bg-brandBlack p-5 text-white">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">
              Supplement <span className="text-brandRed">Inventory</span>
            </h1>
            <p className="text-zinc-400 text-sm">Manage PDP content, flavors, weights, pricing, and stock.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-[11px] font-black uppercase tracking-widest transition-all border ${
                filterOpen ? "bg-brandRed text-white border-brandRed" : "bg-white/10 text-white border-white/10 hover:bg-white/20"
              }`}
            >
              <Filter size={16} /> Filters
            </button>
            <button
              onClick={() => setBulkUploadOpen(true)}
              className="flex items-center gap-2 bg-white/10 text-white px-5 py-2.5 rounded-md text-[11px] font-black uppercase tracking-widest hover:bg-white/20 transition-all"
            >
              <UploadCloud size={16} /> Bulk Upload
            </button>
            <button
              onClick={() => router.push("/products/create")}
              className="flex items-center gap-2 bg-brandRed text-white px-5 py-2.5 rounded-md text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-brandBlack transition-all"
            >
              <PackagePlus size={16} /> Add Supplement
            </button>
          </div>
        </div>

        {filterOpen && (
          <div className="admin-surface p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select label="Category" value={selectedCategory} onChange={(v: string) => { setSelectedCategory(v); setSelectedType(""); }} options={categories.map((c) => ({ value: String(c.id), label: c.name }))} />
            <Select label="Type" value={selectedType} onChange={setSelectedType} options={types.map((t) => ({ value: String(t.id), label: t.name }))} />
            <Select label="Sort By" value={sort} onChange={setSort} options={[{ value: "newest", label: "Newest First" }, { value: "low_to_high", label: "Price: Low to High" }, { value: "high_to_low", label: "Price: High to Low" }]} />
            <Select label="Stock Status" value={stockFilter} onChange={setStockFilter} options={[{ value: "in", label: "In Stock" }, { value: "out", label: "Out of Stock" }]} />
          </div>
        )}

        <div className="relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-md">
              <div className="flex flex-col items-center">
                <div className="animate-spin w-10 h-10 border-[3px] border-brandRed border-t-transparent rounded-full mb-4" />
                <p className="text-brandRed font-bold animate-pulse">Updating catalog...</p>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="group admin-surface p-4 flex gap-5 items-center transition-all hover:shadow-md hover:border-brandRed/30 cursor-pointer"
                onClick={() => {
                  setPreviewProduct(p);
                  setPreviewOpen(true);
                }}
              >
                <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-md bg-white/5 border border-white/10">
                  {p.img1 ? (
                    <img src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${p.img1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.title} />
                  ) : (
                    <img src="/insanegenix/product/Whey.png" className="w-full h-full object-contain p-3" alt="" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-brandRed/10 text-brandRed text-[10px] font-black rounded uppercase">
                      {p.category?.name || "Supplement"}
                    </span>
                    {p.goal && <span className="px-2 py-0.5 bg-white/5 text-zinc-400 text-[10px] font-black rounded uppercase">{p.goal}</span>}
                    <span className="text-zinc-500 text-xs">/ {p.type?.name}</span>
                  </div>
                  <h2 className="truncate text-lg font-bold text-white leading-tight mb-2 group-hover:text-brandRed transition-colors">
                    {p.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xl font-black text-white">₹{Number(p.finalPrice || p.price || 0).toLocaleString()}</p>
                    {p.discountType && p.discountValue && <p className="text-sm text-zinc-500 line-through">₹{Number(p.price).toLocaleString()}</p>}
                    <p className="text-xs font-bold px-2 py-1 rounded-md bg-white/5 text-zinc-300">{p.variants?.length || 0} variants</p>
                    <p className={`text-xs font-bold px-2 py-1 rounded-md ${
                      p.stock === 0 ? "bg-red-950/20 text-red-400" : p.stock < 5 ? "bg-orange-950/20 text-orange-400" : "bg-green-950/20 text-green-400"
                    }`}>
                      {p.stock === 0 ? "Out of Stock" : `Stock: ${p.stock}`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-2.5 bg-brandRed/10 text-brandRed rounded-md hover:bg-brandRed hover:text-white transition-all shadow-sm"
                    onClick={(e) => { e.stopPropagation(); router.push(`/products/edit/${p.id}`); }}
                  >
                    Edit
                  </button>
                  <button
                    className="p-2.5 bg-white/10 text-zinc-300 rounded-md hover:bg-brandRed hover:text-white transition-all shadow-sm"
                    onClick={(e) => { e.stopPropagation(); setDeleteId(p.id); setModalOpen(true); }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {!loading && products.length === 0 && (
              <div className="admin-surface p-20 text-center border-2 border-dashed border-white/10">
                <Search className="mx-auto text-zinc-700 mb-4" size={58} />
                <p className="text-zinc-400 font-medium">No supplements match your filters.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-12 mb-8 gap-4 items-center">
          <button className="w-10 h-10 flex items-center justify-center border-2 border-white/10 rounded-md hover:border-brandRed hover:text-brandRed transition-all disabled:opacity-30" disabled={page === 1} onClick={() => setPage(page - 1)}>
            ←
          </button>
          <div className="admin-surface px-6 py-2 border-white/10 shadow-sm font-bold text-white">
            Page {page} <span className="text-zinc-500 font-normal mx-1">of</span> {pages}
          </div>
          <button className="w-10 h-10 flex items-center justify-center border-2 border-white/10 rounded-md hover:border-brandRed hover:text-brandRed transition-all disabled:opacity-30" disabled={page === pages} onClick={() => setPage(page + 1)}>
            →
          </button>
        </div>
      </div>

      <DeleteConfirmModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onConfirm={confirmDelete} itemName="product" />
      <ProductPreviewModal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} product={previewProduct} />
      <BulkUploadModal isOpen={bulkUploadOpen} onClose={() => setBulkUploadOpen(false)} onSuccess={() => { setPage(1); fetchProducts(); }} />
    </AdminLayout>
  );
}

function Select({ label, value, onChange, options }: any) {
  return (
    <div className="space-y-1">
      <label className="admin-label ml-1">{label}</label>
      <select className="admin-field" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All</option>
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
