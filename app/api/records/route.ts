import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Record from "@/models/Record";



// GET – جلب كل السجلات
export async function GET() {
  await dbConnect();
  const records = await Record.find({}).lean();
  return NextResponse.json(records, { status: 200 });
}

// POST – إنشاء سجل جديد
// Inside route.ts
type RecordPayload = {
  name: string;
  user: string;
  email: string;
  password: string;
  groupid: number;
};

export async function POST(request: Request) {
  await dbConnect();
  const data = (await request.json()) as RecordPayload;

  try {
    const newRec = new Record(data);
    await newRec.save();
    return NextResponse.json(newRec, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

