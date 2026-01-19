import { verifyJwt } from "@/lib/jwt";

export function getAuthUserFromRequest(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;

    const payload = verifyJwt(token);
    if (!payload?.sub) return null;

    return { id: payload.sub, email: payload.email };
  } catch (err) {
    console.error("AUTH_ERROR:", err);
    return null;
  }
}
