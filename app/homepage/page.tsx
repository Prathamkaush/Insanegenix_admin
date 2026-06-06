"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import SectionCard from "@/components/common/SectionCard";
import AdminLayout from "@/components/AdminLayout";
import { FiLayout, FiPlus, FiRefreshCw, FiZap } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminHomepage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadSections = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.get("/admin/homepage");
      setSections(res.data);
    } catch (err) {
      console.error("Failed to load sections");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
          <FiLayout className="text-gray-100 w-16 h-16 mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
            Structuring your studio...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-page">
        
        {/* HEADER SECTION */}
        <div className="admin-hero">
          <div>
            <h1 className="admin-hero-title">
              Homepage <span className="text-brandRed">Canvas</span>
            </h1>
            <p className="admin-hero-subtitle">
              Curate the first impression for customers and campaign hauls.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={loadSections}
              disabled={isRefreshing}
              className={`admin-dark-button px-3 ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <FiRefreshCw size={16} />
            </button>
            <Link
              href="/homepage/create"
              className="admin-red-button flex-1 md:flex-none"
            >
              <FiPlus size={14} /> Add New Section
            </Link>
          </div>
        </div>

        {/* SECTIONS CONTAINER */}
        <div className="space-y-6">
          {sections.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-zinc-200 py-20 rounded-md text-center">
               <FiLayout className="mx-auto text-gray-200 w-12 h-12 mb-4" />
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No active sections found.</p>
               <p className="text-[10px] text-gray-300 mt-2 uppercase tracking-widest">Click Add New Section to begin curation.</p>
            </div>
          ) : (
            <AnimatePresence>
              <div className="grid grid-cols-1 gap-6">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SectionCard
                      section={section}
                      onUpdate={loadSections}
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>

        {/* FOOTER INFO */}
        <div className="mt-12 text-center">
           <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em]">
             Note: The order of sections here determines the layout order for customers.
           </p>
        </div>
      </div>
    </AdminLayout>
  );
}
