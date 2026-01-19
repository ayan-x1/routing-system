import { NextResponse } from "next/server";

const protectedRoutes = ["/add-task", "/show-all-tasks"];
const authRoutes = ["/login", "/signup"];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const isProtected = protectedRoutes.some((p) => pathname.startsWith(p));
  const isAuth = authRoutes.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuth && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/show-all-tasks";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/add-task/:path*", "/show-all-tasks/:path*", "/login", "/signup"],
};
