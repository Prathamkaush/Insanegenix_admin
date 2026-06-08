"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiCheckCircle, FiImage, FiLayers, FiPlay } from "react-icons/fi";
import AdminLayout from "@/components/AdminLayout";
import HeroFields from "@/components/common/HeroFields";
import { api } from "@/lib/api";

type HomeEditorMode = "HERO" | "VIDEO";

const defaultHeroConfig = {
  sectionKind: "HERO",
  slides: [
    {
      mediaId: null,
      mobileMediaId: null,
      title: "",
      subtitle: "",
      ctaText: "",
      ctaLink: "",
    },
  ],
};

const defaultVideoConfig = {
  sectionKind: "VIDEO",
  slides: [],
  videoBanner: {
    enabled: true,
    backgroundMediaId: null,
    videoMediaId: null,
    externalVideoUrl: "",
  },
};

function inferMode(config: any): HomeEditorMode {
  if (config?.sectionKind === "VIDEO") return "VIDEO";
  if (config?.videoBanner?.enabled && !config?.slides?.length) return "VIDEO";
  return "HERO";
}

export default function EditHomepageSectionPage() {
  const router = useRouter();
  const params = useParams();
  const sectionId = params?.id ? Number(params.id) : null;

  const [mode, setMode] = useState<HomeEditorMode>("HERO");
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [config, setConfig] = useState<any>(defaultHeroConfig);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sectionId) return;

    setLoadingData(true);
    api
      .get(`/admin/homepage/${sectionId}`)
      .then((res) => {
        const section = res.data;
        const savedConfig = section.config || {};
        const nextMode = inferMode(savedConfig);

        setMode(nextMode);
        setTitle(section.title || "");
        setPosition(section.position);
        setIsActive(section.isActive);
        setConfig({
          ...(nextMode === "HERO" ? defaultHeroConfig : defaultVideoConfig),
          ...savedConfig,
          sectionKind: nextMode,
        });
      })
      .catch((err) => {
        setError("Failed to load section");
        console.error(err);
      })
      .finally(() => setLoadingData(false));
  }, [sectionId]);

  const changeMode = (nextMode: HomeEditorMode) => {
    setMode(nextMode);
    setConfig(nextMode === "HERO" ? defaultHeroConfig : defaultVideoConfig);
  };

  const submit = async () => {
    try {
      setLoading(true);
      setError("");

      if (mode === "HERO" && (!config.slides || config.slides.length === 0)) {
        setError("Please add at least one hero slide.");
        return;
      }

      await api.patch(`/admin/homepage/${sectionId}`, {
        title,
        type: "HERO",
        position,
        isActive,
        config: {
          ...config,
          sectionKind: mode,
          videoBanner:
            mode === "VIDEO"
              ? { ...(config.videoBanner || {}), enabled: true }
              : config.videoBanner,
        },
      });

      router.push("/homepage");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update section");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <AdminLayout>
        <div className="flex h-screen items-center justify-center">
          <p className="text-xs uppercase tracking-widest text-gray-400">Loading section...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-page admin-homepage-editor max-w-5xl">
        <div className="admin-hero">
          <div>
            <button
              onClick={() => router.back()}
              className="mb-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition hover:text-white"
            >
              <FiArrowLeft size={14} /> Back to Canvas
            </button>
            <h1 className="admin-hero-title">
              Edit <span className="text-brandRed">Home Section</span>
            </h1>
            <p className="admin-hero-subtitle">Manage only the homepage hero and video areas.</p>
          </div>
          <div className="admin-dark-button pointer-events-none">
            <FiLayers size={16} /> Section #{sectionId}
          </div>
        </div>

        <section className="admin-surface p-6 md:p-8 space-y-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <FiLayers className="text-brandRed" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Section Core</h2>
          </div>

          <div>
            <label className="block mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Internal Section Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={mode === "HERO" ? "Homepage hero" : "Homepage video"}
              className="w-full bg-gray-50 border-none px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-widest outline-none ring-1 ring-gray-100 focus:ring-brandRed transition-all"
            />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <label className="block mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Section Type
              </label>
              <select
                value={mode}
                onChange={(e) => changeMode(e.target.value as HomeEditorMode)}
                className="w-full bg-gray-50 border-none px-4 py-3 rounded-sm text-xs font-bold outline-none ring-1 ring-gray-100 focus:ring-brandRed"
              >
                <option value="HERO">Hero Section</option>
                <option value="VIDEO">Video Section</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Position Index
              </label>
              <input
                type="number"
                value={position}
                onChange={(e) => setPosition(Number(e.target.value))}
                className="w-full bg-gray-50 border-none px-4 py-3 rounded-sm text-xs font-bold outline-none ring-1 ring-gray-100"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setIsActive(!isActive)}
                className={`flex w-full items-center justify-center gap-2 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${
                  isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-gray-100 text-gray-500 border border-gray-200"
                }`}
              >
                {isActive ? <FiCheckCircle /> : null} {isActive ? "Live" : "Draft"}
              </button>
            </div>
          </div>
        </section>

        <section className="admin-surface p-6 md:p-8 min-h-[360px]">
          <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
            {mode === "HERO" ? <FiImage className="text-brandRed" /> : <FiPlay className="text-brandRed" />}
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
              {mode === "HERO" ? "Hero Section" : "Video Section"}
            </h2>
          </div>
          <HeroFields value={config} onChange={setConfig} mode={mode} />
        </section>

        {error ? (
          <div className="bg-rose-50 border border-rose-100 p-4 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-rose-600">{error}</p>
          </div>
        ) : null}

        <div className="flex flex-col gap-4 md:flex-row">
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 rounded-md bg-brandRed py-6 text-[11px] font-black uppercase tracking-[0.4em] text-white transition-all hover:bg-white hover:text-brandBlack active:scale-95 disabled:bg-gray-200"
          >
            {loading ? "Updating..." : "Update Section"}
          </button>
          <button
            onClick={() => router.back()}
            className="rounded-md border border-white/10 px-12 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 transition-all hover:border-white hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
