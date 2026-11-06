// ✅ MainVideo.tsx (VideoGallery) — احذف الـ useEffect بالكامل

"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

import LessonSidebar from "../mainitems/LessonSidebar";
import ModalContent, { type ModalId } from "./ModalContent";

import type { ButtonItem, VideoItem } from "@/components/content/mainitems/types";
import type {
  SidebarExtraAction,
  SidebarExtraItem,
  SidebarContent,
} from "../groups/LessonData";

type Props = {
  groupId?: string | number;
  content: SidebarContent & {
    videoMap: Record<string, string>;
    formLinks: Record<string, string>;
  };
};

function pickDefaultVideoId(videoMap: Record<string, string>) {
  return videoMap["1vid0"] ? "1vid0" : (Object.keys(videoMap)[0] ?? "1vid0");
}

export default function VideoGallery({ groupId, content }: Props) {
  const router = useRouter();
  const { videoMap, formLinks } = content;

  const defaultVideoId = useMemo(() => pickDefaultVideoId(videoMap), [videoMap]);

  const [currentVideo, setCurrentVideo] = useState<VideoItem>(() => ({
    type: "button",
    id: defaultVideoId,
    text: "الأهداف",
    title: "الأهداف",
    icon: "",
    src: videoMap[defaultVideoId] ?? "",
  }));

  const [visitedIds, setVisitedIds] = useState<Set<string>>(() => new Set());

  const aiTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const registerTrigger = useCallback((id: ModalId, el: HTMLButtonElement | null) => {
    aiTriggerRefs.current[id] = el;
  }, []);

  const markVisited = useCallback((id: string) => {
    setVisitedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const openUrl = useCallback((url: string, target?: "_self" | "_blank") => {
    const clean = url.trim();
    if (!clean) return;

    if (target === "_self") {
      window.location.href = clean;
      return;
    }

    window.open(clean, target ?? "_blank", "noopener,noreferrer");
  }, []);

  const openModalById = useCallback((modalId: string) => {
    aiTriggerRefs.current[modalId]?.click();
  }, []);

  const runExtraAction = useCallback(
    (action: SidebarExtraAction) => {
      switch (action.type) {
        case "openUrl":
          openUrl(action.url, action.target);
          return;
        case "openRoute":
          router.push(action.route);
          return;
        case "openModal":
          openModalById(action.modalId);
          return;
        default: {
          const _exhaustive: never = action;
          return _exhaustive;
        }
      }
    },
    [openModalById, openUrl, router]
  );

  const handleLessonClick = useCallback(
    (btn: ButtonItem) => {
      if (btn.type === "modal") {
        openModalById(btn.id);
        markVisited(btn.id);
        return;
      }

      const videoSrc = videoMap[btn.id];
      if (videoSrc) {
        setCurrentVideo({ ...btn, title: btn.text, src: videoSrc });
        markVisited(btn.id);
        return;
      }

      const formUrl = formLinks[btn.id];
      if (formUrl) {
        openUrl(formUrl, "_self");
        markVisited(btn.id);
      }
    },
    [formLinks, markVisited, openModalById, openUrl, videoMap]
  );

  const handleExtraSelect = useCallback(
    (item: SidebarExtraItem) => {
      runExtraAction(item.action);
      markVisited(item.id);
    },
    [markVisited, runExtraAction]
  );

  return (
    <div className="bg-white rtl text-right overflow-x-hidden">
      <div className="min-h-[calc(100dvh-120px)] mx-auto w-full max-w-6xl px-2 sm:px-4 md:px-6 flex flex-col gap-3 min-w-0 overflow-x-hidden">
        <h6 className="text-center font-bold text-sm sm:text-base md:text-lg leading-tight m-0 p-0">
          {currentVideo.title}
        </h6>

        <div className="flex-1 flex items-start justify-center min-w-0">
          <div className="w-full max-w-2xl md:max-w-3xl mx-auto rounded-2xl shadow-xl bg-white overflow-hidden min-w-0">
            <div className="w-full aspect-video">
              <video
                key={currentVideo.src}
                src={currentVideo.src}
                controls
                playsInline
                className="block w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <LessonSidebar
        currentVideo={currentVideo}
        visitedIds={visitedIds}
        onSelect={handleLessonClick}
        onExtraSelect={handleExtraSelect}
        groupId={groupId}
        content={content}
      />

      <ModalContent modals={content.modals} registerTrigger={registerTrigger} />
    </div>
  );
}
