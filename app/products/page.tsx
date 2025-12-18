"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import ProductPreviewModal from "@/components/ProductPreviewModal";
import FilterAltIcon from "@mui/icons-material/FilterAlt";


export default function ProductsPage() {
  const router = useRouter();

  // MAIN DATA
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [subtypes, setSubtypes] = useState<any[]>([]);

  // MODALS
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<any>(null);

  // FILTERS
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSubtype, setSelectedSubtype] = useState("");
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  // PAGINATION
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 10;

  // ================================
  // LOAD FILTER OPTIONS
  // ================================
  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (!selectedCategory) return setTypes([]);
    api.get(`/product-types?categoryId=${selectedCategory}`).then((res) => setTypes(res.data));
  }, [selectedCategory]);

  useEffect(() => {
    if (!selectedType) return setSubtypes([]);
    api.get(`/product-subtypes?typeId=${selectedType}`).then((res) => setSubtypes(res.data));
  }, [selectedType]);

  // ================================
  // FETCH PRODUCTS (PAGINATION + FILTERS)
  // ================================
  const fetchProducts = () => {
    api
      .get("/products", {
        params: {
          page,
          limit,
          categoryId: selectedCategory || undefined,
          typeId: selectedType || undefined,
          subtypeId: selectedSubtype || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sort: sort || undefined,
          stock: stockFilter || undefined,
        },
      })
      .then((res) => {
        setProducts(res.data.products || []); // ⭐ prevents undefined
        setPages(res.data.pages || 1);
      })
      .catch(() => {
        setProducts([]); // avoid crash
      });
  };

  // LOAD ON PAGE CHANGE
  useEffect(() => {
    fetchProducts();
  }, [page]);

  // LOAD INIT
  useEffect(() => {
    fetchProducts();
  }, []);

  // ================================
  // DELETE
  // ================================
  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    await api.delete(`/products/${deleteId}`);
    setModalOpen(false);
    fetchProducts();
  };

  // ================================
  // PREVIEW
  // ================================
  const openPreview = (product: any) => {
    setPreviewProduct(product);
    setPreviewOpen(true);
  };

  // ================================
  // UI RENDER
  // ================================
  return (
    <>
      <AdminLayout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-brandPink">Products</h1>

          <button
            onClick={() => router.push("/products/create")}
            className="bg-brandPink text-white px-4 py-2 rounded-lg hover:bg-brandPinkLight"
          >
            + Add Product
          </button>
        </div>

        {/* FILTER TOGGLE */}
        <div className="mb-4">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 bg-brandPink text-white px-4 py-2 rounded-lg hover:bg-brandPinkLight"
          >
            <FilterAltIcon />
            Filters
          </button>
        </div>

        {/* FILTER PANEL */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            filterOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white shadow p-4 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold text-brandPink">Filter Products</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* CATEGORY */}
              <select
                className="border p-2 rounded bg-brandCream/40"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedType("");
                  setSelectedSubtype("");
                }}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              {/* TYPE */}
              <select
                className="border p-2 rounded bg-brandCream/40"
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setSelectedSubtype("");
                }}
                disabled={!selectedCategory}
              >
                <option value="">All Types</option>
                {types.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>

              {/* SUBTYPE */}
              <select
                className="border p-2 rounded bg-brandCream/40"
                value={selectedSubtype}
                onChange={(e) => setSelectedSubtype(e.target.value)}
                disabled={!selectedType}
              >
                <option value="">All Subtypes</option>
                {subtypes.map((st) => (
                  <option key={st.id} value={st.id}>{st.name}</option>
                ))}
              </select>

              {/* SORT */}
              <select
                className="border p-2 rounded bg-brandCream/40"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Sort By</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="low_to_high">Price: Low to High</option>
                <option value="high_to_low">Price: High to Low</option>
              </select>
            </div>

            {/* PRICE */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              <input
                type="number"
                placeholder="Min Price"
                className="border p-2 rounded bg-brandCream/40"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max Price"
                className="border p-2 rounded bg-brandCream/40"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            {/* STOCK */}
            <select
              className="border p-2 rounded bg-brandCream/40 w-full"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="">All Stock</option>
              <option value="in">In Stock</option>
              <option value="out">Out of Stock</option>
            </select>

            {/* APPLY BUTTON */}
            <button
              className="mt-3 px-4 py-2 bg-brandPink text-white rounded hover:bg-brandPinkLight"
              onClick={() => { setPage(1); fetchProducts(); }}
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* PRODUCTS LIST */}
        <div className="space-y-5 mt-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow rounded-xl p-4 flex gap-4 items-start border border-brandCream"
              onClick={() => openPreview(p)}
            >
              <img
                src={`http://localhost:3030/uploads/products/${p.img1}`}
                className="w-24 h-24 object-cover rounded"
              />

              <div className="flex-1">
                <h2 className="text-lg font-semibold text-brandBlack">Title : {p.title}</h2>
                <p className="text-brandGray text-sm">
                  {p.category?.name} → {p.type?.name} → {p.subtype?.name}
                </p>
                <div className="flex items-center gap-6 mt-1">
                  <p className="font-semibold text-brandPink">₹{p.price}</p>
                  <p className={`font-semibold ${
  p.stock === 0
    ? "text-red-500"
    : p.stock < 5
    ? "text-orange-500"
    : "text-green-600"
}`}>Stock: {p.stock}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  className="px-4 py-1 bg-brandPinkLight text-white rounded hover:bg-brandPink"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/products/edit/${p.id}`);
                  }}
                >
                  Edit
                </button>

                <button
                  className="px-4 py-1 bg-brandRed text-white rounded hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(p.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>

      {/* PAGINATION */}
      <div className="flex justify-center mt-8 gap-3 items-center">
        <button
          className="px-4 py-2 bg-brandPink text-white rounded disabled:bg-gray-300"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span className="font-semibold text-brandBlack">Page {page} of {pages}</span>

        <button
          className="px-4 py-2 bg-brandPink text-white rounded disabled:bg-gray-300"
          disabled={page === pages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* MODALS */}
      <DeleteConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        itemName="product"
      />

      <ProductPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        product={previewProduct}
      />
    </>
  );
}
