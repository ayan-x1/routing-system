"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddTaskPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");

  async function addTask(e) {
    e.preventDefault();
    setMsg("");

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data.message || "Failed to add task");
      return;
    }

    setTitle("");
    router.push("/show-all-tasks");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="theme-card p-8 w-full max-w-md shadow-lg border border-white/10">

        <h1 className="text-2xl font-bold text-center mb-6 theme-primary">
          Add New Task
        </h1>

        <form onSubmit={addTask} className="flex gap-3">
          <input
            className="flex-1 bg-transparent border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-sky-400"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button
            type="submit"
            className="theme-btn px-5 rounded-lg font-semibold transition"
          >
            Add
          </button>
        </form>

        {msg && (
          <p className="text-center mt-4 text-sm text-red-400">
            {msg}
          </p>
        )}

      </div>
    </div>
  );
}
