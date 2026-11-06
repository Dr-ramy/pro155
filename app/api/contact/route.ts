import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ContactMessage from "@/models/ContactMessage";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // ✅ جلب الجلسة بالطريقة الصحيحة (Auth.js v5)
    const session = await auth();

    if (!session || !session.user?.name) {
      return NextResponse.json(
        { error: "❌ غير مصرح لك بإرسال الرسائل" },
        { status: 401 }
      );
    }

    // قراءة البيانات
    const { message } = await req.json();

    // التحقق من صحة الرسالة
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "⚠️ الرسالة مطلوبة" },
        { status: 400 }
      );
    }

    if (message.length > 500) {
      return NextResponse.json(
        { error: "⚠️ الرسالة طويلة جدًا (الحد الأقصى 500 حرف)" },
        { status: 400 }
      );
    }

    // الاتصال بقاعدة البيانات
    await dbConnect();

    // حفظ الرسالة
    await ContactMessage.create({
      username: session.user.name,
      content: message.trim(),
    });

    return NextResponse.json({
      success: true,
      message: "✅ تم إرسال الرسالة بنجاح",
    });
  } catch (error) {
    console.error("❌ خطأ أثناء حفظ الرسالة:", error);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع أثناء إرسال الرسالة" },
      { status: 500 }
    );
  }
}
