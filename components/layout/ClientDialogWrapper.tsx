"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";

export default function ClientDialogWrapper() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("⚠️ لا يمكن إرسال رسالة فارغة");
      return;
    }

    if (message.length > 500) {
      toast.error("⚠️ الرسالة طويلة جدًا (الحد الأقصى 500 حرف)");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (res.ok) {
        toast.success("✅ تم إرسال الرسالة بنجاح");
        setMessage("");
      } else {
        toast.error("حدث خطأ أثناء الإرسال");
      }
 } catch (error) {
  console.error("خطأ أثناء إرسال الرسالة:", error);
  toast.error("تعذر الاتصال بالخادم");
}
 finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
       <Button  className="bg-transparent  hover:bg-white flex items-center gap-1 text-sm" > <FaEnvelope className="text-3xl text-blue-600" />
 </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>رسالة إلى المشرف</DialogTitle>
        </DialogHeader>

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          className="min-h-25"
          maxLength={500}
        />

        <DialogFooter>
          <Button onClick={handleSend} disabled={!message.trim() || loading}>
            {loading ? (
              "جاري الإرسال..."
            ) : (
              <>
                <FaPaperPlane className="mr-2" />
                إرسال
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
