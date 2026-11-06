"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { siteContent } from "@/components/mainpage/site.content";
import { Button } from "@/components/ui/button";
import {
  Users,
  Info,
  Target,
  BookOpen,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  authors: Users,
  intro: Info,
  goals: Target,
  content: BookOpen,
};

type Block =
  | { type: "paragraph"; text: string }
  | { type: "subheading"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "numbered"; items: string[] }
  | { type: "divider" }
  | { type: "link"; label: string; href: string; external?: boolean }
  | {
      type: "callout";
      variant?: "info" | "warning" | "success";
      title?: string;
      text: string;
    };

type Card = (typeof siteContent.home.contentCards)[number];

function Callout({
  variant = "info",
  title,
  text,
}: {
  variant?: "info" | "warning" | "success";
  title?: string;
  text: string;
}) {
  const styles =
    variant === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : variant === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : "border-sky-200 bg-sky-50 text-sky-900";

  return (
    <div className={`rounded-xl border p-3 ${styles}`}>
      {title ? (
        <div className="text-xs sm:text-sm font-semibold mb-1">{title}</div>
      ) : null}
      <div className="text-xs sm:text-sm leading-relaxed warp-break-words">{text}</div>
    </div>
  );
}

function renderBlock(block: Block, key: string) {
  switch (block.type) {
    case "subheading":
      return (
        <h4
          key={key}
          className="text-xs sm:text-sm font-semibold text-slate-700 mt-3"
        >
          {block.text}
        </h4>
      );

    case "bullets":
      return (
        <ul
          key={key}
          className="list-disc pr-5 space-y-1 text-xs sm:text-sm text-slate-600"
        >
          {block.items.map((it, i) => (
            <li key={`${key}-${i}`} className="warp-break-words">
              {it}
            </li>
          ))}
        </ul>
      );

    case "numbered":
      return (
        <ol
          key={key}
          className="list-decimal pr-5 space-y-1 text-xs sm:text-sm text-slate-600"
        >
          {block.items.map((it, i) => (
            <li key={`${key}-${i}`} className="warp-break-words">
              {it}
            </li>
          ))}
        </ol>
      );

    case "divider":
      return <hr key={key} className="my-2 border-slate-200" />;

    case "link": {
      const content = (
        <span className="inline-flex items-center gap-1">
          <span>{block.label}</span>
          {block.external ? <ExternalLink className="h-3.5 w-3.5" /> : null}
        </span>
      );

      return block.external ? (
        <a
          key={key}
          href={block.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs sm:text-sm text-blue-700 underline underline-offset-4 warp-break-words"
        >
          {content}
        </a>
      ) : (
        <Link
          key={key}
          href={block.href}
          className="text-xs sm:text-sm text-blue-700 underline underline-offset-4 warp-break-words"
        >
          {content}
        </Link>
      );
    }

    case "callout":
      return (
        <div key={key}>
          <Callout
            variant={block.variant}
            title={block.title}
            text={block.text}
          />
        </div>
      );

    case "paragraph":
    default:
      return (
        <p
          key={key}
          className="warp-break-words text-xs sm:text-sm text-slate-600 leading-relaxed"
        >
          {block.text}
        </p>
      );
  }
}

function getBlocks(card: Card): Block[] {
  // ✅ في بياناتك الجديدة: blocks موجودة دائمًا
  // لكن هذا يحافظ على backward-compatibility لو كان عندك lines قديمة
  if ("blocks" in card && Array.isArray(card.blocks)) {
    return card.blocks as unknown as Block[];
  }

  if ("lines" in card && Array.isArray(card.lines)) {
    return card.lines.map((t) => ({ type: "paragraph", text: t }));
  }

  return [];
}

export default function ContentSection() {
  const c = siteContent.home;

  const initialState = useMemo(() => {
    const state: Record<string, boolean> = {};
    for (const card of c.contentCards) {
      if (card.collapsible) state[card.id] = false;
    }
    return state;
  }, [c.contentCards]);

  const [open, setOpen] = useState<Record<string, boolean>>(initialState);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="rtl">
      {c.contentCards.map((card) => {
        const { id, title, collapsible } = card;

        const isOpen = collapsible ? !!open[id] : true;

        const blocks = getBlocks(card);
        const visibleBlocks = collapsible && !isOpen ? blocks.slice(0, 4) : blocks;

        const Icon = ICON_MAP[id] ?? Info;

        return (
          <section key={id} id={id} className="rounded-2xl border p-4 bg-slate-50">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 rounded-xl bg-muted/60 p-3">
              <div className="flex items-start gap-2 min-w-0 flex-1">
                <Icon className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 warp-break-words leading-snug min-w-0">
                  {title}
                </h3>
              </div>

              {collapsible && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs shrink-0"
                  onClick={() => setOpen((prev) => ({ ...prev, [id]: !prev[id] }))}
                >
                  {isOpen ? c.labels.less : c.labels.more}
                </Button>
              )}
            </div>

            {/* Body */}
            <div className="mt-2 space-y-2">
              {visibleBlocks.map((b, idx) => renderBlock(b, `${id}-${idx}`))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
