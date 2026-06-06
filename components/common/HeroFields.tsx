"use client";

import MediaPicker from "@/components/modals/MediaPicker";
import { FiPlus, FiTrash2, FiInfo, FiMousePointer, FiType } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

type Slide = {
  mediaId: number | null;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
};

export default function HeroFields({
  value = { slides: [] },
  onChange,
}: {
  value: { slides: Slide[] };
  onChange: (v: any) => void;
}) {
  const slides = value.slides || [];

  const updateSlide = (i: number, field: keyof Slide, val: any) => {
    const updated = [...slides];
    updated[i] = { ...updated[i], [field]: val };
    onChange({ slides: updated });
  };

  const addSlide = () =>
    onChange({
      slides: [
        ...slides,
        {
          mediaId: null,
          title: "",
          subtitle: "",
          ctaText: "",
          ctaLink: "",
        },
      ],
    });

  const removeSlide = (i: number) =>
    onChange({ slides: slides.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-brandBlack flex items-center gap-2">
          Hero Storyboard
        </h3>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-sm">
          {slides.length} Slides Active
        </span>
      </div>

      {/* REFINED RULES PANEL */}
      <div className="bg-brandRed/5 border border-brandRed/10 p-4 rounded-sm space-y-3">
        <div className="flex items-center gap-2 text-brandRed">
          <FiInfo size={14} />
          <p className="text-[10px] font-black uppercase tracking-widest">Aesthetic Guidelines</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-[9px] font-medium text-gray-500 uppercase tracking-tighter">
            <span className="text-brandBlack font-bold block mb-1">Images</span>
            16:9 Aspect Ratio • Optimized for Web
          </div>
          <div className="text-[9px] font-medium text-gray-500 uppercase tracking-tighter border-x border-brandRed/10 px-4">
            <span className="text-brandBlack font-bold block mb-1">Videos</span>
            Max 30s • Loop Enabled • Under 5MB
          </div>
          <div className="text-[9px] font-medium text-gray-500 uppercase tracking-tighter">
            <span className="text-brandBlack font-bold block mb-1">Copy</span>
            Keep titles punchy & italic for vibe
          </div>
        </div>
      </div>

      {/* SLIDES LIST */}
      <div className="space-y-10">
        <AnimatePresence>
          {slides.map((s, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={i}
              className="relative bg-white border border-gray-100 p-6 md:p-8 rounded-sm shadow-sm hover:shadow-md transition-all group"
            >
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-brandBlack text-white flex items-center justify-center text-[10px] font-black rounded-full shadow-lg border-2 border-white">
                {i + 1}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT: MEDIA SELECTION */}
                <div className="lg:col-span-5">
                  <MediaPicker
                    value={s.mediaId ? [s.mediaId] : []}
                    onChange={(ids) => updateSlide(i, "mediaId", ids[0] ?? null)}
                    multiple={false}
                    accept={["image/*", "video/*"]}
                  />
                </div>

                {/* RIGHT: TEXT CONFIG */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FiType size={14} />
                      <h4 className="text-[10px] font-black uppercase tracking-widest">Typography</h4>
                    </div>
                    <input
                      placeholder="SLIDE TITLE (E.G., WALK WITH PASSION)"
                      value={s.title}
                      onChange={(e) => updateSlide(i, "title", e.target.value)}
                      className="w-full border-b border-gray-100 py-2 outline-none focus:border-brandRed transition-all text-sm font-black uppercase tracking-widest placeholder:text-gray-200"
                    />
                    <input
                      placeholder="Subtitle or Contextual Text..."
                      value={s.subtitle || ""}
                      onChange={(e) => updateSlide(i, "subtitle", e.target.value)}
                      className="w-full border-b border-gray-100 py-2 outline-none focus:border-brandRed transition-all text-xs font-medium text-gray-500 italic"
                    />
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FiMousePointer size={14} />
                      <h4 className="text-[10px] font-black uppercase tracking-widest">Action Details</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        placeholder="CTA TEXT (E.G. SHOP NOW)"
                        value={s.ctaText || ""}
                        onChange={(e) => updateSlide(i, "ctaText", e.target.value)}
                        className="w-full bg-gray-50 px-4 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest outline-none ring-1 ring-gray-100 focus:ring-brandRed transition-all"
                      />
                      <input
                        placeholder="CTA Link (/all-products)"
                        value={s.ctaLink || ""}
                        onChange={(e) => updateSlide(i, "ctaLink", e.target.value)}
                        className="w-full bg-gray-50 px-4 py-3 rounded-sm text-[10px] font-medium outline-none ring-1 ring-gray-100 focus:ring-brandRed transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* REMOVE ACTION */}
              <button
                onClick={() => removeSlide(i)}
                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove Slide"
              >
                <FiTrash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ADD ACTION */}
      <button
        onClick={addSlide}
        className="w-full py-6 border-2 border-dashed border-gray-200 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:border-brandRed hover:text-brandRed hover:bg-brandRed/5 transition-all flex items-center justify-center gap-3"
      >
        <FiPlus size={16} /> Add Storyboard Slide
      </button>
    </div>
  );
}