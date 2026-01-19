import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { signJwt } from "@/lib/jwt";

export async function POST(req) {
  try {
    const body = await req.json();
    let { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    email = email.trim().toLowerCase();

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const token = signJwt({ sub: user._id.toString(), email: user.email });

    const res = NextResponse.json({
      message: "Login success",
      user: { id: user._id.toString(), name: user.name, email: user.email }
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24
    });

    return res;
  } catch (error) {
    console.error("LOGIN_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
