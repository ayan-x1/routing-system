import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Task Manager</h1>
      <p>Mini project with middleware protected routes.</p>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <Link href="/signup">Signup</Link>
        <Link href="/login">Login</Link>
        <Link href="/show-all-tasks">Show Tasks</Link>
        <Link href="/add-task">Add Task</Link>
      </div>
    </div>
  );
}
