"use client";

import MediaPicker from "@/components/modals/MediaPicker";
import type { ReactNode } from "react";
import { FiImage, FiMousePointer, FiPlay, FiPlus, FiTrash2, FiType } from "react-icons/fi";

type Slide = {
  mediaId: number | null;
  mobileMediaId?: number | null;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
};

type VideoBanner = {
  enabled?: boolean;
  backgroundMediaId?: number | null;
  videoMediaId?: number | null;
  externalVideoUrl?: string;
};

type HeroConfig = {
  sectionKind?: "HERO" | "VIDEO";
  slides?: Slide[];
  videoBanner?: VideoBanner;
};

export default function HeroFields({
  value = { sectionKind: "HERO", slides: [], videoBanner: { enabled: false } },
  onChange,
  mode = "HERO",
}: {
  value: HeroConfig;
  onChange: (v: HeroConfig) => void;
  mode?: "HERO" | "VIDEO";
}) {
  const slides = value.slides || [];
  const videoBanner = value.videoBanner || { enabled: mode === "VIDEO" };

  const updateSlide = (i: number, field: keyof Slide, val: any) => {
    const updated = [...slides];
    updated[i] = { ...updated[i], [field]: val };
    onChange({ ...value, sectionKind: mode, slides: updated });
  };

  const addSlide = () => {
    onChange({
      ...value,
      sectionKind: mode,
      slides: [
        ...slides,
        {
          mediaId: null,
          mobileMediaId: null,
          title: "",
          subtitle: "",
          ctaText: "",
          ctaLink: "",
        },
      ],
    });
  };

  const removeSlide = (i: number) => {
    onChange({ ...value, sectionKind: mode, slides: slides.filter((_, idx) => idx !== i) });
  };

  const updateVideoBanner = (field: keyof VideoBanner, val: any) => {
    onChange({
      ...value,
      sectionKind: mode,
      videoBanner: {
        ...videoBanner,
        enabled: mode === "VIDEO" ? true : videoBanner.enabled,
        [field]: val,
      },
    });
  };

  if (mode === "VIDEO") {
    return <VideoSectionFields videoBanner={{ ...videoBanner, enabled: true }} updateVideoBanner={updateVideoBanner} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white">
            <FiImage className="text-brandRed" /> Hero Section
          </h3>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Add homepage hero slides with optional mobile media and CTA.
          </p>
        </div>
        <span className="rounded-sm bg-white px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
          {slides.length} slides
        </span>
      </div>

      <div className="space-y-8">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="relative rounded-sm border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brandBlack text-[10px] font-black text-white shadow-lg">
              {index + 1}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <FieldHeading icon={<FiImage />} label="Desktop Hero Media" />
                <MediaPicker
                  value={slide.mediaId ? [slide.mediaId] : []}
                  onChange={(ids) => updateSlide(index, "mediaId", ids[0] ?? null)}
                  multiple={false}
                  accept={["image/*", "video/*"]}
                  guidance={{
                    label: "Desktop hero ratio",
                    ratio: "1440:736",
                    size: "1440 x 736 px",
                    previewClassName: "aspect-[1440/736]",
                  }}
                />

                <div className="mt-5">
                  <FieldHeading icon={<FiImage />} label="Optional Mobile Media" />
                  <MediaPicker
                    value={slide.mobileMediaId ? [slide.mobileMediaId] : []}
                    onChange={(ids) => updateSlide(index, "mobileMediaId", ids[0] ?? null)}
                    multiple={false}
                    accept={["image/*", "video/*"]}
                    guidance={{
                      label: "Mobile hero ratio",
                      ratio: "768:1376",
                      size: "768 x 1376 px",
                      previewClassName: "aspect-[768/1376]",
                    }}
                  />
                </div>
              </div>

              <div className="space-y-6 lg:col-span-7">
                <div className="space-y-4">
                  <FieldHeading icon={<FiType />} label="Text" />
                  <input
                    placeholder="Slide title"
                    value={slide.title}
                    onChange={(e) => updateSlide(index, "title", e.target.value)}
                    className="w-full border-b border-gray-200 py-2 text-sm font-black uppercase tracking-widest text-zinc-950 outline-none transition focus:border-brandRed"
                  />
                  <input
                    placeholder="Subtitle"
                    value={slide.subtitle || ""}
                    onChange={(e) => updateSlide(index, "subtitle", e.target.value)}
                    className="w-full border-b border-gray-200 py-2 text-xs font-bold text-zinc-700 outline-none transition focus:border-brandRed"
                  />
                </div>

                <div className="space-y-4">
                  <FieldHeading icon={<FiMousePointer />} label="Action" />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      placeholder="Button text"
                      value={slide.ctaText || ""}
                      onChange={(e) => updateSlide(index, "ctaText", e.target.value)}
                      className="w-full bg-gray-50 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-950 outline-none ring-1 ring-gray-100 transition focus:ring-brandRed"
                    />
                    <input
                      placeholder="/shop"
                      value={slide.ctaLink || ""}
                      onChange={(e) => updateSlide(index, "ctaLink", e.target.value)}
                      className="w-full bg-gray-50 px-4 py-3 text-[10px] font-bold text-zinc-950 outline-none ring-1 ring-gray-100 transition focus:ring-brandRed"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => removeSlide(index)}
              className="absolute right-4 top-4 p-2 text-gray-300 transition hover:text-brandRed"
              title="Remove slide"
              type="button"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addSlide}
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-sm border-2 border-dashed border-white/15 py-6 text-[10px] font-black uppercase tracking-[0.35em] text-zinc-400 transition hover:border-brandRed hover:bg-brandRed/5 hover:text-brandRed"
      >
        <FiPlus size={16} /> Add Hero Slide
      </button>
    </div>
  );
}

function VideoSectionFields({
  videoBanner,
  updateVideoBanner,
}: {
  videoBanner: VideoBanner;
  updateVideoBanner: (field: keyof VideoBanner, val: any) => void;
}) {
  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-4">
        <h3 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white">
          <FiPlay className="text-brandRed" /> Video Section
        </h3>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          Configure the large play-button section on the customer homepage.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <FieldHeading icon={<FiImage />} label="Background Image or Video" />
          <MediaPicker
            value={videoBanner.backgroundMediaId ? [videoBanner.backgroundMediaId] : []}
            onChange={(ids) => updateVideoBanner("backgroundMediaId", ids[0] ?? null)}
            multiple={false}
            accept={["image/*", "video/*"]}
          />
        </div>

        <div className="space-y-5">
          <div>
            <FieldHeading icon={<FiPlay />} label="Uploaded Video" />
            <MediaPicker
              value={videoBanner.videoMediaId ? [videoBanner.videoMediaId] : []}
              onChange={(ids) => updateVideoBanner("videoMediaId", ids[0] ?? null)}
              multiple={false}
              accept={["video/*"]}
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Or External Video URL
            </label>
            <input
              value={videoBanner.externalVideoUrl || ""}
              onChange={(e) => updateVideoBanner("externalVideoUrl", e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full bg-gray-50 px-4 py-3 text-xs font-bold text-zinc-950 outline-none ring-1 ring-gray-100 transition focus:ring-brandRed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldHeading({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
      <span className="text-brandRed">{icon}</span> {label}
    </div>
  );
}
