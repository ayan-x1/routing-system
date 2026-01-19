"use client";


import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/show-all-tasks";

  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setErr(data.message || "Login failed");
      return;
    }

    router.push(returnUrl);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="theme-card p-8 w-full max-w-md shadow-lg border border-white/10">
        
        <h1 className="text-2xl font-bold text-center mb-6 theme-primary">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            className="bg-transparent border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-sky-400"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="bg-transparent border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-sky-400"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            className="theme-btn py-2 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </form>

        {err && (
          <p className="text-red-400 text-center mt-4 text-sm">{err}</p>
        )}
      </div>
    </div>
  );
}
