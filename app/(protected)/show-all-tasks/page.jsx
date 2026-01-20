"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ShowTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadTasks() {
    setLoading(true);
    setMsg("");

    const res = await fetch("/api/tasks", {
      credentials: "include",
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      setMsg("API returned invalid response");
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setMsg(data.message || "Failed to load");
      setLoading(false);
      return;
    }

    setTasks(data.tasks || []);
    setLoading(false);
  }

  async function toggle(id) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json();
      setMsg(data.message || "Failed to update task");
      return;
    }

    await loadTasks();
  }

  async function remove(id) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json();
      setMsg(data.message || "Failed to delete task");
      return;
    }

    await loadTasks();
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/login";
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="min-h-screen p-6 flex justify-center">
      <div className="w-full max-w-3xl theme-card p-6 shadow-lg border border-white/10">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold theme-primary">All Tasks</h1>
          <div className="flex gap-3">
            <Link
              href="/add-task"
              className="border border-sky-400 text-sky-400 px-4 py-1.5 rounded-lg hover:bg-sky-400 hover:text-black transition"
            >
              Add Task
            </Link>
            <button
              onClick={logout}
              className="border border-red-400 text-red-400 px-4 py-1.5 rounded-lg hover:bg-red-400 hover:text-black transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Messages */}
        {msg && <p className="text-red-400 mb-4">{msg}</p>}
        {loading && <p className="opacity-80">Loading...</p>}

        {/* Task List */}
        {!loading && tasks.length === 0 ? (
          <p className="opacity-70 text-center">No tasks yet.</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((t) => (
              <li
                key={t._id}
                className="flex justify-between items-center border border-white/10 rounded-lg px-4 py-3"
              >
                <span
                  className={`${
                    t.done ? "line-through opacity-60" : ""
                  }`}
                >
                  {t.done ? "✅ Done:" : "⏳ Pending:"} {t.title}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggle(t._id)}
                    className="border border-yellow-400 text-yellow-400 px-3 py-1 rounded hover:bg-yellow-400 hover:text-black transition"
                  >
                    Toggle
                  </button>

                  <button
                    onClick={() => remove(t._id)}
                    className="border border-red-400 text-red-400 px-3 py-1 rounded hover:bg-red-400 hover:text-black transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
