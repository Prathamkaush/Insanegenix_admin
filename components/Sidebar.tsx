"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Folder,
  Package,
  ShoppingCart,
  MessageSquare,
  Percent,
  Star,
  Settings,
  Menu,
  X,
  PenIcon,
  PersonStanding,
  SplinePointer,
  Phone,
  ShieldCheck,
  Dumbbell,
  FileText,
} from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const LinkItem = (href: string, label: string, Icon: React.ElementType) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-md text-[11px] font-black uppercase tracking-widest transition-all duration-300
        ${
          pathname === href
            ? "bg-brandRed text-white shadow-lg shadow-brandRed/20"
            : "text-zinc-400 hover:bg-white/10 hover:text-white"
        }
      `}
    >
      <Icon size={16} />
      <span>{label}</span>
    </Link>
  );

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-brandBlack border-b border-white/10 flex items-center px-4 z-40">
        <button onClick={() => setOpen(true)} className="p-2 text-white" aria-label="Open menu">
          <Menu size={24} />
        </button>
        <Image src="/insanegenix/logo/logo-white.png" alt="InsaneGenix" width={132} height={32} className="ml-2 h-8 w-auto object-contain" />
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-brandBlack text-white
          border-r border-white/10 flex flex-col z-50
          transform transition-transform duration-500 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* TOP: BRANDING */}
        <div className="p-6 border-b border-white/10 relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-4 md:hidden text-zinc-400"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>

          <Image src="/insanegenix/logo/logo-white.png" alt="InsaneGenix" width={178} height={42} className="h-11 w-auto object-contain" priority />
          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.28em] mt-3">Performance Commerce</p>
        </div>

        {/* MIDDLE: SCROLLABLE NAVIGATION */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          {LinkItem("/dashboard", "Dashboard", LayoutDashboard)}
          <div className="h-px bg-white/10 my-4 mx-2" />
          {LinkItem("/categories", "Categories", Folder)}
          {LinkItem("/products", "Supplements", Dumbbell)}
          {LinkItem("/authenticity", "Authenticity", ShieldCheck)}
          {LinkItem("/orders", "Orders", ShoppingCart)}
          {LinkItem("/blogs", "Blogs", FileText)}
          {LinkItem("/homepage", "Edit Home", PenIcon)}
          {LinkItem("/coupons", "Coupons", SplinePointer)}
          {LinkItem("/feedback", "Feedback", MessageSquare)}
          {LinkItem("/contacts", "Contacts", Phone)}
          {LinkItem("/users", "Users", PersonStanding)}
          {LinkItem("/discounts", "Discounts", Percent)}
          {LinkItem("/trending", "Trending", Star)}
          {LinkItem("/reviews", "Reviews", Star)}
          {LinkItem("/settings", "Settings", Settings)}
        </div>

        {/* BOTTOM: FIXED LOGOUT */}
        <div className="p-6 border-t border-white/10 bg-zinc-950">
          <div className="mb-4 flex items-center gap-3 rounded-md border border-white/10 bg-white/5 p-3">
            <ShieldCheck size={18} className="text-brandRed" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white">Admin Secure</p>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-500">InsaneGenix</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full px-6 py-3 rounded-md bg-white text-brandBlack text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brandRed hover:text-white transition-all active:scale-95"
          >
            Logout Session
          </button>
        </div>
      </aside>

      {/* LOGOUT CONFIRM MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950/90 border border-white/10 rounded-md shadow-2xl p-8 w-full max-w-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-2 text-white">
              Confirm Logout
            </h3>
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-tight mb-8">
              You will need to re-authenticate to access the admin portal.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  localStorage.clear();
                  router.push("/login");
                }}
                className="w-full py-4 bg-brandRed text-white text-[10px] font-black uppercase tracking-widest rounded transition-all hover:bg-white hover:text-brandBlack"
              >
                Logout Now
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
