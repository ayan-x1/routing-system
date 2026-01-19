import Link from "next/link";
import "./globals.css";


export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="theme-card p-8 w-full max-w-md shadow-lg border border-white/10">
        
        <h1 className="text-3xl font-bold text-center mb-2 theme-primary">
          Task Manager
        </h1>

        <p className="text-center text-sm opacity-80 mb-6">
          Mini project with middleware protected routes.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/signup"
            className="theme-btn py-2 rounded-lg text-center font-semibold transition"
          >
            Signup
          </Link>

          <Link
            href="/login"
            className="theme-btn py-2 rounded-lg text-center font-semibold transition"
          >
            Login
          </Link>

          <Link
            href="/show-all-tasks"
            className="border border-sky-400 text-sky-400 py-2 rounded-lg text-center font-semibold hover:bg-sky-400 hover:text-black transition"
          >
            Show Tasks
          </Link>

          <Link
            href="/add-task"
            className="border border-green-400 text-green-400 py-2 rounded-lg text-center font-semibold hover:bg-green-400 hover:text-black transition"
          >
            Add Task
          </Link>
        </div>

      </div>
    </div>
  );
}
