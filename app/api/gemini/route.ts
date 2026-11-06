import { NextResponse } from "next/server";

const DEFAULT_MODEL = "gemini-2.5-flash";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const contents = body?.contents;

    console.log("📨 Incoming contents length:", contents?.length);

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.error("❌ GEMINI_API_KEY is missing");
      return NextResponse.json(
        { error: "Missing API key" },
        { status: 500 }
      );
    }

    const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

    console.log("🤖 Gemini model:", model);

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("🚨 Gemini API ERROR");
      console.error("Status:", response.status);
      console.error("Response body:", JSON.stringify(data, null, 2));

      return NextResponse.json(
        {
          error: "Gemini request failed",
          status: response.status,
          geminiError: data,
          modelUsed: model,
        },
        { status: response.status }
      );
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;

    console.log("✅ Gemini response OK");

    return NextResponse.json({ text });
  } catch (err: unknown) {
    let message = "Unknown error";

    if (err instanceof Error) {
      message = err.message;
    } else if (typeof err === "string") {
      message = err;
    }

    console.error("🔥 Server crash:", message);

    return NextResponse.json(
      { error: "Server exception", message },
      { status: 500 }
    );
  }
}
