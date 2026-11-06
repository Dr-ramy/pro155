"use client";

import { useState, useTransition } from "react";
import MessageCardSelectable from "./MessageCardSelectable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export type Message = {
  _id: string;
  username: string;
  content: string;
  createdAt: Date;
};

type BulkDeleteWrapperProps = {
  messages: Message[];
};

export default function BulkDeleteWrapper({ messages }: BulkDeleteWrapperProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const updated = new Set(prev);

      if (checked) {
        updated.add(id);
      } else {
        updated.delete(id);
      }

      return updated;
    });
  };

  const bulkDelete = async () => {
    try {
      const res = await fetch("/api/contact-admin/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (res.ok) {
        toast.success("تم حذف الرسائل المحددة.");
        location.reload();
      } else {
        toast.error("حدث خطأ أثناء الحذف.");
      }
    } catch (error) {
      console.error(error);
      toast.error("فشل الاتصال بالخادم.");
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`هل أنت متأكد من حذف ${selectedIds.size} رسالة؟`)) return;

    startTransition(() => {
      void bulkDelete();
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span>حدد الرسائل للحذف الجماعي:</span>
        <Button
          variant="destructive"
          onClick={handleBulkDelete}
          disabled={selectedIds.size === 0 || isPending}
        >
          {isPending ? "جاري الحذف..." : "حذف المحدد"}
        </Button>
      </div>

      {messages.map((msg) => (
        <MessageCardSelectable
          key={msg._id}
          message={msg}
          selected={selectedIds.has(msg._id)}
          onSelect={toggleSelect}
        />
      ))}
    </div>
  );
}
