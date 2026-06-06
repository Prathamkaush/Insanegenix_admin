"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import MediaPicker from "@/components/modals/MediaPicker";
import { FiSearch, FiFilter, FiCheck, FiLayers } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

type StripItem = {
  subtypeId: number;
  mediaId?: number;
};

export default function CategoryStripFields({
  value,
  onChange,
}: {
  value: any;
  onChange: (v: any) => void;
}) {
  const [subtypes, setSubtypes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<number | "ALL">("ALL");

  const items: StripItem[] = value?.items || [];

  useEffect(() => {
    api.get("/product-subtypes/admin/all").then((res) => {
      setSubtypes(res.data);
    });
  }, []);

  const productTypes = useMemo(() => {
    const map = new Map<number, string>();
    subtypes.forEach((s) => {
      map.set(s.type.id, s.type.name);
    });
    return Array.from(map.entries());
  }, [subtypes]);

  const filteredSubtypes = subtypes.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "ALL" || s.type.id === typeFilter;
    return matchesSearch && matchesType;
  });

  const toggleSubtype = (subtypeId: number) => {
    const exists = items.find((i) => i.subtypeId === subtypeId);
    const next = exists
      ? items.filter((i) => i.subtypeId !== subtypeId)
      : [...items, { subtypeId }];
    onChange({ ...value, items: next });
  };

  const updateMedia = (subtypeId: number, mediaId: number) => {
    const next = items.map((i) =>
      i.subtypeId === subtypeId ? { ...i, mediaId } : i
    );
    onChange({ ...value, items: next });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-brandBlack flex items-center gap-2">
          <FiLayers className="text-brandRed" /> Strip Configuration
        </h3>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-sm">
          {items.length} Categories Selected
        </span>
      </div>

      {/* REFINED FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 bg-gray-50/50 p-4 rounded-sm border border-gray-100">
        <div className="relative flex-1 group">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brandRed transition-colors" />
          <input
            placeholder="SEARCH SUBTYPES..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border-none pl-10 pr-4 py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-widest outline-none ring-1 ring-gray-100 focus:ring-brandRed transition-all"
          />
        </div>

        <div className="relative group">
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brandRed transition-colors" />
          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value === "ALL" ? "ALL" : Number(e.target.value))
            }
            className="appearance-none bg-white border-none pl-10 pr-10 py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-widest outline-none ring-1 ring-gray-100 focus:ring-brandRed transition-all min-w-[160px]"
          >
            <option value="ALL">All Departments</option>
            {productTypes.map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* SUBTYPE SELECTION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredSubtypes.map((s) => {
            const item = items.find((i) => i.subtypeId === s.id);
            const selected = !!item;

            return (
              <motion.div
                layout
                key={s.id}
                className={`relative border rounded-sm p-5 transition-all duration-300 ${
                  selected 
                    ? "border-brandRed bg-brandRed/5 shadow-md shadow-brandRed/5" 
                    : "border-gray-100 bg-white hover:border-gray-300"
                }`}
              >
                <div 
                  onClick={() => toggleSubtype(s.id)}
                  className="flex items-center justify-between cursor-pointer mb-4"
                >
                  <div className="space-y-1">
                    <p className={`text-xs font-black uppercase tracking-widest ${selected ? 'text-brandRed' : 'text-brandBlack'}`}>
                      {s.name}
                    </p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter italic">
                      Dept: {s.type.name}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selected ? "border-brandRed bg-brandRed text-white" : "border-gray-200"
                  }`}>
                    {selected && <FiCheck size={12} strokeWidth={4} />}
                  </div>
                </div>

                {/* MEDIA PICKER INTEGRATION */}
                {selected && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-4 border-t border-brandRed/10"
                  >
                    <p className="text-[9px] font-black uppercase text-gray-400 mb-3 tracking-widest">Icon Display</p>
                    <MediaPicker
                      value={item?.mediaId ? [item.mediaId] : []}
                      onChange={(ids) => updateMedia(s.id, ids[0])}
                      multiple={false}
                    />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}