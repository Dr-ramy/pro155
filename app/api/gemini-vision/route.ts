import { NextResponse } from "next/server";

function toBase64(buffer: ArrayBuffer) {
  return Buffer.from(buffer).toString("base64");
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const prompt =
      (formData.get("prompt") as string | null) ??
      "اقرأ محتوى الصورة واشرحه باختصار.";

    if (!file) {
      return NextResponse.json({ error: "Missing image file" }, { status: 400 });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const model =
      process.env.GEMINI_VISION_MODEL ||
      process.env.GEMINI_MODEL ||
      "gemini-2.5-flash";

    const arrayBuffer = await file.arrayBuffer();
    const base64 = toBase64(arrayBuffer);
    const mimeType = file.type || "image/jpeg";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64,
              },
            },
          ],
        },
      ],
    };

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      return NextResponse.json(
        {
          error: "Gemini vision failed",
          status: r.status,
          geminiError: data,
          modelUsed: model,
        },
        { status: r.status }
      );
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;

    return NextResponse.json({ text, modelUsed: model });
  } catch (e: unknown) {
    let message = "Unknown error";

    if (e instanceof Error) {
      message = e.message;
    } else if (typeof e === "string") {
      message = e;
    }

    return NextResponse.json(
      { error: "Server error", message },
      { status: 500 }
    );
  }
}
