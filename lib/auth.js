import crypto from "crypto";
import { db } from "./mongodb";

export function createToken() {
  return crypto.randomBytes(24).toString("hex");
}

export function getUserByToken(token) {
  if (!token) return null;
  return db.users.find((u) => u.token === token) || null;
}

export function requireUser(req) {
  const token = req.cookies.get("token")?.value;
  const user = getUserByToken(token);
  if (!user) return { user: null, token: null };
  return { user, token };
}
