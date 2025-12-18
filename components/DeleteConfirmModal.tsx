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
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* MODAL */}
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-fadeIn">
        <h2 className="text-xl font-bold text-red-600">Delete {itemName}</h2>

        <p className="mt-3 text-gray-700">
          This action is <b>permanent</b>.  
          To confirm, please type <b>"DELETE"</b> below:
        </p>

        {/* Input */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Type "DELETE" to confirm'
          className="mt-4 w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-400"
        />

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            disabled={text !== "DELETE"}
            onClick={() => {
              onConfirm();
              setText("");
            }}
            className={`px-5 py-2 rounded-lg text-white transition ${
              text === "DELETE"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-300 cursor-not-allowed"
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
