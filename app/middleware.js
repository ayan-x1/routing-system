import { NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/show-all-tasks", "/add-task"];
const AUTH_ROUTES = ["/login", "/signup"];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isAuth = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuth && token) {
    return NextResponse.redirect(new URL("/show-all-tasks", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/show-all-tasks/:path*",
    "/add-task/:path*",
    "/login",
    "/signup",
  ],
};
