"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const login = async () => {
  try {
    const res = await api.post("/auth/admin/login", { email, password });

    console.log("LOGIN RESPONSE:", res.data);

    // store JWT in localStorage
    localStorage.setItem("admin_token", res.data.token);

    // store JWT in cookie for middleware
    document.cookie = `admin_token=${res.data.token}; path=/;`;

    // redirect
    window.location.href = "/dashboard";

  } catch (err: any) {
    console.log("LOGIN ERROR:", err.response?.data || err);
    alert("Invalid credentials");
  }
};



  return (
    <div className="h-screen flex justify-center items-center bg-brandCream">
      <div className="bg-white p-6 w-96 shadow rounded-xl">
        <h1 className="text-2xl font-bold text-brandPink">Admin Login</h1>

        <input
          placeholder="Email"
          className="border p-2 w-full mt-4 rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          className="border p-2 w-full mt-4 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-brandPink text-white p-2 rounded mt-5 hover:bg-brandPinkLight"
          onClick={login}
        >
          Login
        </button>
      </div>
    </div>
  );
}
