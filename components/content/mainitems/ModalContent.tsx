"use client";

import type React from "react";

import GeminiChatModal1 from "@/components/ai/GeminiChatModal1";
import GeminiChatModal2 from "@/components/ai/GeminiChatModal2";
import GeminiChatModal3 from "@/components/ai/GeminiChatModal3";
//import GeminiChatModal4 from "@/components/ai/GeminiChatModal4";
import ImageReaderModal from "@/components/ai/ImageReaderModal";

import VideoModalButton from "@/components/content/mainitems/ModalIframeButton";
import type { SidebarContent } from "@/components/content/groups/LessonData";
import type { ModalKey } from "@/components/content/groups/PrePost";

export type ModalSpec = SidebarContent["modals"][number];
export type ModalId = ModalSpec["id"];

type Props = {
  modals: SidebarContent["modals"];
  registerTrigger: (id: ModalId, el: HTMLButtonElement | null) => void;
};

const GEMINI_COMPONENTS: Record<
  ModalKey,
  React.ComponentType<{ trigger: React.ReactNode }>
> = {
  "gemini-1": GeminiChatModal1,
  "gemini-2": GeminiChatModal2,
  "gemini-3": GeminiChatModal3,
  "gemini-4": ImageReaderModal,
};

export default function ModalContent({ modals, registerTrigger }: Props) {
  return (
    <>
      {modals.map((m) => {
        if (m.kind === "gemini") {
          const GeminiComp = GEMINI_COMPONENTS[m.key];
          return (
            <GeminiComp
              key={m.id}
              trigger={
                <button
                  ref={(el) => registerTrigger(m.id, el)}
                  className="hidden"
                  type="button"
                >
                  open
                </button>
              }
            />
          );
        }

        if (m.kind === "iframe") {
          return (
            <VideoModalButton
              key={m.id}
              iframeUrl={m.iframeUrl}
              title={m.title}
              trigger={
                <button
                  ref={(el) => registerTrigger(m.id, el)}
                  className="hidden"
                  type="button"
                >
                  open
                </button>
              }
            />
          );
        }

        // TypeScript strict exhaustive
        const _exhaustive: never = m;
        return _exhaustive;
      })}
    </>
  );
}
