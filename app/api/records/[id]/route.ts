import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Record from "@/models/Record";

// GET request
export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  await dbConnect();
  const rec = await Record.findById(id).lean();
  if (!rec) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(rec);
}

// PUT request
export async function PUT(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  await dbConnect();
  const data = await request.json();
  const updated = await Record.findByIdAndUpdate(id, data, { new: true });
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// DELETE request
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  await dbConnect();
  await Record.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}
