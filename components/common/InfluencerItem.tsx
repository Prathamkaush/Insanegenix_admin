import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import MediaPicker from "../modals/MediaPicker";
import {
  FiTrash2,
  FiChevronUp,
  FiChevronDown,
  FiInstagram,
  FiUpload,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

export default function InfluencerItem({
  item,
  index,
  totalItems,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  item: any;
  index: number;
  totalItems: number;
  onChange: (v: any) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [product, setProduct] = useState<any>(null);

  /* ---------------- product fetch ---------------- */

function normalizeInstagramUrl(url: string) {
  if (!url) return null;

  try {
    const clean = url.split("?")[0];
    return clean.endsWith("/") ? clean : clean + "/";
  } catch {
    return null;
  }
}


  useEffect(() => {
    if (!item.productId) {
      setProduct(null);
      return;
    }

    api
      .get(`/products/${item.productId}`)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null));
  }, [item.productId]);

  /* ---------------- product search ---------------- */

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

  const selectProduct = (p: any) => {
    onChange({ productId: p.id });
    setSearch("");
    setResults([]);
  };

  const clearProduct = () => {
    onChange({ productId: null });
  };

  /* ---------------- validation ---------------- */

  const hasMedia =
  (item.mediaType === "UPLOAD" && Number.isInteger(item.mediaId)) ||
  (item.mediaType === "INSTAGRAM" &&
    typeof item.embedUrl === "string" &&
    item.embedUrl.startsWith("https://www.instagram.com"));

  const hasProduct = !!item.productId;
  const isComplete = hasMedia && hasProduct;

  /* ---------------- render ---------------- */

  return (
    <div
      className={`border-2 rounded-sm bg-white overflow-hidden transition-all ${
        isComplete ? "border-gray-100" : "border-amber-200 bg-amber-50"
      }`}
    >
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-4">
          <span
            className={`text-[10px] font-black uppercase tracking-widest ${
              isComplete ? "text-gray-400" : "text-amber-600"
            }`}
          >
            Reel #{index + 1}
          </span>

          {isComplete ? (
            <span className="flex items-center gap-1 text-[9px] text-emerald-600 uppercase tracking-widest">
              <FiCheck size={12} /> Complete
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[9px] text-amber-600 uppercase tracking-widest">
              <FiAlertCircle size={12} /> Incomplete
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-2 hover:bg-gray-100 rounded-sm disabled:opacity-30"
          >
            <FiChevronUp size={14} />
          </button>

          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === totalItems - 1}
            className="p-2 hover:bg-gray-100 rounded-sm disabled:opacity-30"
          >
            <FiChevronDown size={14} />
          </button>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          <button
            type="button"
            onClick={onRemove}
            className="p-2 hover:bg-red-50 text-red-500 rounded-sm"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Media selector */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
            Media Source
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                item.mediaType !== "UPLOAD" &&
                onChange({ mediaType: "UPLOAD", embedUrl: null ,  mediaId: null })
              }
              className={`p-4 border-2 rounded-sm flex items-center justify-center gap-2 ${
                item.mediaType === "UPLOAD"
                  ? "border-brandRed bg-red-50 text-brandRed"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <FiUpload /> <span className="text-xs font-bold">Upload</span>
            </button>

            <button
              type="button"
              onClick={() =>
                item.mediaType !== "INSTAGRAM" &&
                onChange({ mediaType: "INSTAGRAM", mediaId: null  ,  embedUrl: "" })
              }
              className={`p-4 border-2 rounded-sm flex items-center justify-center gap-2 ${
                item.mediaType === "INSTAGRAM"
                  ? "border-brandRed bg-red-50 text-brandRed"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <FiInstagram /> <span className="text-xs font-bold">Instagram</span>
            </button>
          </div>
        </div>

        {/* Upload */}
        {item.mediaType === "UPLOAD" && (
          <MediaPicker
            value={item.mediaId ? [item.mediaId] : []}
            multiple={false}
            accept={["image/*", "video/*"]}
            onChange={(ids) => onChange({ mediaId: ids[0] , embedUrl: null,  })}
          />
        )}

        {/* Instagram */}
        {item.mediaType === "INSTAGRAM" && (
          <div>
            <input
              type="url"
              placeholder="https://www.instagram.com/reel/..."
              value={item.embedUrl || ""}
              onChange={(e) => onChange({ embedUrl: normalizeInstagramUrl(e.target.value), mediaId: null })}
              className="w-full bg-gray-50 px-4 py-3 rounded-sm text-xs"
            />
            <p className="text-[9px] text-gray-400 mt-2 uppercase tracking-widest">
              💡 Paste the Instagram Reel or Post URL (e.g. https://www.instagram.com/reel/...)
)
            </p>
          </div>
        )}

        {/* ✅ NEW: Influencer Name & CTA Text */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
              Influencer Name <span className="text-gray-300">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="@fashionista"
              value={item.influencerName || ""}
              onChange={(e) => onChange({ influencerName: e.target.value })}
              className="w-full bg-gray-50 px-4 py-3 rounded-sm text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
              CTA Button Text
            </label>
            <input
              type="text"
              placeholder="Shop Now"
              value={item.ctaText || "Shop Now"}
              onChange={(e) => onChange({ ctaText: e.target.value })}
              className="w-full bg-gray-50 px-4 py-3 rounded-sm text-xs"
            />
          </div>
        </div>

        {/* Product */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
            Linked Product
          </label>

          {product ? (
            <div className="bg-emerald-50 border border-emerald-200 p-4 flex justify-between rounded-sm">
              <div className="flex gap-3">
                {product.media?.[0]?.url && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${product.media[0].url}`}
                    className="w-12 h-12 object-cover rounded-sm"
                    alt={product.title}
                  />
                )}
                <div>
                  <p className="text-[10px] font-bold">{product.title}</p>
                  <p className="text-[9px] text-gray-500">
                    ID: {product.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={clearProduct}
                className="text-[9px] text-red-500 uppercase font-bold hover:text-red-700"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                placeholder="Search for product..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  searchProducts(e.target.value);
                }}
                className="w-full bg-gray-50 px-4 py-3 rounded-sm text-xs"
              />

              {searching && (
                <p className="text-[9px] text-gray-400 uppercase tracking-widest">
                  Searching...
                </p>
              )}

              {results.length > 0 && (
                <div className="border border-gray-100 rounded-sm overflow-hidden">
                  {results.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectProduct(p)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex gap-3 items-center border-b border-gray-50 last:border-b-0"
                    >
                      {p.media?.[0]?.url && (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}${p.media[0].url}`}
                          className="w-10 h-10 object-cover rounded-sm"
                          alt={p.title}
                        />
                      )}
                      <div>
                        <p className="text-[10px] font-bold">{p.title}</p>
                        <p className="text-[9px] text-gray-400">₹{p.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}