"use client";

import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  Download,
  KeyRound,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";

type ProductOption = {
  id: number;
  title: string;
};

type AuthenticityCode = {
  id: number;
  serialNumber: string;
  batchNumber: string;
  status: "ACTIVE" | "BLOCKED" | "RECALLED";
  verificationCount: number;
  firstVerifiedAt?: string | null;
  createdAt: string;
  product: ProductOption;
};

type GeneratedCode = {
  serialNumber: string;
  code: string;
  batchNumber: string;
};

function messageFrom(error: unknown, fallback: string) {
  const response = (error as AxiosError<{ message?: string }>).response;
  return response?.data?.message || fallback;
}

function dateLabel(value?: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function AuthenticityAdminPage() {
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [codes, setCodes] = useState<AuthenticityCode[]>([]);
  const [generated, setGenerated] = useState<GeneratedCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState({
    productId: "",
    batchNumber: "",
    quantity: "10",
    manufacturedAt: "",
    expiresAt: "",
  });

  const loadCodes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/authenticity/admin/codes", {
        params: {
          search: search || undefined,
          status: statusFilter || undefined,
        },
      });
      setCodes(response.data.codes || []);
    } catch (requestError) {
      setError(messageFrom(requestError, "Unable to load authenticity codes"));
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    api
      .get("/products", { params: { limit: 500 } })
      .then((response) => setProducts(response.data.products || []))
      .catch((requestError) =>
        setError(messageFrom(requestError, "Unable to load products")),
      );
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadCodes, 250);
    return () => clearTimeout(timer);
  }, [loadCodes]);

  const generateCodes = async () => {
    try {
      setGenerating(true);
      setError("");
      setGenerated([]);
      const response = await api.post("/authenticity/admin/generate", {
        productId: Number(form.productId),
        batchNumber: form.batchNumber,
        quantity: Number(form.quantity),
        manufacturedAt: form.manufacturedAt || undefined,
        expiresAt: form.expiresAt || undefined,
      });
      setGenerated(response.data.generated || []);
      await loadCodes();
    } catch (requestError) {
      setError(messageFrom(requestError, "Unable to generate codes"));
    } finally {
      setGenerating(false);
    }
  };

  const updateStatus = async (
    id: number,
    status: AuthenticityCode["status"],
  ) => {
    try {
      setError("");
      await api.patch(`/authenticity/admin/codes/${id}/status`, { status });
      setCodes((current) =>
        current.map((code) => (code.id === id ? { ...code, status } : code)),
      );
    } catch (requestError) {
      setError(messageFrom(requestError, "Unable to update code status"));
    }
  };

  const downloadCsv = () => {
    if (!generated.length) return;
    const selectedProduct = products.find(
      (product) => product.id === Number(form.productId),
    );
    const rows = [
      ["product", "batch", "serial_number", "scratch_code"],
      ...generated.map((item) => [
        selectedProduct?.title || "",
        item.batchNumber,
        item.serialNumber,
        item.code,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `authenticity-${form.batchNumber || "codes"}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const canGenerate =
    Boolean(form.productId && form.batchNumber.trim()) &&
    Number(form.quantity) >= 1 &&
    Number(form.quantity) <= 500;

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-hero">
          <div>
            <h1 className="admin-hero-title">
              Product <span className="text-brandRed">Authenticity</span>
            </h1>
            <p className="admin-hero-subtitle">
              Generate secure scratch codes and monitor verification activity.
            </p>
          </div>
          <div className="admin-dark-button pointer-events-none">
            <ShieldCheck size={16} /> {codes.length} Units
          </div>
        </div>

        {error ? (
          <div className="rounded-md border border-brandRed/30 bg-brandRed/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <section className="admin-surface p-6 xl:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <KeyRound className="text-brandRed" size={20} />
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-white">
                  Generate unit codes
                </h2>
                <p className="text-xs text-zinc-500">
                  Maximum 500 codes per generation.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="admin-label mb-2 block">Product</label>
                <select
                  className="admin-field"
                  value={form.productId}
                  onChange={(event) =>
                    setForm({ ...form, productId: event.target.value })
                  }
                >
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="admin-label mb-2 block">Batch number</label>
                <input
                  className="admin-field"
                  value={form.batchNumber}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      batchNumber: event.target.value.toUpperCase(),
                    })
                  }
                  placeholder="Example: WHEY-0626"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="admin-label mb-2 block">Manufactured</label>
                  <input
                    type="date"
                    className="admin-field"
                    value={form.manufacturedAt}
                    onChange={(event) =>
                      setForm({ ...form, manufacturedAt: event.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="admin-label mb-2 block">Expiry</label>
                  <input
                    type="date"
                    className="admin-field"
                    value={form.expiresAt}
                    onChange={(event) =>
                      setForm({ ...form, expiresAt: event.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="admin-label mb-2 block">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  className="admin-field"
                  value={form.quantity}
                  onChange={(event) =>
                    setForm({ ...form, quantity: event.target.value })
                  }
                />
              </div>

              <button
                type="button"
                onClick={generateCodes}
                disabled={!canGenerate || generating}
                className="admin-red-button w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                <KeyRound size={15} />
                {generating ? "Generating..." : "Generate secure codes"}
              </button>
            </div>
          </section>

          <section className="admin-surface p-6 xl:col-span-3">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-white">
                  One-time code export
                </h2>
                <p className="text-xs text-zinc-500">
                  Plaintext codes appear only immediately after generation.
                </p>
              </div>
              <button
                type="button"
                onClick={downloadCsv}
                disabled={!generated.length}
                className="admin-dark-button disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download size={15} /> Download CSV
              </button>
            </div>

            {generated.length ? (
              <div className="max-h-[390px] overflow-auto rounded-md border border-white/10">
                {generated.map((item) => (
                  <div
                    key={item.serialNumber}
                    className="grid grid-cols-1 gap-2 border-b border-white/5 p-3 last:border-0 sm:grid-cols-2"
                  >
                    <span className="text-xs text-zinc-500">
                      {item.serialNumber}
                    </span>
                    <strong className="font-mono text-sm tracking-widest text-white sm:text-right">
                      {item.code}
                    </strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[260px] flex-col items-center justify-center rounded-md border border-dashed border-white/10 text-center">
                <ShieldAlert size={30} className="mb-3 text-zinc-700" />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Generated codes will appear here once
                </p>
              </div>
            )}
          </section>
        </div>

        <section className="admin-table">
          <div className="flex flex-col gap-3 border-b border-white/10 p-4 md:flex-row">
            <div className="flex flex-1 items-center overflow-hidden rounded-md border border-white/10 bg-white/5 transition focus-within:border-brandRed focus-within:ring-2 focus-within:ring-brandRed/20">
              <span className="flex w-12 shrink-0 items-center justify-center text-zinc-500">
                <Search size={16} />
              </span>
              <input
                className="search-input min-w-0 flex-1 border-0 bg-transparent py-2.5 pr-3 pl-0 text-sm text-white outline-none placeholder:text-zinc-600"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search serial, batch, or product..."
              />
            </div>
            <select
              className="admin-field md:max-w-48"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="BLOCKED">Blocked</option>
              <option value="RECALLED">Recalled</option>
            </select>
            <button
              type="button"
              onClick={loadCodes}
              className="admin-dark-button"
              aria-label="Refresh codes"
            >
              <RefreshCw size={15} /> Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="admin-table-head">
                  <th className="admin-th text-left">Serial</th>
                  <th className="admin-th text-left">Product / Batch</th>
                  <th className="admin-th text-left">Checks</th>
                  <th className="admin-th text-left">First Verified</th>
                  <th className="admin-th text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  codes.map((code) => (
                    <tr key={code.id} className="admin-row">
                      <td className="p-4 font-mono text-xs text-white">
                        {code.serialNumber}
                      </td>
                      <td className="p-4">
                        <strong className="block text-sm text-white">
                          {code.product.title}
                        </strong>
                        <span className="text-xs text-zinc-500">
                          {code.batchNumber}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-black text-white">
                        {code.verificationCount}
                      </td>
                      <td className="p-4 text-xs text-zinc-400">
                        {dateLabel(code.firstVerifiedAt)}
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={code.status}
                          onChange={(event) =>
                            updateStatus(
                              code.id,
                              event.target.value as AuthenticityCode["status"],
                            )
                          }
                          className="rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="BLOCKED">Blocked</option>
                          <option value="RECALLED">Recalled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {loading ? (
            <div className="p-12 text-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Loading authenticity codes...
            </div>
          ) : null}
          {!loading && !codes.length ? (
            <div className="p-12 text-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
              No authenticity codes found.
            </div>
          ) : null}
        </section>
      </div>
    </AdminLayout>
  );
}
