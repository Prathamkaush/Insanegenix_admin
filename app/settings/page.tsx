"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import AdminLoader from "@/components/AdminLoader";
import { api } from "@/lib/api";
import { FiCheckCircle, FiPhoneCall, FiRefreshCw, FiSave, FiSettings } from "react-icons/fi";

type Notice = {
  type: "success" | "error";
  text: string;
} | null;

const safeText = (value: unknown) => (value == null ? "" : String(value));

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const [supportEmail, setSupportEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");
  const [address, setAddress] = useState("");
  const [maintenance, setMaintenance] = useState(false);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setNotice(null);

      const res = await api.get("/settings");
      const settings = res.data || {};

      setSupportEmail(safeText(settings.supportEmail));
      setSupportPhone(safeText(settings.supportPhone));
      setAddress(safeText(settings.address));
      setMaintenance(Boolean(settings.maintenanceMode));
    } catch (error) {
      console.error("Error loading settings:", error);
      setNotice({ type: "error", text: "Unable to load settings." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const saveSettings = async () => {
    try {
      setSaving(true);
      setNotice(null);

      const storeForm = new FormData();
      storeForm.append("supportEmail", supportEmail.trim());
      storeForm.append("supportPhone", supportPhone.trim());
      storeForm.append("address", address.trim());

      await api.patch("/settings/store", storeForm);
      await api.patch("/settings/general", {
        maintenanceMode: maintenance,
      });

      setNotice({ type: "success", text: "Settings saved and applied to the storefront." });
    } catch (error) {
      console.error("Error saving settings:", error);
      setNotice({ type: "error", text: "Unable to save settings." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-hero">
          <div>
            <h1 className="admin-hero-title">
              Storefront <span className="text-brandRed">Settings</span>
            </h1>
            <p className="admin-hero-subtitle">
              Only controls that are currently used on the customer website are shown here.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadSettings}
              disabled={loading || saving}
              className="admin-dark-button disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiRefreshCw size={14} /> Refresh
            </button>
            <button
              type="button"
              onClick={saveSettings}
              disabled={loading || saving}
              className="admin-red-button disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? <FiSettings size={14} /> : <FiSave size={14} />}
              {saving ? "Saving" : "Save"}
            </button>
          </div>
        </div>

        {notice && (
          <div
            className={`flex items-center gap-3 rounded-md border px-4 py-3 text-sm font-bold ${
              notice.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                : "border-brandRed/30 bg-brandRed/10 text-red-200"
            }`}
          >
            <FiCheckCircle size={16} />
            {notice.text}
          </div>
        )}

        {loading ? (
          <div className="rounded-md border border-white/10 bg-black/30 p-10">
            <AdminLoader />
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
            <section className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brandRed/10 text-brandRed">
                  <FiPhoneCall size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-brandBlack">
                    Customer Support
                  </h2>
                  <p className="text-xs font-semibold text-zinc-500">
                    Used in the customer footer, contact page, and maintenance screen.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="admin-field"
                  type="email"
                  placeholder="Support email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                />
                <input
                  className="admin-field"
                  placeholder="Support phone"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                />
                <textarea
                  className="admin-field min-h-28 resize-y md:col-span-2 text-black"
                  placeholder="Support address / map location"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </section>

            <section className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brandRed/10 text-brandRed">
                  <FiSettings size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-brandBlack">
                    Store Status
                  </h2>
                  <p className="text-xs font-semibold text-zinc-500">Controls customer website access.</p>
                </div>
              </div>

              <label className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 px-4 py-3 text-sm font-bold text-brandBlack">
                <span>Maintenance mode</span>
                <input
                  type="checkbox"
                  checked={maintenance}
                  onChange={(e) => setMaintenance(e.target.checked)}
                  className="h-5 w-5 accent-brandRed"
                />
              </label>

              <p className="mt-4 text-xs font-semibold leading-5 text-zinc-500">
                When enabled, customers see a maintenance screen with the support email and phone above.
              </p>
            </section>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
