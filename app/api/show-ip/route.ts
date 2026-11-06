import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0] || "IP غير معروف";

  console.log("🔍 عنوان IP:", ip);

  return NextResponse.json({ ip });
}
