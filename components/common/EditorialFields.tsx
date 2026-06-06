"use client";

import { FiPlus, FiTrash2, FiShoppingBag, FiImage, FiType, FiDroplet } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import MediaPicker from "../modals/MediaPicker";

type EditorialItem = {
  productId: number;
  mediaId: number | null; 
  accent?: string;
  bgColor?: string;
};

export default function EditorialFields({
  value = { items: [] },
  onChange,
}: {
  value: { items: EditorialItem[] };
  onChange: (v: any) => void;
}) {
  const items = value.items || [];
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [productMap, setProductMap] = useState<Record<number, any>>({});

  async function searchProducts(q: string) {
  if (!q.trim()) {
    setResults([]);
    return;
  }

  setSearching(true);
  try {
    const res = await api.get("/products", {
      params: { search: q, limit: 6 },
    });
    setResults(res.data.products || []);
  } catch {
    setResults([]);
  } finally {
    setSearching(false);
  }
}

  const updateItem = (i: number, field: keyof EditorialItem, val: any) => {
    const updated = [...items];
    updated[i] = {
      ...updated[i],
      [field]: field === "productId" ? Number(val) : val,
    };
    onChange({ items: updated });
  };

  const addItem = () =>
    onChange({
      items: [
        ...items,
        {
          productId: 0,
          mediaId: "",
          accent: "",
          bgColor: "#F9F9F9",
        },
      ],
    });

  const removeItem = (i: number) =>
    onChange({ items: items.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-brandBlack">Editorial Curation</h3>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-sm">
          {items.length} Stories Active
        </span>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={i}
              className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm relative group"
            >
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-brandBlack text-white flex items-center justify-center text-[9px] font-black rounded-full shadow-md z-10">
                {i + 1}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* COLUMN 1: PRODUCT & IMAGE */}
                <div className="space-y-5">
                  <div className="space-y-3">
  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
    <FiShoppingBag className="text-brandRed" /> Target Product
  </label>

  {/* Selected product */}
  {item.productId && productMap[item.productId] ? (
    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-sm flex justify-between items-center">
      <div>
        <p className="text-[10px] font-bold">
          {productMap[item.productId].title}
        </p>
        <p className="text-[9px] text-gray-500">
          ID: {item.productId}
        </p>
      </div>
      <button
        type="button"
        onClick={() => updateItem(i, "productId", 0)}
        className="text-[9px] font-bold text-red-500 uppercase"
      >
        Change
      </button>
    </div>
  ) : (
    <>
      <input
        placeholder="Search product by name…"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          searchProducts(e.target.value);
        }}
        className="w-full bg-gray-50 px-4 py-3 rounded-sm text-xs"
      />

      {searching && (
        <p className="text-[9px] text-gray-400 uppercase tracking-widest">
          Searching…
        </p>
      )}

      {results.length > 0 && (
        <div className="border border-gray-100 rounded-sm overflow-hidden">
          {results.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                updateItem(i, "productId", p.id);
                setProductMap((prev) => ({ ...prev, [p.id]: p }));
                setSearch("");
                setResults([]);
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
            >
              <p className="text-[10px] font-bold">{p.title}</p>
              <p className="text-[9px] text-gray-400">₹{p.price}</p>
            </button>
          ))}
        </div>
      )}
    </>
  )}
</div>


                  <div className="space-y-3">
  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
    <FiImage /> Editorial Image
  </label>

  <MediaPicker
    value={item.mediaId ? [item.mediaId] : []}
    multiple={false}
    accept={["image/*"]}
    onChange={(ids) =>
      updateItem(i, "mediaId", ids?.[0] ?? null)
    }
  />
</div>
                </div>

                {/* COLUMN 2: AESTHETICS */}
                <div className="space-y-5">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                      <FiType /> Accent Label
                    </label>
                    <input
                      placeholder="E.G. NEW ARRIVAL / TRENDING"
                      value={item.accent || ""}
                      onChange={(e) => updateItem(i, "accent", e.target.value.toUpperCase())}
                      className="w-full bg-gray-50 border-none px-4 py-3 rounded-sm text-xs font-black uppercase tracking-widest outline-none ring-1 ring-gray-100 focus:ring-brandRed"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                      <FiDroplet /> Canvas Background
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={item.bgColor || "#ffffff"}
                        onChange={(e) => updateItem(i, "bgColor", e.target.value)}
                        className="w-10 h-10 border-none bg-transparent cursor-pointer rounded-full overflow-hidden"
                      />
                      <input
                        placeholder="#FFFFFF"
                        value={item.bgColor || ""}
                        onChange={(e) => updateItem(i, "bgColor", e.target.value)}
                        className="flex-1 bg-gray-50 border-none px-4 py-3 rounded-sm text-xs font-mono font-bold outline-none ring-1 ring-gray-100 uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* REMOVE BUTTON */}
              <button
                onClick={() => removeItem(i)}
                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <FiTrash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={addItem}
        className="w-full py-5 border-2 border-dashed border-gray-200 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:border-brandRed hover:text-brandRed hover:bg-brandRed/5 transition-all flex items-center justify-center gap-3"
      >
        <FiPlus size={16} /> Add Story Block
      </button>
    </div>
  );
}