"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import { FiUploadCloud, FiCheck, FiPlay, FiImage, FiLoader } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

type Media = {
  id: number;
  url: string;
  type: "IMAGE" | "VIDEO";
};

export default function MediaPicker({
  value = [],
  onChange,
  multiple = true,
  accept,
}: {
  value: number[];
  onChange: (ids: number[]) => void;
  multiple?: boolean;
  accept?: string[];
}) {
  const [media, setMedia] = useState<Media[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing media
  useEffect(() => {
    api.get("/admin/media").then((res) => setMedia(res.data));
  }, []);

  const toggle = (id: number) => {
    if (value.includes(id)) {
      onChange(value.filter((x) => x !== id));
    } else {
      onChange(multiple ? [...value, id] : [id]);
    }
  };

  const upload = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await api.post("/admin/media", form);
      const newMedia = {
        ...res.data,
        url: res.data.url // Assuming backend returns relative path
      };
      setMedia((prev) => [newMedia, ...prev]);
      onChange(multiple ? [...value, newMedia.id] : [newMedia.id]);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 bg-zinc-950/80 p-6 border border-white/10 rounded-sm shadow-2xl text-white">
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
          <FiImage className="text-brandRed" /> Media Library
        </h4>
        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
          {multiple ? "Multiple Selection Active" : "Single Selection Only"}
        </p>
      </div>

      {/* CUSTOM UPLOAD ZONE */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`
          group border-2 border-dashed rounded-sm py-10 flex flex-col items-center justify-center cursor-pointer transition-all
          ${uploading ? "bg-white/5 border-white/10" : "bg-brandRed/5 border-brandRed/20 hover:border-brandRed hover:bg-white/5"}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept?.join(",") || "image/*,video/*"}
          disabled={uploading}
          onChange={(e) => e.target.files && upload(e.target.files[0])}
          className="hidden"
        />
        
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <FiLoader className="text-brandRed animate-spin" size={24} />
            <p className="text-[10px] font-black uppercase tracking-widest text-brandRed">Uploading your assets...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <FiUploadCloud className="text-brandRed group-hover:scale-110 transition-transform" size={28} />
            <p className="text-[10px] font-black uppercase tracking-widest text-white">Drop files here or click to browse</p>
            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter">Images or Videos for your homepage</p>
          </div>
        )}
      </div>

      {/* MEDIA GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence>
          {media.map((m) => {
            const isSelected = value.includes(m.id);
            return (
              <motion.div
                layout
                key={m.id}
                onClick={() => toggle(m.id)}
                className={`
                  group relative aspect-square rounded-sm cursor-pointer overflow-hidden transition-all duration-300 border-2
                  ${isSelected ? "border-brandRed" : "border-white/5 hover:border-white/20"}
                `}
              >
                {m.type === "IMAGE" ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${m.url}`}
                    className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}
                    alt="Library asset"
                  />
                ) : (
                  <div className="w-full h-full bg-black relative flex items-center justify-center">
                    <video 
                      src={`${process.env.NEXT_PUBLIC_API_URL}${m.url}`} 
                      className="w-full h-full object-cover opacity-60" 
                    />
                    <FiPlay className="absolute text-white" size={20} />
                  </div>
                )}

                {/* OVERLAY ON SELECTED */}
                {isSelected && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-brandRed/20 flex items-center justify-center backdrop-blur-[1px]"
                  >
                    <div className="bg-brandRed text-white p-1 rounded-full shadow-lg">
                      <FiCheck size={14} />
                    </div>
                  </motion.div>
                )}
                
                {/* TYPE TAG */}
                <div className="absolute bottom-1 left-1 bg-black/50 backdrop-blur-md text-[8px] text-white px-1.5 py-0.5 rounded-sm font-black uppercase tracking-widest">
                  {m.type}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}