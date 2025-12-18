"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (token) {
      // Already logged in
      window.location.href = "/dashboard";
    } else {
      // Go to login
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-brandCream">
      <p className="text-brandPink text-xl font-semibold">
        Redirecting...
      </p>
    </div>
  );
}
