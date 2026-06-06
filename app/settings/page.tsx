"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { FiSettings } from "react-icons/fi";

export default function SettingsPage() {
  const [tab, setTab] = useState("profile");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");
  const [address, setAddress] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [currency, setCurrency] = useState("INR");
  const [maintenance, setMaintenance] = useState(false);

  const safe = (v: any) => v ?? "";

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const res = await api.get("/settings");
    const s = res.data;

    setName(safe(s.name));
    setEmail(safe(s.email));
    setStoreName(safe(s.storeName));
    setSupportEmail(safe(s.supportEmail));
    setSupportPhone(safe(s.supportPhone));
    setAddress(safe(s.address));
    setCurrency(s.currency || "INR");
    setMaintenance(Boolean(s.maintenanceMode));
  };

  const saveProfile = async () => {
    await api.patch("/settings/profile", { name, email });
    alert("Profile updated");
  };

  const changePassword = async () => {
    await api.patch("/settings/password", { oldPassword, newPassword });
    alert("Password updated");
  };

  const saveStoreSettings = async () => {
    const form = new FormData();
    form.append("storeName", storeName);
    form.append("supportEmail", supportEmail);
    form.append("supportPhone", supportPhone);
    form.append("address", address);
    if (logo) form.append("logo", logo);

    await api.patch("/settings/store", form);
    alert("Store settings updated");
  };

  const saveGeneralSettings = async () => {
    await api.patch("/settings/general", {
      currency,
      maintenanceMode: maintenance,
    });

    alert("General settings updated");
  };

  const tabLabel = (t: string) =>
    t === "profile" ? "Profile Settings" : t === "store" ? "Store Settings" : "General Settings";

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-hero">
          <div>
          <h1 className="admin-hero-title">
            Admin <span className="text-brandRed">Settings</span>
          </h1>
          <p className="admin-hero-subtitle">
            Configure profile, store identity, and general storefront behavior.
          </p>
          </div>
          <div className="admin-dark-button pointer-events-none">
            <FiSettings size={16} /> Settings
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          {["profile", "store", "general"].map((t) => (
            <button
              key={t}
              className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition ${
                tab === t ? "bg-brandRed text-white" : "bg-white border border-zinc-200 text-brandBlack hover:bg-red-50 hover:text-brandRed"
              }`}
              onClick={() => setTab(t)}
            >
              {tabLabel(t)}
            </button>
          ))}
        </div>

        {tab === "profile" && (
          <section className="bg-white border border-zinc-200 p-6 md:p-8 rounded-md shadow-sm space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-brandBlack">Admin Profile</h2>

            <input className="admin-field" placeholder="Admin Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="admin-field" type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <button className="inline-flex items-center justify-center rounded-md bg-brandRed px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-brandBlack" onClick={saveProfile}>Save Profile</button>

            <div className="border-t border-zinc-100 pt-6 space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-brandBlack">Change Password</h2>
              <input className="admin-field" type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
              <input className="admin-field" type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <button className="inline-flex items-center justify-center rounded-md bg-brandBlack px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-brandRed" onClick={changePassword}>Update Password</button>
            </div>
          </section>
        )}

        {tab === "store" && (
          <section className="bg-white border border-zinc-200 p-6 md:p-8 rounded-md shadow-sm space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-brandBlack">Store Settings</h2>
            <input className="admin-field" placeholder="Store Name" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
            <input className="admin-field" type="email" placeholder="Support Email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
            <input className="admin-field" placeholder="Support Phone" value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} />
            <textarea className="admin-field min-h-28" placeholder="Store Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <input type="file" onChange={(e) => setLogo(e.target.files?.[0] || null)} className="admin-field" />
            <button className="inline-flex items-center justify-center rounded-md bg-brandRed px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-brandBlack" onClick={saveStoreSettings}>Save Store Settings</button>
          </section>
        )}

        {tab === "general" && (
          <section className="bg-white border border-zinc-200 p-6 md:p-8 rounded-md shadow-sm space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-brandBlack">General Settings</h2>
            <select className="admin-field max-w-xs" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="INR">INR (Rs.)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (Euro)</option>
            </select>

            <label className="flex items-center gap-3 text-sm font-bold text-brandBlack">
              <input type="checkbox" checked={maintenance} onChange={(e) => setMaintenance(e.target.checked)} />
              Enable Maintenance Mode
            </label>

            <button className="inline-flex items-center justify-center rounded-md bg-brandRed px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-brandBlack" onClick={saveGeneralSettings}>Save General Settings</button>
          </section>
        )}
      </div>
    </AdminLayout>
  );
}
