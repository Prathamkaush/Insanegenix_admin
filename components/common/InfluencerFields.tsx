"use client";

import { nanoid } from "nanoid";
import InfluencerItem from "./InfluencerItem";
import { FiAlertCircle } from "react-icons/fi";

type InfluencerUIItem = {
  id: string;
  mediaType: "UPLOAD" | "INSTAGRAM";
  mediaId: number | null;
  embedUrl: string | null;
  productId: number | null;
  influencerName?: string;
  ctaText?: string;
  position: number;
};

export default function InfluencerFields({
  value,
  onChange,
}: {
  value?: { items?: InfluencerUIItem[] };
  onChange: (v: { items: InfluencerUIItem[] }) => void;
}) {
  const items: InfluencerUIItem[] = value?.items ?? [];

  /* ---------------- helpers ---------------- */

  const syncPositions = (list: InfluencerUIItem[]) =>
    list.map((item, index) => ({ ...item, position: index }));

  /* ---------------- actions ---------------- */

  const addItem = () => {
    const next = syncPositions([
      ...items,
      {
        id: nanoid(),
        mediaType: "UPLOAD",
        mediaId: null,
        embedUrl: null,
        productId: null,
        influencerName: "",
        ctaText: "Shop Now",
        position: items.length,
      },
    ]);

    onChange({ items: next });
  };

    const updateItem = (id: string, patch: Partial<InfluencerUIItem>) => {
  onChange({
    items: items.map((i) =>
      i.id === id ? { ...i, ...patch } : i
    ),
  });
};

  const removeItem = (id: string) => {
    const next = syncPositions(items.filter((i) => i.id !== id));
    onChange({ items: next });
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const next = [...items];
    const target = direction === "up" ? index - 1 : index + 1;

    if (target < 0 || target >= next.length) return;

    [next[index], next[target]] = [next[target], next[index]];

    onChange({ items: syncPositions(next) });
  };

  /* ---------------- validation ---------------- */

  const incompleteItems = items.filter((item) => {
    const hasMedia =
  (item.mediaType === "UPLOAD" && Number.isInteger(item.mediaId)) ||
  (item.mediaType === "INSTAGRAM" && item.embedUrl?.startsWith("https://"));

    return !hasMedia || !item.productId;
  });

  /* ---------------- render ---------------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-brandBlack">
            Influencer Reels
          </h3>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">
            {items.length} reels configured
          </p>
        </div>

        <button
          type="button"
          onClick={addItem}
          className="px-6 py-2 bg-brandRed text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-opacity-90 transition-all"
        >
          + Add Reel
        </button>
      </div>

      {/* Validation */}
      {incompleteItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm flex items-start gap-3">
          <FiAlertCircle className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
              Incomplete Items
            </p>
            <p className="text-[9px] text-amber-700 mt-1">
              {incompleteItems.length} reel
              {incompleteItems.length > 1 ? "s" : ""} missing media or product
            </p>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-sm p-12 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
              No reels added yet
            </p>
            <p className="text-[9px] text-gray-300 mt-2">
              Click "Add Reel" to get started
            </p>
          </div>
        ) : (
          items.map((item, idx) => (
            <InfluencerItem
              key={item.id}
              item={item}
              index={idx}
              totalItems={items.length}
              onChange={(patch) => updateItem(item.id, patch)}
              onRemove={() => removeItem(item.id)}
              onMoveUp={() => moveItem(idx, "up")}
              onMoveDown={() => moveItem(idx, "down")}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="bg-gray-50 border border-gray-100 p-4 rounded-sm">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest">
            💡 Tip: Reels will appear in this order on your homepage.
          </p>
        </div>
      )}
    </div>
  );
}
