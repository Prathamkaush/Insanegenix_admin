"use client";

import { useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/admin/login", { email, password });

      localStorage.setItem("admin_token", res.data.token);
      document.cookie = `admin_token=${res.data.token}; path=/;`;

      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-brandBlack px-4 py-8 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/insanegenix/backgrounds/admin-login-bg.png')" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_45%,rgba(229,9,20,0.22),transparent_32%),linear-gradient(90deg,rgba(0,0,0,0.92),rgba(0,0,0,0.72)_42%,rgba(0,0,0,0.9))]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <section className="w-full max-w-md rounded-md border border-white/10 bg-zinc-950/88 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-md md:p-8">
          <div className="mb-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="rounded-md border border-white/10 bg-white/5 px-4 py-3">
                <Image
                  src="/insanegenix/logo/logo-white.png"
                  alt="InsaneGenix"
                  width={178}
                  height={42}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-md border border-brandRed/30 bg-brandRed/15">
                <ShieldCheck className="text-brandRed" size={25} />
              </div>
            </div>

            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-brandRed">
              Admin Secure
            </p>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">
              Command <span className="text-brandRed">Access</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Manage supplements, stock, orders, content, and customer signals.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-md border border-brandRed/30 bg-brandRed/10 px-4 py-3 text-sm font-bold text-red-100">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="admin-label mb-2 block text-zinc-400">Email</label>
              <input
                type="email"
                placeholder="admin@insanegenix.com"
                className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-brandRed focus:ring-2 focus:ring-brandRed/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="admin-label mb-2 block text-zinc-400">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 pr-11 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-brandRed focus:ring-2 focus:ring-brandRed/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && login()}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              onClick={login}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-brandRed px-6 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-white transition hover:bg-white hover:text-brandBlack disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 text-[10px] font-black uppercase tracking-widest text-zinc-600">
            <span>Performance Commerce</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </section>
      </main>
    </div>
  );
}
