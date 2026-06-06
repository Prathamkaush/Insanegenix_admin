"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";

import HeroFields from "@/components/common/HeroFields";
import CategoryStripFields from "@/components/common/CategoryStripFields";
import EditorialFields from "@/components/common/EditorialFields";
import InfluencerFields from "@/components/common/InfluencerFields";
import AdminLayout from "@/components/AdminLayout";
import { FiArrowLeft, FiLayers, FiSettings, FiCheckCircle, FiInstagram } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

type SectionType = "HERO" | "CATEGORY_STRIP" | "EDITORIAL" | "INFLUENCER";

export default function EditHomepageSectionPage() {
  const router = useRouter();
  const params = useParams();
  const sectionId = params?.id ? Number(params.id) : null;

  const [type, setType] = useState<SectionType>("HERO");
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  // ✅ Load existing section data
  useEffect(() => {
    if (!sectionId) return;

    setLoadingData(true);
    api
      .get(`/admin/homepage/${sectionId}`)
      .then((res) => {
        const section = res.data;
        setType(section.type);
        setTitle(section.title || "");
        setPosition(section.position);
        setIsActive(section.isActive);

        // ✅ For INFLUENCER sections, map database items to frontend format
        if (section.type === "INFLUENCER" && section.influencerItems) {
          setConfig({
            items: section.influencerItems.map((item: any, index: number) => ({
              id: `item-${item.id}`, // UI needs a unique ID
              mediaType: item.embedUrl ? "INSTAGRAM" : "UPLOAD",
              mediaId: item.mediaId,
              embedUrl: item.embedUrl,
              productId: item.productId,
              influencerName: item.influencerName || "",
              ctaText: item.ctaText || "Shop Now",
              position: index,
            })),
          });
        } else {
          // For other section types, use config as-is
          setConfig(section.config || {});
        }
      })
      .catch((err) => {
        setError("Failed to load section");
        console.error(err);
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [sectionId]);

  const submit = async () => {
    try {
      setLoading(true);
      setError("");

      if (type === "HERO" && (!config.slides || config.slides.length === 0)) {
        setError("Please add at least one hero slide.");
        setLoading(false);
        return;
      }

      if (type === "INFLUENCER" && (!config.items || config.items.length === 0)) {
        setError("Please add at least one influencer reel.");
        setLoading(false);
        return;
      }

      await api.patch(`/admin/homepage/${sectionId}`, {
        title,
        type,
        position,
        isActive,
        config,
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
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-400 uppercase text-xs tracking-widest">Loading section...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-page max-w-5xl">
        
        {/* HEADER */}
        <div className="admin-hero">
          <div>
            <button 
              onClick={() => router.back()} 
              className="mb-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition hover:text-white"
            >
              <FiArrowLeft size={14} /> Back to Canvas
            </button>
            <h1 className="admin-hero-title">
              Edit <span className="text-brandRed">Canvas Section</span>
            </h1>
            <p className="admin-hero-subtitle">
              Modify your homepage architecture
            </p>
          </div>
          <div className="admin-dark-button pointer-events-none">
            <FiLayers size={16} /> Section #{sectionId}
          </div>
        </div>

        <div className="space-y-10">
          
          {/* 1. CORE BLUEPRINT INFO */}
          <section className="admin-surface p-6 md:p-8 space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
              <FiLayers className="text-brandRed" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brandBlack">Section Core</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
                  Internal Section Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.G., SUMMER EDITORIAL / TOP CATEGORIES"
                  className="w-full bg-gray-50 border-none px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-widest outline-none ring-1 ring-gray-100 focus:ring-brandRed transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
                    Blueprint Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value as SectionType);
                      setConfig({}); // Reset config when switching types
                    }}
                    className="w-full bg-gray-50 border-none px-4 py-3 rounded-sm text-xs font-bold outline-none ring-1 ring-gray-100 focus:ring-brandRed"
                  >
                    <option value="HERO">Hero Storyboard</option>
                    <option value="CATEGORY_STRIP">Category Strip</option>
                    <option value="EDITORIAL">Editorial / New In</option>
                    <option value="INFLUENCER">Influencer Reel</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
                    Position Index
                  </label>
                  <input
                    type="number"
                    value={position}
                    onChange={(e) => setPosition(Number(e.target.value))}
                    className="w-full bg-gray-50 border-none px-4 py-3 rounded-sm text-xs font-bold outline-none ring-1 ring-gray-100"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6 md:pt-0">
                  <button 
                    onClick={() => setIsActive(!isActive)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${
                      isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-gray-100 text-gray-400 border border-gray-200"
                    }`}
                  >
                    {isActive ? <FiCheckCircle /> : null} {isActive ? "Live" : "Draft Mode"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 2. DYNAMIC CONFIGURATION */}
          <section className="admin-surface p-6 md:p-8 min-h-[400px]">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-8">
              {type === "INFLUENCER" ? <FiInstagram className="text-brandRed" /> : <FiSettings className="text-brandRed" />}
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brandBlack">
                {type.replace("_", " ")} Configuration
              </h2>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {type === "HERO" && <HeroFields value={config} onChange={setConfig} />}
                {type === "CATEGORY_STRIP" && <CategoryStripFields value={config} onChange={setConfig} />}
                {type === "EDITORIAL" && <EditorialFields value={config} onChange={setConfig} />}
                {type === "INFLUENCER" && <InfluencerFields value={config} onChange={setConfig} />}
              </motion.div>
            </AnimatePresence>
          </section>

          {/* ERROR DISPLAY */}
          {error && (
            <div className="bg-rose-50 border border-rose-100 p-4 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-600">{error}</p>
            </div>
          )}

          {/* 3. FINAL ACTIONS */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={submit}
              disabled={loading}
              className="flex-1 rounded-md bg-brandRed py-6 text-[11px] font-black uppercase tracking-[0.4em] text-white transition-all hover:bg-brandBlack active:scale-95 disabled:bg-gray-200"
            >
              {loading ? "Updating Canvas..." : "Update Section"}
            </button>
            <button
              onClick={() => router.back()}
              className="rounded-md border border-gray-200 px-12 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 transition-all hover:border-brandBlack hover:text-brandBlack"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
