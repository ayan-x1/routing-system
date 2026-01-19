import mongoose from "mongoose";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { getAuthUserFromRequest } from "@/lib/requireAuth";

export async function GET(req) {
  try {
    const user = getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const tasks = await Task.find({
      userId: new mongoose.Types.ObjectId(user.id),
    }).sort({ createdAt: -1 });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("TASKS_GET_ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const user = getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title } = await req.json();
    if (!title || title.trim().length < 2) {
      return NextResponse.json({ message: "Title too short" }, { status: 400 });
    }

    await dbConnect();

    const task = await Task.create({
      userId: new mongoose.Types.ObjectId(user.id),
      title: title.trim(),
      done: false,
    });

    return NextResponse.json(
      { message: "Task added", task },
      { status: 201 }
    );
  } catch (error) {
    console.error("TASKS_POST_ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
