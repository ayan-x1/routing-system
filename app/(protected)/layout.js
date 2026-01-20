import "../globals.css";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }) {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") || "";

  const hasToken = cookieHeader
    .split(";")
    .some((c) => c.trim().startsWith("token="));

  if (!hasToken) {
    redirect("/login");
  }

  return children;
}
