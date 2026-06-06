"use client";

import Link from "next/link";
import { api } from "@/lib/api";
import { FiEdit3, FiTrash2, FiEye, FiEyeOff, FiMove } from "react-icons/fi";
import { motion } from "framer-motion";

export default function SectionCard({ section, onUpdate }: any) {
  const toggle = async () => {
    try {
      await api.patch(`/admin/homepage/${section.id}`, {
        isActive: !section.isActive,
      });
      onUpdate();
    } catch (error) {
      console.error("Failed to toggle section status");
    }
  };

  const remove = async () => {
    if (!confirm("Delete this section permanently?")) return;
    try {
      await api.delete(`/admin/homepage/${section.id}`);
      onUpdate();
    } catch (error) {
      console.error("Failed to delete section");
    }
  };

  return (
    <div className="group bg-white border border-gray-100 p-6 rounded-sm shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center">
      <div className="flex items-center gap-6">
        {/* DRAG INDICATOR VIBE */}
        <div className="text-gray-200 group-hover:text-brandRed transition-colors">
          <FiMove size={18} />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="font-black text-xs md:text-sm uppercase tracking-[0.2em] text-brandBlack">
              {section.type.replace("_", " ")}
            </h3>
            <span
              className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                section.isActive
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : "bg-gray-50 text-gray-400 border-gray-100"
              }`}
            >
              {section.isActive ? "Live" : "Draft"}
            </span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            Index Position: <span className="text-brandBlack font-black">{section.position}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
        {/* TOGGLE VISIBILITY */}
        <button
          onClick={toggle}
          className={`p-2 rounded-full transition-all ${
            section.isActive 
              ? "hover:bg-gray-100 text-gray-500" 
              : "hover:bg-emerald-50 text-emerald-500"
          }`}
          title={section.isActive ? "Hide from Site" : "Make Public"}
        >
          {section.isActive ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>

        {/* EDIT */}
        <Link
          href={`/homepage/edit/${section.id}`}
          className="p-2 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded-full transition-all"
          title="Edit Configuration"
        >
          <FiEdit3 size={18} />
        </Link>

        {/* DELETE */}
        <button
          onClick={remove}
          className="p-2 hover:bg-rose-50 text-gray-300 hover:text-rose-600 rounded-full transition-all"
          title="Remove Section"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
}