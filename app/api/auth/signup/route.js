import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { signJwt } from "@/lib/jwt";

export async function POST(req) {
  try {
    const body = await req.json();
    let { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    name = name.trim();
    email = email.trim().toLowerCase();

    if (name.length < 2) {
      return NextResponse.json({ message: "Name must be at least 2 characters" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
    }

    await dbConnect();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ message: "Email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash
    });

    const token = signJwt({ sub: user._id.toString(), email: user.email });

    const res = NextResponse.json({
      message: "Signup success",
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
    console.error("SIGNUP_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
