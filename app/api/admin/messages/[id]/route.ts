import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Chat from "@/models/Chat";

// ✅ لا تستقبل `params` كمعامل — استخرج ID من URL مباشرة
export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop(); // استخراج ID من المسار

  if (!id) {
    return NextResponse.json({ message: "Missing ID" }, { status: 400 });
  }

  try {
    await dbConnect();

    const deleted = await Chat.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Message deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
