"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import { FiArrowRight, FiInbox, FiMail, FiRefreshCw, FiSearch, FiUser } from "react-icons/fi";

export default function AdminContacts() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState("");

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/contact", {
        params: {
          page,
          limit: 15,
          status: status || undefined,
          search: search || undefined,
        },
      });
      setData(res.data.items);
      setPages(res.data.meta.pages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page, status]);

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-hero">
          <div>
            <h1 className="admin-hero-title">
              Inquiries <span className="text-brandRed">Studio</span>
            </h1>
            <p className="admin-hero-subtitle">
              Review incoming contact requests and customer messages.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                placeholder="Search name/email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-64 rounded-md border border-white/10 bg-white/10 pl-10 pr-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-white placeholder:text-zinc-500 outline-none transition focus:border-brandRed"
              />
            </div>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-white/10 bg-white/10 px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-white outline-none transition focus:border-brandRed cursor-pointer"
            >
              <option className="text-brandBlack" value="">All Status</option>
              <option className="text-brandBlack" value="NEW">New</option>
              <option className="text-brandBlack" value="IN_PROGRESS">In Review</option>
              <option className="text-brandBlack" value="RESOLVED">Resolved</option>
            </select>

            <button
              onClick={() => {
                setPage(1);
                fetchContacts();
              }}
              className="admin-red-button"
            >
              <FiRefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>

        <div className="admin-table">
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead>
              <tr className="admin-table-head">
                <th className="admin-th text-left">Identity</th>
                <th className="admin-th text-center">Status</th>
                <th className="admin-th text-right">Timestamp</th>
                <th className="admin-th text-right">Open</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 animate-pulse">
                    Loading inquiries...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <FiInbox className="mx-auto text-gray-200 mb-4" size={48} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">No inquiries stored</p>
                  </td>
                </tr>
              ) : (
                data.map((c) => (
                  <tr key={c.id} className="admin-row group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-md bg-brandBlack text-white flex items-center justify-center text-[10px] font-black group-hover:bg-brandRed transition-colors">
                          {c.name ? c.name.charAt(0).toUpperCase() : <FiUser />}
                        </div>
                        <div>
                          <p className="text-xs font-black text-white uppercase tracking-tight group-hover:text-brandRed transition-colors">
                            {c.name || "Anonymous Client"}
                          </p>
                          <div className="flex items-center gap-1.5 text-gray-400 mt-0.5">
                            <FiMail size={10} />
                            <span className="text-[10px] font-bold lowercase tracking-normal">{c.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      <span className={`inline-block text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-md border ${
                        c.status === "NEW" ? "bg-red-50 text-brandRed border-red-100" :
                          c.status === "IN_PROGRESS" ? "bg-amber-50 text-amber-600 border-amber-100" :
                            "bg-emerald-50 text-emerald-600 border-emerald-100"
                      }`}>
                        {c.status.replace("_", " ")}
                      </span>
                    </td>

                    <td className="p-5 text-right">
                      <p className="text-[10px] font-black text-white uppercase tracking-tight">
                        {new Date(c.createdAt).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                      <p className="text-[9px] text-gray-400 font-bold mt-0.5 uppercase">
                        {new Date(c.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </td>

                    <td className="p-5 text-right">
                      <Link href={`/contacts/${c.id}`} className="inline-flex p-2 rounded-md text-gray-300 group-hover:text-white group-hover:bg-brandRed transition-all">
                        <FiArrowRight size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-12 mb-8 gap-4 items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-md hover:border-brandRed hover:text-brandRed transition-all disabled:opacity-30"
          >
            ←
          </button>
          <div className="bg-white px-6 py-2 rounded-md border border-gray-100 shadow-sm font-bold text-brandBlack">
            Page {page} <span className="text-brandGray font-normal mx-1">of</span> {pages}
          </div>
          <button
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
            className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-md hover:border-brandRed hover:text-brandRed transition-all disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
