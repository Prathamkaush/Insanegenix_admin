"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { useRouter, useParams } from "next/navigation";

const SIZE_OPTIONS = ["Free Size", "XS", "S", "M", "L", "XL", "XXL", "3XL"];


export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  // FORM STATES
  const [product, setProduct] = useState(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  // DROPDOWNS
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [subtypes, setSubtypes] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSubtype, setSelectedSubtype] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // IMAGES
  const [images, setImages] = useState([null, null, null, null]); // NEW images
  const [existingImages, setExistingImages] = useState([null, null, null, null]); // OLD images

  // FETCH PRODUCT
  useEffect(() => {
    api.get(`/products/${productId}`).then((res) => {
      const data = res.data;
      setProduct(data);

      setTitle(data.title);
      setDescription(data.description);
      setPrice(data.price);
      setStock(data.stock);
      setSelectedCategory(data.categoryId);
      setSelectedType(data.typeId);
      setSelectedSubtype(data.subtypeId);
      setSelectedSize(data.sizes);

      // Set existing images
      setExistingImages([
        data.img1,
        data.img2,
        data.img3,
        data.img4,
      ]);
    });
  }, [productId]);

  // FETCH CATEGORY, TYPE, SUBTYPE LISTS
  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;

    api.get(`/product-types?categoryId=${selectedCategory}`)
       .then((res) => setTypes(res.data));
  }, [selectedCategory]);

  useEffect(() => {
    if (!selectedType) return;

    api.get(`/product-subtypes?typeId=${selectedType}`)
       .then((res) => setSubtypes(res.data));
  }, [selectedType]);

  // Handle NEW image upload
  const handleImageChange = (index, file) => {
    const updated = [...images];
    updated[index] = file;
    setImages(updated);

    // If new image selected, remove old preview
    const existing = [...existingImages];
    existing[index] = null;
    setExistingImages(existing);
  };

  // Remove existing or new image
  const removeImage = (index) => {
    const updatedNew = [...images];
    updatedNew[index] = null;
    setImages(updatedNew);

    const updatedOld = [...existingImages];
    updatedOld[index] = null;
    setExistingImages(updatedOld);
  };

  // SUBMIT UPDATE
  const updateProduct = async () => {
    const formData = new FormData();

    // Send only updated fields
    if (title !== product.title) formData.append("title", title);
    if (description !== product.description) formData.append("description", description);
    if (price !== product.price) formData.append("price", price);
    if (stock !== product.stock) formData.append("stock", stock);
    if (selectedSize !== product.sizes) formData.append("sizes", selectedSize);

    if (selectedCategory !== product.categoryId)
      formData.append("categoryId", selectedCategory);

    if (selectedType !== product.typeId)
      formData.append("typeId", selectedType);

    if (selectedSubtype !== product.subtypeId)
      formData.append("subtypeId", selectedSubtype);

    // Images: send only changed ones
    // upload new images
images.forEach((img, i) => {
  if (img) {
    formData.append(`image${i + 1}`, img);
  }
});

// remove only images explicitly removed by user
existingImages.forEach((img, i) => {
  if (img === null && product[`img${i + 1}`]) {
    formData.append(`remove_image_${i + 1}`, "true");
  }
});


    try {
      await api.put(`/products/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product updated!");
      router.push("/products");

    } catch (err) {
      console.log(err);
      alert("Error updating product");
    }
  };

  if (!product) return <AdminLayout><p>Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-brandPink mb-6">Edit Product</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT — FORM */}
        <div className="lg:col-span-2 space-y-4">

          {/* BASIC DETAILS */}
          <div className="bg-white shadow rounded-xl p-5">
            <h2 className="text-lg font-semibold text-brandBlack mb-4">Basic Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Title</label>
                <input className="border p-2 rounded w-full bg-brandCream/40"
                       value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea className="border p-2 rounded w-full bg-brandCream/40"
                          rows={3} value={description}
                          onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Price</label>
                  <input type="number" className="border p-2 rounded w-full bg-brandCream/40"
                         value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Stock</label>
                  <input type="number" className="border p-2 rounded w-full bg-brandCream/40"
                         value={stock} onChange={(e) => setStock(e.target.value)} />
                </div>
              </div>

            </div>
          </div>

          {/* CATEGORY MAPPING */}
          <div className="bg-white shadow rounded-xl p-5 space-y-4">
            <h2 className="text-lg font-semibold text-brandBlack mb-2">Category Mapping</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Category */}
              <div>
                <label className="block mb-1 font-medium">Category</label>
                <select className="border p-2 rounded w-full bg-brandCream/40"
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setSelectedType("");
                          setSelectedSubtype("");
                        }}>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Types */}
              <div>
                <label className="block mb-1 font-medium">Product Type</label>
                <select className="border p-2 rounded w-full bg-brandCream/40"
                        value={selectedType}
                        onChange={(e) => {
                          setSelectedType(e.target.value);
                        }}>
                  <option value="">Select Type</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Subtypes */}
              <div>
                <label className="block mb-1 font-medium">Subtype</label>
                <select className="border p-2 rounded w-full bg-brandCream/40"
                        value={selectedSubtype}
                        onChange={(e) => setSelectedSubtype(e.target.value)}>
                  <option value="">Select Subtype</option>
                  {subtypes.map((st) => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Size */}
            <div>
              <label className="block mb-1 font-medium">Size</label>
              <select className="border p-2 rounded w-full bg-brandCream/40"
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}>
                <option value="">Select Size</option>
                {SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <button onClick={updateProduct}
                  className="px-6 py-3 mt-4 rounded-lg text-white bg-brandPink hover:bg-brandPinkLight">
            Update Product
          </button>

        </div>

        {/* RIGHT — IMAGES */}
        <div className="bg-white shadow rounded-xl p-5">
          <h2 className="text-lg font-semibold text-brandBlack mb-4">Product Images</h2>

          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="relative">

                {/* SHOW EXISTING IMAGE */}
                {existingImages[i] && (
                  <div className="relative">
                    <img
                      src={`http://localhost:3030/uploads/products/${existingImages[i]}`}
                      className="w-full h-32 rounded-xl object-cover"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6
                                 rounded-full flex items-center justify-center shadow">
                      ×
                    </button>
                  </div>
                )}

                {/* SHOW NEW IMAGE PREVIEW */}
                {images[i] && !existingImages[i] && (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(images[i])}
                      className="w-full h-32 rounded-xl object-cover"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6
                                 rounded-full flex items-center justify-center shadow">
                      ×
                    </button>
                  </div>
                )}

                {/* UPLOAD BUTTON */}
                {!images[i] && !existingImages[i] && (
                  <label className="border rounded-xl h-32 flex items-center justify-center cursor-pointer bg-brandCream/30 overflow-hidden">
                    <span className="text-brandGray text-sm">Upload Image {i + 1}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageChange(i, e.target.files[0])}
                    />
                  </label>
                )}

              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
