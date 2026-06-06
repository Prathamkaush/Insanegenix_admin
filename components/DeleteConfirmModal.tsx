"use client";
import { useState } from "react";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemName = "product"
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}) {
  const [text, setText] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* MODAL */}
      <div className="relative bg-zinc-950/90 border border-white/10 rounded-xl shadow-2xl p-6 w-full max-w-md animate-fadeIn text-white">
        <h2 className="text-xl font-black uppercase tracking-tight text-brandRed">Delete {itemName}</h2>

        <p className="mt-3 text-sm text-zinc-400">
          This action is <b className="text-white">permanent</b>.  
          To confirm, please type <b className="text-white">"DELETE"</b> below:
        </p>

        {/* Input */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Type "DELETE" to confirm'
          className="mt-4 w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-brandRed focus:ring-2 focus:ring-brandRed/20"
        />

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-md border border-white/10 bg-white/10 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/20"
          >
            Cancel
          </button>

          <button
            disabled={text !== "DELETE"}
            onClick={() => {
              onConfirm();
              setText("");
            }}
            className={`px-5 py-2.5 rounded-md text-[11px] font-black uppercase tracking-widest text-white transition-all ${
              text === "DELETE"
                ? "bg-brandRed hover:bg-white hover:text-brandBlack"
                : "bg-brandRed/45 opacity-50 cursor-not-allowed"
            }`}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
