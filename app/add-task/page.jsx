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
      setMsg(data.message || "Failed");
      return;
    }

    setTitle("");
    router.push("/show-all-tasks");
  }

  return (
    <div>
      <h1>Add Task</h1>

      <form
        onSubmit={addTask}
        style={{ display: "flex", gap: 10, maxWidth: 520 }}
      >
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit">Add</button>
      </form>

      {msg && <p>{msg}</p>}
    </div>
  );
}
