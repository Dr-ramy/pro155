// app/api/admin/messages/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Chat from "@/models/Chat";  // استيراد موديل Chat بدل ContactMessage

export async function GET() {
  await dbConnect();
  const messages = await Chat.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(messages);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await dbConnect();

  const deletedMessage = await Chat.findByIdAndDelete(id);

  if (!deletedMessage) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Deleted" });
}
