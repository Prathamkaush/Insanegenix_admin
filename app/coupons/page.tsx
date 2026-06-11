"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import { FiEdit3, FiPlus, FiTag, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/coupons");
      setCoupons(res.data);
    } catch (error) {
      console.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleToggle = async (id: number) => {
    setTogglingId(id);
    try {
      await api.put(`/admin/coupons/${id}/toggle`);
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
      );
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-hero">
          <div>
            <h1 className="admin-hero-title">
              Promotional <span className="text-brandRed">Coupons</span>
            </h1>
            <p className="admin-hero-subtitle">
              Manage checkout codes, usage limits, and active offers.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="admin-dark-button pointer-events-none">
              <FiTag size={16} /> Coupons
            </div>
            <Link href="/coupons/create" className="admin-red-button w-full sm:w-auto">
              <FiPlus size={14} /> Create Coupon
            </Link>
          </div>
        </div>

        <div className="admin-table">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="admin-table-head">
                  <th className="admin-th text-left">Code</th>
                  <th className="admin-th text-left">Value</th>
                  <th className="admin-th text-left">Usage</th>
                  <th className="admin-th text-center">Status</th>
                  <th className="admin-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-300 italic text-xs uppercase tracking-widest">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  coupons.map((c) => (
                    <tr key={c.id} className="admin-row group">
                      <td className="p-4">
                        <span className="font-mono font-bold text-white  px-2 py-1 rounded-md text-xs uppercase tracking-tight">
                          {c.code}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-white">
                            {c.type === "PERCENT" ? `${c.value}%` : `Rs. ${c.value}`}
                          </span>
                          <span className="text-[9px] text-gray-400 font-bold uppercase">{c.type}</span>
                        </div>
                      </td>
                      <td className="p-4 text-[11px] font-medium text-gray-400 uppercase tracking-tight">
                        {c.usedCount} <span className="text-gray-200">/</span> {c.usageLimit ?? "Unlimited"}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <AnimatedToggle
                            isActive={c.isActive}
                            onClick={() => handleToggle(c.id)}
                            isLoading={togglingId === c.id}
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/coupons/${c.id}/edit`}
                            className="p-2 rounded-md text-brandRed hover:bg-brandRed hover:text-white transition-all"
                          >
                            <FiEdit3 size={16} />
                          </Link>
                          <button
                            onClick={async () => {
                              if (!confirm("Delete permanently?")) return;
                              await api.delete(`/admin/coupons/${c.id}`);
                              loadCoupons();
                            }}
                            className="p-2 rounded-md text-zinc-500 hover:bg-brandBlack hover:text-white transition-all"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-gray-100">
            {loading ? (
              <div className="p-10 text-center text-gray-300 italic text-xs uppercase tracking-widest">Loading...</div>
            ) : (
              coupons.map((c) => (
                <div key={c.id} className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-bold text-brandBlack bg-zinc-100 px-2 py-1 rounded-md text-sm uppercase tracking-tight">
                      {c.code}
                    </span>
                    <AnimatedToggle
                      isActive={c.isActive}
                      onClick={() => handleToggle(c.id)}
                      isLoading={togglingId === c.id}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="admin-label">Value</p>
                      <p className="text-sm font-black text-white">{c.type === "PERCENT" ? `${c.value}%` : `Rs. ${c.value}`}</p>
                    </div>
                    <div>
                      <p className="admin-label">Usage</p>
                      <p className="text-sm font-black text-white">{c.usedCount} / {c.usageLimit ?? "Unlimited"}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link href={`/coupons/${c.id}/edit`} className="flex-1 text-center py-2 bg-red-50 text-brandRed text-[10px] font-black uppercase tracking-widest rounded-md border border-red-100">
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm("Delete?")) api.delete(`/admin/coupons/${c.id}`).then(loadCoupons);
                      }}
                      className="flex-1 py-2 bg-zinc-100 text-zinc-700 text-[10px] font-black uppercase tracking-widest rounded-md border border-zinc-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function AnimatedToggle({
  isActive,
  onClick,
  isLoading,
}: {
  isActive: boolean;
  onClick: () => void;
  isLoading: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`relative w-10 h-5 rounded-full transition-colors duration-300 flex items-center p-1 ${
        isActive ? "bg-emerald-500" : "bg-gray-200"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <motion.div
        animate={{ x: isActive ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-3 h-3 bg-white rounded-full shadow-sm"
      />
    </button>
  );
}
