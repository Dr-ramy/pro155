"use client";

import { useMemo, useState } from "react";
import { siteContent } from "@/components/mainpage/site.content";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ContentCard = (typeof siteContent.home.contentCards)[number];
type Block = ContentCard["blocks"][number];

export default function QuickLinksDialog() {
  const c = siteContent.home;

  const cardsById = useMemo(() => {
    const map = new Map<string, ContentCard>();
    for (const card of c.contentCards) map.set(card.id, card);
    return map;
  }, [c.contentCards]);

  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeCard = activeId ? cardsById.get(activeId) : undefined;

  const renderBlock = (b: Block, idx: number) => {
    if (b.type === "divider") {
      return <hr key={`div-${idx}`} className="my-3 border-muted" />;
    }

    if (b.type === "subheading") {
      return (
        <h3
          key={`sub-${idx}`}
          className="text-sm sm:text-base font-semibold pt-2"
        >
          {b.text}
        </h3>
      );
    }

    // paragraph
    return (
      <p key={`p-${idx}`} className="warp-npm run buildbreak-words whitespace-pre-line">
        {b.text}
      </p>
    );
  };

  return (
    <>
      {/* Links */}
      <nav className="w-full space-y-2" aria-label="أقسام الصفحة" dir="rtl">
        {c.sections.map((s) => (
          <Button
            key={s.id}
            variant="outline"
            className="w-full justify-start rounded-xl"
            onClick={() => {
              setActiveId(s.id);
              setOpen(true);
            }}
          >
            {s.label}
          </Button>
        ))}
      </nav>

      {/* Dialog */}
      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setActiveId(null);
        }}
      >
        <DialogContent
          dir="rtl"
          className="
            w-[calc(100vw-24px)]
            sm:max-w-lg
            max-h-[85vh]
            p-0
            overflow-hidden
          "
        >
          {/* Header ثابت */}
          <DialogHeader className="px-4 py-3 border-b">
            <DialogTitle className="text-base sm:text-lg">
              {activeCard?.title ?? ""}
            </DialogTitle>
          </DialogHeader>

          {/* Body قابل للتمرير */}
          <div className="px-4 py-4 overflow-y-auto max-h-[calc(85vh-56px)]">
            <div className="space-y-2 text-sm sm:text-base leading-relaxed">
              {(activeCard?.blocks ?? []).map(renderBlock)}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
