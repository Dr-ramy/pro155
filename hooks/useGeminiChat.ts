"use client";

import { useState } from "react";
import axios from "axios";

export type Message = {
  sender: "user" | "ai" | "system";
  text: string;
};

const convertMessagesToGeminiFormat = (messages: Message[]) =>
  messages
    .filter((m) => m.sender !== "system")
    .map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

export function useGeminiChat() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (conversation: Message[]): Promise<string | null> => {
    if (loading) return null; // ✅ يمنع double send

    setLoading(true);
    setError("");

    try {
      // (اختياري) قلّل الإرسال لآخر 10 رسائل لتقليل الاستهلاك
      const sliced = conversation.slice(-10);

      const contents = convertMessagesToGeminiFormat(sliced);

      const response = await axios.post("/api/gemini", { contents });

      return response.data?.text ?? null;
    }  catch (err: unknown) {
  console.error("❌ useGeminiChat error");

  if (axios.isAxiosError(err)) {
    console.error("Status:", err.response?.status);
    console.error("Response data:", err.response?.data);
    console.error("Message:", err.message);
  } else if (err instanceof Error) {
    console.error("Error message:", err.message);
  } else {
    console.error("Unknown error:", err);
  }

  setError("⚠️ تم تجاوز حد الطلبات. انتظر قليلًا ثم جرّب مرة أخرى.");
  return null;
}
 finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
}
