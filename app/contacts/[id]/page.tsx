"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { FiArrowLeft, FiMail, FiPhone, FiCalendar, FiTag, FiMessageSquare, FiUser, FiShoppingBag } from "react-icons/fi";

export default function ContactDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/contact/${id}`)
      .then((res) => setContact(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    try {
      await api.patch(`/contact/${id}/status`, { status });
      setContact((prev: any) => ({ ...prev, status }));
    } catch (err) {
      console.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-brandRed border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Opening Archive...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!contact) return <AdminLayout>Not found</AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-page max-w-5xl">
        
        {/* HEADER AREA */}
        <div className="admin-hero">
          <div>
            <button 
              onClick={() => router.back()} 
              className="mb-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition hover:text-white"
            >
              <FiArrowLeft size={14} /> Back to Inquiries
            </button>
            <h1 className="admin-hero-title">
              Inquiry <span className="text-brandRed">Details</span>
            </h1>
            <p className="admin-hero-subtitle">
              Reference: #{id?.toString().slice(-6).toUpperCase()}
            </p>
          </div>
          <div className="admin-dark-button pointer-events-none">
            <FiMessageSquare size={16} /> {contact.status.replace("_", " ")}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: MAIN MESSAGE & CONTEXT (8 COLUMNS) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* CORE MESSAGE */}
            <section className="admin-surface p-6 md:p-8">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-6">
                <FiMessageSquare className="text-brandRed" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Customer Narrative</h2>
              </div>
              <div className="min-h-[200px] rounded-md bg-gray-50 p-6">
                <p className="text-sm text-brandBlack font-medium leading-relaxed whitespace-pre-line">
                  {contact.message}
                </p>
              </div>
            </section>

            {/* RELATED ASSETS (Order/User Info) */}
            {(contact.user || contact.order) && (
              <section className="admin-surface p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {contact.user && (
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                      <FiUser /> Account Profile
                    </h3>
                    <div className="rounded-md border border-gray-100 bg-gray-50 p-4">
                      <p className="text-[11px] font-black text-brandBlack">ID: {contact.user.id}</p>
                      <p className="text-[10px] font-medium text-gray-500 mt-1">{contact.user.email}</p>
                    </div>
                  </div>
                )}
                {contact.order && (
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                      <FiShoppingBag /> Linked Order
                    </h3>
                    <div className="rounded-md border border-gray-100 bg-gray-50 p-4">
                      <p className="text-[11px] font-black text-brandBlack uppercase">Ref: {contact.order.id}</p>
                      <button className="text-[9px] font-black text-brandRed uppercase tracking-widest mt-2 hover:underline">
                        View Full Order Details →
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* RIGHT: METADATA & ACTIONS (4 COLUMNS) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* STATUS MANAGEMENT */}
            <section className="rounded-md bg-brandBlack p-8 text-white shadow-sm">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] border-b border-white/10 pb-4 mb-6">Workflow Status</h2>
              <div className="space-y-4">
                <select
                  value={contact.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-4 text-[10px] font-black uppercase tracking-widest outline-none transition-all focus:ring-1 ring-brandRed cursor-pointer"
                >
                  <option value="NEW" className="bg-brandBlack text-white">New Request</option>
                  <option value="IN_PROGRESS" className="bg-brandBlack text-white">Currently Reviewing</option>
                  <option value="RESOLVED" className="bg-brandBlack text-white">Issue Resolved</option>
                </select>
                
                <div className={`p-4 rounded-md text-center border ${
                  contact.status === "NEW" ? "border-blue-500/20 bg-blue-500/5 text-blue-400" :
                  contact.status === "IN_PROGRESS" ? "border-amber-500/20 bg-amber-500/5 text-amber-400" :
                  "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                }`}>
                  <p className="text-[9px] font-black uppercase tracking-[0.4em]">Current Vibe: {contact.status.replace("_", " ")}</p>
                </div>
              </div>
            </section>

            {/* SENDER INTEL */}
            <section className="admin-surface p-6 md:p-8 space-y-8">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white border-b border-gray-50 pb-4 mb-2">Intel</h2>
              
              <div className="space-y-6">
                <FieldIcon icon={<FiUser />} label="Client" value={contact.name || "Guest User"} />
                <FieldIcon icon={<FiMail />} label="Email" value={contact.email} isLowercase />
                <FieldIcon icon={<FiPhone />} label="Contact" value={contact.phone || "No Phone Provided"} />
                <FieldIcon icon={<FiTag />} label="Topic" value={contact.subject || contact.reason || "General Inquiry"} />
                <FieldIcon 
                  icon={<FiCalendar />} 
                  label="Logged At" 
                  value={new Date(contact.createdAt).toLocaleString(undefined, {
                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })} 
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ---------- UI HELPERS ---------- */

function FieldIcon({ icon, label, value, isLowercase = false }: { icon: any, label: string, value: string, isLowercase?: boolean }) {
  return (
    <div className="flex gap-4">
      <div className="text-gray-300 mt-1">{icon}</div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</p>
        <p className={`text-xs font-bold text-white mt-0.5 ${isLowercase ? 'lowercase' : 'uppercase tracking-tight'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
