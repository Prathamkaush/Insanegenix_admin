"use client";

import { useState } from "react";
import HeroFields from "./HeroFields";
import CategoryStripFields from "./CategoryStripFields";
import EditorialFields from "./EditorialFields";
import InfluencerFields from "./InfluencerFields";
import { FiLayers, FiSettings, FiSave, FiCheckCircle, FiInstagram } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

/* ✅ FRONTEND-SAFE ENUM */
const HOME_SECTION_TYPES = [
  "HERO",
  "CATEGORY_STRIP",
  "EDITORIAL",
  "INFLUENCER",
] as const;

type HomeSectionType = typeof HOME_SECTION_TYPES[number];

export default function SectionForm({
  initial,
  onSubmit,
}: {
  initial?: any;
  onSubmit: (v: any) => void;
}) {
  const [form, setForm] = useState<{
    type: HomeSectionType;
    title: string;
    position: number;
    isActive: boolean;
    config: any;
  }>(
    initial || {
      type: "HERO",
      title: "",
      position: 0,
      isActive: true,
      config: {},
    }
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      
      {/* 1. SECTION IDENTITY */}
      <div className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm space-y-8">
        <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
          <FiLayers className="text-brandRed" />
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brandBlack">Section Type</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Blueprint</label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value as HomeSectionType,
                  config: {}, // Reset config on type change
                })
              }
              className="w-full bg-gray-50 border-none px-4 py-3 rounded-sm text-xs font-bold outline-none ring-1 ring-gray-100 focus:ring-brandRed transition-all"
            >
              {HOME_SECTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Section Internal Title</label>
            <input
              type="text"
              placeholder="e.g., Summer Drop 2026"
              className="w-full bg-gray-50 border-none px-4 py-3 rounded-sm text-xs font-bold outline-none ring-1 ring-gray-100 focus:ring-brandRed transition-all"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC CONFIGURATION AREA */}
      <div className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-8">
          <div className="flex items-center gap-3">
            {/* Dynamic Icon based on type */}
            {form.type === "INFLUENCER" ? (
              <FiInstagram className="text-brandRed" />
            ) : (
              <FiSettings className="text-brandRed" />
            )}
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brandBlack">
              {form.type.replace("_", " ")} Configuration
            </h2>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={form.type}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {form.type === "HERO" && (
              <HeroFields value={form.config} onChange={(c) => setForm({ ...form, config: c })} />
            )}

            {form.type === "CATEGORY_STRIP" && (
              <CategoryStripFields value={form.config} onChange={(c: any) => setForm({ ...form, config: c })} />
            )}

            {form.type === "EDITORIAL" && (
              <EditorialFields value={form.config} onChange={(c: any) => setForm({ ...form, config: c })} />
            )}

            {form.type === "INFLUENCER" && (
              <InfluencerFields value={form.config} onChange={(c: any) => setForm({ ...form, config: c })} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. VISIBILITY & ORDER */}
      <div className="bg-gray-50 p-6 rounded-sm border border-gray-100 flex flex-wrap items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={() => setForm({...form, isActive: !form.isActive})}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                form.isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-gray-200 text-gray-500"
              }`}
            >
              {form.isActive ? <FiCheckCircle /> : null} {form.isActive ? "Active on Site" : "Draft Mode"}
            </button>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Position Index:</span>
               <input 
                 type="number" 
                 value={form.position}
                 onChange={(e) => setForm({...form, position: parseInt(e.target.value) || 0})}
                 className="w-16 bg-white border border-gray-200 py-1 px-2 rounded-sm text-xs font-bold text-center"
               />
            </div>
         </div>

         <button
            type="button"
            onClick={() => onSubmit(form)}
            className="flex items-center gap-3 px-10 py-4 bg-brandBlack text-white rounded-sm font-black uppercase tracking-[0.3em] text-[11px] shadow-xl hover:bg-brandRed transition-all active:scale-95"
          >
            <FiSave /> {initial ? "Update Canvas Section" : "Publish to Homepage"}
          </button>
      </div>
    </div>
  );
}