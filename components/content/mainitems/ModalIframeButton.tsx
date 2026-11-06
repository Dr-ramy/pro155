// components/modals/VideoModalButton.tsx
"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

interface VideoModalButtonProps {
  iframeUrl: string;
  trigger: React.ReactNode; 
  title?: string;
}

const VideoModalButton: React.FC<VideoModalButtonProps> = ({ iframeUrl, trigger, title }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      {/* التعديلات هنا:
        1. max-w-[98vw] و h-[98vh]: لجعل المودال يأخذ الشاشة تقريباً بالكامل
        2. p-0: لإزالة أي مسافات بيضاء (padding) حول الـ iframe
        3. overflow-hidden: لمنع ظهور أشرطة تمرير غير مرغوب فيها
      */}
      <DialogContent className="max-w-[98vw] w-full h-[98vh] p-0 border-0 flex flex-col overflow-hidden bg-black/50">
        <DialogTitle className="sr-only">{title || "شاهد"}</DialogTitle>

        <iframe
          className="w-full h-full grow border-none outline-none"
          src={iframeUrl}
          title={title || "Embedded Content"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </DialogContent>
    </Dialog>
  );
};

export default VideoModalButton;