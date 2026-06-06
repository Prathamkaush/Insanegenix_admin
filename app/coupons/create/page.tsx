"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { useRouter } from "next/navigation";
import { FiTag, FiCalendar, FiTarget, FiArrowLeft, FiInfo } from "react-icons/fi";
import { motion } from "framer-motion";

export default function CreateCouponPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    code: "",
    type: "PERCENT",
    value: "",
    minOrderValue: "",
    maxDiscount: "",
    usageLimit: "",
    expiresAt: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/admin/coupons", {
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : undefined,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        expiresAt: form.expiresAt || undefined,
      });
      router.push("/coupons");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

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
              <FiArrowLeft size={14} /> Back to Coupons
            </button>
            <h1 className="admin-hero-title">
              New <span className="text-brandRed">Reward</span>
            </h1>
            <p className="admin-hero-subtitle">Configure a new promotional offer.</p>
          </div>
          <div className="admin-dark-button pointer-events-none">
            <FiTag size={16} /> Coupon Builder
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* FORM SECTION */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
            <div className="admin-surface p-6 md:p-8 space-y-8">
              
              {/* CODE SECTION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-brandRed">
                   <FiTag size={14} />
                   <h2 className="text-[11px] font-black uppercase tracking-widest">Identify</h2>
                </div>
                <input
                  type="text"
                  placeholder="COUPON CODE (e.g. SLAY20)"
                  className="w-full border-b-2 border-gray-100 py-3 outline-none focus:border-brandRed transition-all font-mono font-bold text-lg uppercase placeholder:text-gray-200"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  required
                />
              </div>

              {/* VALUE CONFIG */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Discount Type</label>
                  <select
                    className="w-full bg-gray-50 border-none px-4 py-3 rounded-sm text-xs font-bold outline-none ring-1 ring-gray-100 focus:ring-brandRed"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {form.type === "PERCENT" ? "Percentage Off" : "Rupees Off"}
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full bg-gray-50 border-none px-4 py-3 rounded-sm text-xs font-bold outline-none ring-1 ring-gray-100 focus:ring-brandRed"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* LOGISTICS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-50">
                 <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-400">
                       <FiTarget size={14} />
                       <h2 className="text-[10px] font-black uppercase tracking-widest">Minimum Spend</h2>
                    </div>
                    <input
                      type="number"
                      placeholder="₹0"
                      className="w-full bg-gray-50 border-none px-4 py-3 rounded-sm text-xs font-bold outline-none ring-1 ring-gray-100"
                      value={form.minOrderValue}
                      onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
                    />
                 </div>

                 {form.type === "PERCENT" && (
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-gray-400">
                         <FiInfo size={14} />
                         <h2 className="text-[10px] font-black uppercase tracking-widest">Max Discount Cap</h2>
                      </div>
                      <input
                        type="number"
                        placeholder="₹ Unlimited"
                        className="w-full bg-gray-50 border-none px-4 py-3 rounded-sm text-xs font-bold outline-none ring-1 ring-gray-100"
                        value={form.maxDiscount}
                        onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                      />
                   </div>
                 )}
              </div>

              {/* LIMITS & EXPIRY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Usage Limit</label>
                    <input
                      type="number"
                      placeholder="∞"
                      className="w-full bg-gray-50 border-none px-4 py-3 rounded-sm text-xs font-bold outline-none ring-1 ring-gray-100"
                      value={form.usageLimit}
                      onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                    />
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-400">
                       <FiCalendar size={14} />
                       <h2 className="text-[10px] font-black uppercase tracking-widest">Expiration Date</h2>
                    </div>
                    <input
                      type="date"
                      className="w-full bg-gray-50 border-none px-4 py-3 rounded-sm text-xs font-bold outline-none ring-1 ring-gray-100"
                      value={form.expiresAt}
                      onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    />
                 </div>
              </div>

              {error && (
                <p className="text-red-500 text-[10px] font-black uppercase bg-red-50 p-4 border border-red-100 text-center tracking-widest">
                  {error}
                </p>
              )}

              <button
                disabled={loading}
                className="w-full rounded-md bg-brandRed py-5 text-[12px] font-black uppercase tracking-[0.4em] text-white transition-all hover:bg-brandBlack active:scale-95 disabled:bg-gray-200"
              >
                {loading ? "Publishing Offer..." : "Publish Coupon"}
              </button>
            </div>
          </form>

          {/* LIVE PREVIEW SECTION */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-md border-2 border-dashed border-gray-200 bg-gray-50 p-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 text-center underline underline-offset-4">
                Live Preview
              </h3>

              <div className="flex justify-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative w-full max-w-[320px] overflow-hidden rounded-md border-2 border-dashed border-brandRed/30 bg-white p-8 shadow-xl"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-4xl font-black text-brandBlack leading-none">
                        {form.value ? (form.type === "PERCENT" ? `${form.value}%` : `₹${form.value}`) : "00"}
                      </p>
                      <p className="text-[11px] font-black text-brandRed uppercase tracking-widest mt-2 italic">Exclusive Reward</p>
                    </div>
                    <FiTag className="text-brandRed/10 text-6xl absolute -right-2 -top-2 rotate-12" />
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed uppercase tracking-tighter">
                      Valid on orders above ₹{form.minOrderValue || "0"}. 
                      {form.maxDiscount && ` Capped at ₹${form.maxDiscount}.`}
                    </p>

                    <div className="bg-gray-50 p-4 border-2 border-brandRed/5 rounded-sm flex justify-center">
                      <span className="font-mono font-black text-brandBlack tracking-[0.15em] text-lg uppercase">
                        {form.code || "YOUR-CODE"}
                      </span>
                    </div>
                    
                    <p className="text-[9px] text-center text-gray-300 font-bold uppercase tracking-widest">
                       {form.expiresAt ? `Ends on: ${form.expiresAt}` : "No expiry set"}
                    </p>
                  </div>
                </motion.div>
              </div>
              
              <div className="mt-10 text-center space-y-2">
                 <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Voucher Layout</p>
                 <p className="text-[10px] text-gray-500 leading-relaxed italic">This is how your customers will see the offer in their "My Rewards" section.</p>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </AdminLayout>
  );
}
