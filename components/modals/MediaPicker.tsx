"use client";

import { useState, useRef } from "react";
import { api } from "@/lib/api";
import { FiUploadCloud, FiCheck, FiImage, FiLoader } from "react-icons/fi";

export default function MediaPicker({
  value = [],
  onChange,
  multiple = true,
  accept,
  guidance,
}: {
  value: number[];
  onChange: (ids: number[]) => void;
  multiple?: boolean;
  accept?: string[];
  guidance?: {
    label: string;
    ratio: string;
    size: string;
    previewClassName?: string;
  };
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await api.post("/admin/media", form);
      onChange(multiple ? [...value, res.data.id] : [res.data.id]);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-5 bg-zinc-950/80 p-6 border border-white/10 rounded-sm shadow-2xl text-white">
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
          <FiImage className="text-brandRed" /> Upload Media
        </h4>
        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
          {multiple ? "Multiple Selection Active" : "Single Selection Only"}
        </p>
      </div>

      {guidance ? (
        <div className="rounded-sm border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white">
              {guidance.label}
            </p>
            <p className="shrink-0 text-[9px] font-bold uppercase tracking-widest text-brandRed">
              {guidance.ratio}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`relative flex w-28 max-w-[40%] shrink-0 items-center justify-center overflow-hidden rounded-sm border border-brandRed/50 bg-brandRed/10 ${guidance.previewClassName || "aspect-video"}`}
            >
              <div className="absolute inset-2 border border-dashed border-white/30" />
              <FiImage className="text-brandRed" size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                Recommended size
              </p>
              <p className="mt-1 text-sm font-black text-white">{guidance.size}</p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                Export at this ratio to avoid fixing the image again.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`
          group border-2 border-dashed rounded-sm px-4 py-10 flex flex-col items-center justify-center cursor-pointer transition-all
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

      {value.length ? (
        <div className="flex items-center gap-2 rounded-sm border border-brandRed/20 bg-brandRed/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white">
          <FiCheck className="text-brandRed" />
          Selected media ID{value.length > 1 ? "s" : ""}: {value.join(", ")}
        </div>
      ) : null}
    </div>
  );
}
