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
    <div>
      <h1>Login</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 10, maxWidth: 320 }}
      >
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit">Login</button>
      </form>

      {err && <p style={{ color: "red" }}>{err}</p>}
    </div>
  );
}
