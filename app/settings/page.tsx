"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";



export default function SettingsPage() {
  const [tab, setTab] = useState("profile");

  // PROFILE STATES
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // PASSWORD
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // STORE SETTINGS
  const [storeName, setStoreName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");
  const [address, setAddress] = useState("");
  const [logo, setLogo] = useState<File | null>(null);

  // GENERAL SETTINGS
  const [currency, setCurrency] = useState("INR");
  const [maintenance, setMaintenance] = useState(false);

  // Prevent undefined → controlled switch
  const safe = (v: any) => v ?? "";   // 👈 converts null/undefined → ""

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

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-brandPink mb-6">Settings</h1>

      {/* TABS */}
      <div className="flex gap-4 mb-6 border-b pb-2">
        {["profile", "store", "general"].map((t) => (
          <button
            key={t}
            className={`px-4 py-2 rounded ${
              tab === t ? "bg-brandPink text-white" : "bg-brandCream/50"
            }`}
            onClick={() => setTab(t)}
          >
            {t === "profile"
              ? "Profile Settings"
              : t === "store"
              ? "Store Settings"
              : "General Settings"}
          </button>
        ))}
      </div>

      {/* PROFILE TAB */}
      {tab === "profile" && (
        <div className="bg-white shadow p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-semibold">Admin Profile</h2>

          <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="Admin Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            className="border p-2 rounded w-full"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="bg-brandPink text-white px-5 py-2 rounded"
            onClick={saveProfile}
          >
            Save Profile
          </button>

          <hr />

          <h2 className="text-xl font-semibold">Change Password</h2>

          <input
            type="password"
            className="border p-2 rounded w-full"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <input
            type="password"
            className="border p-2 rounded w-full"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            className="bg-brandPink text-white px-5 py-2 rounded"
            onClick={changePassword}
          >
            Update Password
          </button>
        </div>
      )}

      {/* STORE SETTINGS TAB */}
      {tab === "store" && (
        <div className="bg-white shadow p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-semibold">Store Settings</h2>

          <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="Store Name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />

          <input
            type="email"
            className="border p-2 rounded w-full"
            placeholder="Support Email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
          />

          <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="Support Phone"
            value={supportPhone}
            onChange={(e) => setSupportPhone(e.target.value)}
          />

          <textarea
            className="border p-2 rounded w-full"
            placeholder="Store Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <input
            type="file"
            onChange={(e) => setLogo(e.target.files?.[0] || null)}
            className="border p-2 rounded w-full"
          />

          <button
            className="bg-brandPink text-white px-5 py-2 rounded"
            onClick={saveStoreSettings}
          >
            Save Store Settings
          </button>
        </div>
      )}

      {/* GENERAL TAB */}
      {tab === "general" && (
        <div className="bg-white shadow p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-semibold">General Settings</h2>

          <select
            className="border p-2 rounded w-64"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>

          <label className="flex items-center gap-3 mt-3">
            <input
              type="checkbox"
              checked={maintenance}
              onChange={(e) => setMaintenance(e.target.checked)}
            />
            Enable Maintenance Mode
          </label>

          <button
            className="bg-brandPink text-white px-5 py-2 rounded"
            onClick={saveGeneralSettings}
          >
            Save General Settings
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
