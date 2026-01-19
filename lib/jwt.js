import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN || "1d";

if (!secret) {
  throw new Error("JWT_SECRET missing in .env file");
}

export function signJwt(payload) {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyJwt(token) {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}
