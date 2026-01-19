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
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>All Tasks</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/add-task">Add Task</Link>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {msg && <p style={{ color: "red" }}>{msg}</p>}
      {loading && <p>Loading...</p>}

      {!loading && tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul style={{ paddingLeft: 18 }}>
          {tasks.map((t) => (
            <li key={t._id} style={{ marginBottom: 10 }}>
              <span style={{ marginRight: 10 }}>
                {t.done ? "Done :" : "Pending :"} {t.title}
              </span>
              <button
                onClick={() => toggle(t._id)}
                style={{ marginRight: 8 }}
              >
                Toggle Status
              </button>
              <button onClick={() => remove(t._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
