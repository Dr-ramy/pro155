import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ContactMessage from "@/models/ContactMessage";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0 || !ids.every(id => typeof id === "string")) {
      return NextResponse.json(
        { error: "بيانات غير صالحة: يجب إرسال مصفوفة غير فارغة من معرفات نصية" },
        { status: 400 }
      );
    }

    const result = await ContactMessage.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("خطأ أثناء حذف الرسائل:", err);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم الداخلي" },
      { status: 500 }
    );
  }
}
