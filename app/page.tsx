"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (token) {
      window.location.replace("/dashboard");
    } else {
      window.location.replace("/login");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex items-center gap-3">
        <span className="h-4 w-4 rounded-full bg-gray-300 animate-pulse" />
        <p className="text-gray-700 text-base font-medium">
          Redirecting to admin panel…
        </p>
      </div>
    </div>
  );
}