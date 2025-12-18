"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

const SIZE_OPTIONS = [
  "Free Size",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "3XL",
];

export default function CreateProductPage() {
  const router = useRouter();

  // FORM STATES
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  // DROPDOWN DATA
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [subtypes, setSubtypes] = useState([]);

  // SELECTED VALUES - Changed to number | string for proper handling
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSubtype, setSelectedSubtype] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // IMAGES
  const [images, setImages] = useState([null, null, null, null]);
  const [sizes, setSizes] = useState<
  { size: string; stock: number; price?: number }[]
>([]);

  // =============================
  // FETCH FUNCTIONS
  // =============================

  const fetchTypes = async (categoryId) => {
    try {
      console.log("Fetching types for categoryId:", categoryId, "Type:", typeof categoryId);
      const res = await api.get(`/product-types?categoryId=${categoryId}`);
      console.log("Fetched Types Response:", res.data);
      console.log("Types array length:", res.data?.length);
      setTypes(res.data || []);
      // Reset dependent dropdowns
      setSelectedType("");
      setSelectedSubtype("");
      setSubtypes([]);
    } catch (err) {
      console.error("Error fetching types:", err);
      console.error("Error details:", err.response?.data);
      setTypes([]);
    }
  };

  const fetchSubtypes = async (typeId) => {
    try {
      console.log("Fetching subtypes for typeId:", typeId, "Type:", typeof typeId);
      const res = await api.get(`/product-subtypes?typeId=${typeId}`);
      console.log("Fetched Subtypes Response:", res.data);
      console.log("Subtypes array length:", res.data?.length);
      setSubtypes(res.data || []);
      // Reset subtype selection
      setSelectedSubtype("");
    } catch (err) {
      console.error("Error fetching subtypes:", err);
      console.error("Error details:", err.response?.data);
      setSubtypes([]);
    }
  };

  // =============================
  // USE EFFECTS
  // =============================

  useEffect(() => {
    api.get("/categories").then((res) => {
      console.log("Fetched Categories:", res.data);
      setCategories(res.data);
    }).catch(err => {
      console.error("Error fetching categories:", err);
    });
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      console.log("No category selected, clearing types and subtypes");
      setTypes([]);
      setSubtypes([]);
      return;
    }
    console.log("Category changed to:", selectedCategory);
    fetchTypes(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    if (!selectedType) {
      console.log("No type selected, clearing subtypes");
      setSubtypes([]);
      return;
    }
    console.log("Type changed to:", selectedType);
    fetchSubtypes(selectedType);
  }, [selectedType]);

  // =============================
  // IMAGE HANDLER
  // =============================

  const handleImageChange = (index, file) => {
    const updated = [...images];
    updated[index] = file;
    setImages(updated);
  };

  // =============================
  // SUBMIT FUNCTION
  // =============================

