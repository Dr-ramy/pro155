"use client";

import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGeminiChat, Message } from "@/hooks/useGeminiChat";

type GeminiChatModalProps = {
  trigger: React.ReactNode;
};

export default function GeminiChatModal2({ trigger }: GeminiChatModalProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // ✅ اعتمد على loading/error من الـ hook (بدل state محلي)
  const { sendMessage, loading, error } = useGeminiChat();

  const base = useMemo(
    () =>
      "أنت مساعد ذكي. أجب باختصار وبدقة عن الأسئلة المتعلقة أنواع التر بة فقط. افترض أن المستخدم طالب، وشرح له بشكل واضح ومبسط",
    []
  );

  const handleSend = async () => {
    if (loading) return; // ✅ يمنع double send

    const trimmed = input.trim();
    if (!trimmed) return;

    // ✅ أضف رسالة المستخدم للواجهة فورًا
    const newUserMessage: Message = { sender: "user", text: trimmed };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");

    // ✅ النظام (التعليمات) لا نعرضه للمستخدم، لكن نرسله للـ API
    const systemMessage: Message = { sender: "system", text: base };

    // ✅ أرسل آخر 10 رسائل + system لتقليل الاستهلاك
    const conversationForApi = [
      systemMessage,
      ...[...messages, newUserMessage].slice(-10),
    ];

    const reply = await sendMessage(conversationForApi);

    const aiMessage: Message = {
      sender: "ai",
      text: reply ?? "❌ تعذر الحصول على رد من المساعد.",
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        // (اختياري) لما تقفل المودال: امسح أي إدخال قيد الكتابة
        if (!v) setInput("");
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className="w-[90vw] max-w-2xl h-[85vh] flex flex-col"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="text-right">التربة وعوامل تكوينها</DialogTitle>
        </DialogHeader>

        {/* النص الثابت */}
        <div className="text-right text-gray-700 space-y-2 leading-relaxed mb-4 border rounded-md p-3 bg-muted max-h-40 overflow-y-auto">
<p>عوامل تكوين التربة.</p>
<p>دور المواد الصخرية الأصلية في تكوين التربة.</p>
<p>دور المناخ في تكوين التربة.</p>
<p>دور التضاريس ومستوى الانحدار في تكوين التربة.</p>
<p>العلاقة بين التضاريس والانحدار والتربة.</p>
<p>دور الكائنات الحية النباتية والحيوانية في تكوين التربة.</p>
<p>دور الزمن في تكوين التربة.</p>
<p>دور الإنسان في تكوين التربة.</p>
<p>أهم عنصر في تكوين التربة.</p>
<p>التعرف على مفهوم التجوية.</p>
        </div>

        {/* المحادثة */}
        <div className="flex-1 border p-4 rounded-lg space-y-2 text-right bg-muted h-64 overflow-y-auto">
          {messages.length > 0 ? (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-md max-w-[80%] whitespace-pre-line ${
                  msg.sender === "user"
                    ? "ml-auto bg-blue-100 text-blue-800"
                    : "mr-auto bg-gray-100 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            ))
          ) : (
            !loading && <p className="text-gray-500">لا توجد محادثات حالياً.</p>
          )}

          {loading && <p className="text-gray-500">جاري التحميل...</p>}
          {error && <p className="text-red-500">{error}</p>}
        </div>

        {/* الإدخال */}
        <div className="flex mt-4 space-x-2 rtl:space-x-reverse">
          <Input
            className="flex-1"
            placeholder="اكتب سؤالك هنا..."
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // ✅ يمنع تكرار/سلوك الفورم
                if (!loading) handleSend();
              }
            }}
          />

          <Button onClick={handleSend} disabled={loading || !input.trim()}>
            {loading ? "جاري..." : "إرسال"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
