// app/admin/messages/MessageCardSelectable.tsx
"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import MessageDate from "./MessageDate"; // ✅ استيراد مكون التاريخ
import type { Message } from "./BulkDeleteWrapper";

type MessageCardSelectableProps = {
  message: Message;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
};

export default function MessageCardSelectable({
  message,
  selected,
  onSelect,
}: MessageCardSelectableProps) {
  return (
    <Card className={`transition border ${selected ? "border-blue-500 shadow-md" : "border-gray-200"}`}>
      <CardHeader className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selected}
            onCheckedChange={(val) => onSelect(message._id, Boolean(val))}
            aria-label={`Select message from ${message.username}`}
          />
          <span className="font-medium">{message.username}</span>
        </div>

        <Badge variant="outline">
          <MessageDate date={message.createdAt} /> {/* ✅ التاريخ بصيغة en-US */}
        </Badge>
      </CardHeader>

      <CardContent>
        <p className="text-gray-800 whitespace-pre-line leading-relaxed">{message.content}</p>
      </CardContent>
    </Card>
  );
}