const createProduct = async () => {
  if (!selectedCategory || !selectedType || !selectedSubtype) {
    return alert("Please select all dropdown values");
  }

  if (!title || !price || !stock || sizes.length === 0) {
    return alert("Please fill in all required fields");
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("stock", stock);
  formData.append("sizes", JSON.stringify(sizes));
  formData.append("categoryId", selectedCategory);
  formData.append("typeId", selectedType);
  formData.append("subtypeId", selectedSubtype);

  images.forEach((img, i) => {
    if (img) formData.append(`image${i + 1}`, img);
  });

  try {
    await api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Product created successfully!");
    router.push("/products");
  } catch (err) {
    console.error("Error creating product:", err);
    alert("Error creating product");
  }
};

  // =============================
  // JSX UI
  // =============================

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-brandPink mb-6">Add New Product</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT SIDE — PRODUCT DETAILS */}
        <div className="lg:col-span-2 space-y-4">

          {/* Basic Details */}
          <div className="bg-white shadow rounded-xl p-5">
            <h2 className="text-lg font-semibold text-brandBlack mb-4">Basic Details</h2>

            <div className="space-y-4">

              <div>
                <label className="block mb-1 font-medium">Title</label>
                <input
                  className="border p-2 rounded w-full bg-brandCream/40"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  className="border p-2 rounded w-full bg-brandCream/40"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Price</label>
                  <input
                    type="number"
                    className="border p-2 rounded w-full bg-brandCream/40"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Stock</label>
                  <input
                    type="number"
                    className="border p-2 rounded w-full bg-brandCream/40"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* CATEGORY MAPPING */}
          <div className="bg-white shadow rounded-xl p-5 space-y-4">
            <h2 className="text-lg font-semibold text-brandBlack mb-2">Category Mapping</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* CATEGORY */}
              <div>
                <label className="block mb-1 font-medium">Category</label>
                <select
                  className="border p-2 rounded w-full bg-brandCream/40"
                  value={selectedCategory}
                  onChange={(e) => {
                    console.log("Category selected:", e.target.value);
                    setSelectedCategory(e.target.value);
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs mt-1 text-gray-500">Selected: {selectedCategory || 'None'}</p>
              </div>

              {/* TYPE */}
              <div>
                <label className="block mb-1 font-medium">Product Type</label>
                <select
                  className="border p-2 rounded w-full bg-brandCream/40"
                  value={selectedType}
                  onChange={(e) => {
                    console.log("Type selected:", e.target.value);
                    setSelectedType(e.target.value);
                  }}
                  disabled={!selectedCategory || types.length === 0}
                >
                  <option value="">Select Product Type</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs mt-1 text-gray-500">
                  Available types: {types.length} | Selected: {selectedType || 'None'}
                </p>
              </div>

              {/* SUBTYPE */}
              <div>
                <label className="block mb-1 font-medium">Subtype</label>
                <select
                  className="border p-2 rounded w-full bg-brandCream/40"
                  value={selectedSubtype}
                  onChange={(e) => setSelectedSubtype(e.target.value)}
                  disabled={!selectedType || subtypes.length === 0}
                >
                  <option value="">Select Subtype</option>
                  {subtypes.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

{/* SIZE */}
<div>
  <label className="block mb-2 font-medium">Sizes & Stock</label>

  <div className="grid grid-cols-2 gap-4">
  {SIZE_OPTIONS.map((size) => {
    const existing = sizes.find((s) => s.size === size);

    return (
      <div
        key={size}
        className="border rounded-lg p-3 bg-brandCream/30"
      >
        <label className="flex items-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={!!existing}
            onChange={(e) => {
              if (e.target.checked) {
                setSizes((prev) => [
                  ...prev,
                  { size, stock: 1 },
                ]);
              } else {
                setSizes((prev) =>
                  prev.filter((s) => s.size !== size)
                );
              }
            }}
          />
          {size}
        </label>

        {existing && (
          <input
            type="number"
            min={0}
            placeholder="Stock"
            value={existing.stock}
            onChange={(e) => {
              const stock = Number(e.target.value);
              setSizes((prev) =>
                prev.map((s) =>
                  s.size === size ? { ...s, stock } : s
                )
              );
            }}
            className="mt-2 w-full border p-2 rounded bg-white"
          />
        )}
      </div>
    );
  })}
</div>

</div>

          </div>

          {/* SAVE BUTTON */}
          <button
  type="button"
  onClick={createProduct}
  className="px-6 py-3 mt-4 rounded-lg text-white bg-brandPink hover:bg-brandPinkLight"
>
  Save Product
</button>


        </div>

        {/* RIGHT SIDE — IMAGES */}
        <div className="bg-white shadow rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4 text-brandBlack">Product Images</h2>

          <div className="grid grid-cols-2 gap-4">

            {images.map((img, index) => (
              <div key={index} className="relative">

                {/* PREVIEW BOX */}
                <label className="border rounded-xl h-32 flex items-center justify-center cursor-pointer bg-brandCream/30 overflow-hidden">

                  {img ? (
                    <img
                      src={URL.createObjectURL(img)}
                      className="w-full h-full object-cover"
                      alt={`Preview ${index + 1}`}
                    />
                  ) : (
                    <span className="text-brandGray text-sm">
                      Upload Image {index + 1}
                    </span>
                  )}

                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(index, e.target.files?.[0] || null)
                    }
                  />
                </label>

                {/* REMOVE IMAGE */}
                {img && (
                  <button
                  type="button"
                    onClick={() => handleImageChange(index, null)}
                    className="
                      absolute -top-2 -right-2 
                      bg-red-500 text-white w-6 h-6 
                      rounded-full flex items-center justify-center 
                      shadow hover:bg-red-600 transition
                    "
                  >
                    ×
                  </button>
                )}

              </div>
            ))}

          </div>
        </div>

      </div>
    </AdminLayout>
  );
}