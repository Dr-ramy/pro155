import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Chat from "@/models/Chat";

export async function GET(request: Request) {
  await dbConnect();

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const messages = await Chat.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return NextResponse.json(messages.reverse());
}

export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json();

  const { username, content } = body;

  if (!username || !content) {
    return NextResponse.json({ error: "الاسم والمحتوى مطلوبان" }, { status: 400 });
  }

  const newMessage = new Chat({ username, content });
  await newMessage.save();

  return NextResponse.json(newMessage, { status: 201 });
}
