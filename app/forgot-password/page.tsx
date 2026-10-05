"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import axios from "axios";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "reset" | "done">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (step === "reset" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      if (step === "email") {
        const { data } = await api.post("/auth/forgot-password", { email: email.trim() });
        setMessage(data.message);
        setStep("reset");
      } else {
        await api.post("/auth/reset-password", { email: email.trim(), code: code.trim(), password });
        setPassword("");
        setConfirmPassword("");
        setCode("");
        setStep("done");
      }
    } catch (err) {
      const detail = axios.isAxiosError(err) ? err.response?.data?.message : null;
      setError(Array.isArray(detail) ? detail.join(" ") : typeof detail === "string" ? detail : "Unable to reset your password. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-brandBlack px-4 py-10 text-white">
      <section className="w-full max-w-md space-y-6 rounded-md border border-white/10 bg-zinc-950 p-8">
        <h1 className="text-2xl font-black uppercase">Reset admin password</h1>
        {step === "done" ? (
          <p role="status">Your password has been reset. Sign in with your new password.</p>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <p className="text-sm text-zinc-400">{step === "email" ? "Enter your account email to receive a reset code." : "Enter the 6-digit code from your email and choose a new password. The code expires in 10 minutes."}</p>
            {message && <p role="status" className="text-sm text-zinc-300">{message}</p>}
            {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
            <div>
              <label htmlFor="reset-email" className="admin-label mb-2 block">Email</label>
              <input id="reset-email" className="admin-field" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required readOnly={step === "reset"} disabled={busy} />
            </div>
            {step === "reset" && <>
              <div>
                <label htmlFor="reset-code" className="admin-label mb-2 block">Reset code</label>
                <input id="reset-code" className="admin-field" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(e) => setCode(e.target.value)} required disabled={busy} />
              </div>
              <div>
                <label htmlFor="new-password" className="admin-label mb-2 block">New password</label>
                <input id="new-password" className="admin-field" type="password" autoComplete="new-password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required disabled={busy} />
              </div>
              <div>
                <label htmlFor="confirm-password" className="admin-label mb-2 block">Confirm password</label>
                <input id="confirm-password" className="admin-field" type="password" autoComplete="new-password" minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={busy} />
              </div>
              <p className="text-xs text-zinc-400">Wait at least 60 seconds before requesting another code.</p>
              <button type="button" disabled={busy} className="text-sm text-zinc-400 hover:text-white" onClick={() => { setStep("email"); setCode(""); setPassword(""); setConfirmPassword(""); setMessage(""); setError(""); }}>Change email or request another code</button>
            </>}
            <button type="submit" disabled={busy} className="admin-red-button w-full disabled:opacity-50">{busy ? "Please wait..." : step === "email" ? "Send reset code" : "Reset password"}</button>
          </form>
        )}
        <Link href="/login" className="block text-sm text-zinc-300 hover:text-white">Back to admin login</Link>
      </section>
    </main>
  );
}
