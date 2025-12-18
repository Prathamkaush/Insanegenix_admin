"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const LinkItem = (href: string, label: string) => (
    <Link
      href={href}
      onClick={() => setOpen(false)} // close on mobile
      className={`block px-6 py-3 rounded-lg font-medium transition ${
        pathname === href
          ? "bg-brandPink text-white"
          : "text-brandBlack hover:bg-brandPinkLight hover:text-white"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white shadow flex items-center px-4 z-40">
        <button onClick={() => setOpen(true)}>
          <Menu size={24} />
        </button>

        <h1 className="ml-4 font-bold text-brandPink">
          Admin Panel
        </h1>
      </div>

      {/* OVERLAY (mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white shadow-lg
          flex flex-col justify-between z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* TOP */}
        <div className="p-6 pt-16 md:pt-6">
          {/* Close button (mobile) */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 md:hidden"
          >
            <X size={22} />
          </button>

          <h1 className="hidden md:block text-2xl font-bold mb-10 text-brandPink">
            Admin Panel
          </h1>

          <nav className="space-y-2">
            {LinkItem("/dashboard", "Dashboard")}
            {LinkItem("/categories", "Categories")}
            {LinkItem("/products", "Products")}
            {LinkItem("/orders", "Orders")}
            {LinkItem("/feedback", "Feedback")}
            {LinkItem("/discounts", "Discounts")}
            {LinkItem("/reviews", "Reviews")}
            {LinkItem("/settings", "Settings")}
          </nav>
        </div>

        {/* LOGOUT */}
        <div className="p-6">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full px-6 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* LOGOUT CONFIRM MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-2">
              Confirm Logout
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  localStorage.clear();
                  router.push("/login");
                }}
                className="px-5 py-2 bg-red-500 text-white rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
