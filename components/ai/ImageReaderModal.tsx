"use client";

import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ImageReaderModalProps = {
  trigger: React.ReactNode;
  title?: string;
  defaultPrompt?: string;
};

// ✅ Helper آمن لاستخراج رسالة الخطأ (بدون any)
function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return "Network error";
}

export default function ImageReaderModal({
  trigger,
  title = "قراءة محتوى الصورة",
  defaultPrompt = "اقرأ محتوى الصورة واستخرج النص إن وجد، ثم لخصه.",
}: ImageReaderModalProps) {
  const [open, setOpen] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const previewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  const reset = () => {
    setFile(null);
    setPrompt(defaultPrompt);
    setLoading(false);
    setResult("");
    setError("");
  };

  const handleSend = async () => {
    if (!file || loading) return;

    setLoading(true);
    setError("");
    setResult("");

    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("prompt", prompt);

      const r = await fetch("/api/gemini-vision", {
        method: "POST",
        body: fd,
      });

      const data: unknown = await r.json().catch(() => ({}));

      if (!r.ok) {
        let msg = "Unknown error";

        if (
          typeof data === "object" &&
          data !== null &&
          "geminiError" in data
        ) {
          const d = data as {
            geminiError?: { error?: { message?: string } };
            error?: string;
          };

          msg =
            d.geminiError?.error?.message ??
            d.error ??
            "Unknown error";
        }

        setError(`Gemini error (${r.status}): ${msg}`);
        return;
      }

      if (
        typeof data === "object" &&
        data !== null &&
        "text" in data &&
        typeof (data as { text?: unknown }).text === "string"
      ) {
        setResult((data as { text: string }).text);
      } else {
        setResult("لا يوجد رد.");
      }
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset(); // ✅ عند الإغلاق نظّف الحالة
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className="w-[90vw] max-w-2xl h-[85vh] flex flex-col"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="text-right">{title}</DialogTitle>
        </DialogHeader>

        {/* رفع + معاينة */}
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="text-sm font-medium">ارفع صورة:</div>
            <Input
              type="file"
              accept="image/*"
              disabled={loading}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          {file && (
            <div className="border rounded-md p-2 bg-muted">
              <div className="text-sm mb-2">معاينة:</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="preview"
                className="max-h-64 rounded-md"
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="text-sm font-medium">التعليمات (Prompt):</div>
            <Input
              value={prompt}
              disabled={loading}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>
        </div>

        {/* النتائج */}
        <div className="flex-1 border p-4 rounded-lg text-right bg-muted overflow-y-auto mt-3">
          {!result && !error && !loading && (
            <p className="text-gray-500">ارفع صورة واضغط “اقرأ”.</p>
          )}

          {loading && <p className="text-gray-500">جاري القراءة...</p>}
          {error && (
            <p className="text-red-600 whitespace-pre-wrap">{error}</p>
          )}
          {result && <div className="whitespace-pre-wrap">{result}</div>}
        </div>

        {/* الأزرار */}
        <div className="flex mt-4 space-x-2 rtl:space-x-reverse">
          <Button onClick={handleSend} disabled={!file || loading}>
            {loading ? "جاري..." : "اقرأ محتوى الصورة"}
          </Button>

          <Button
            variant="secondary"
            onClick={reset}
            disabled={loading}
            type="button"
          >
            مسح
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
