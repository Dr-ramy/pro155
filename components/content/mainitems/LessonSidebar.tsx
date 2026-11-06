"use client";

import { useMemo, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger,} from "@/components/ui/sheet";
import LessonDropdown from "../mainitems/LessonDropdown";
import CustomAccordion from "../mainitems/CustomAccordion";
import { Button } from "@/components/ui/button";

import type { ButtonItem, VideoItem } from "@/components/content/mainitems/types";
import type { SidebarExtraItem, SidebarContent } from "@/components/content/groups/LessonData";

import {
  FaChevronCircleLeft,
  FaCog,
  FaClipboardCheck,
  FaComments,
  FaRobot,
  FaVideo,
} from "react-icons/fa";

type Props = {
  currentVideo?: VideoItem;
  visitedIds?: Set<string>;
  onSelect: (item: ButtonItem) => void;
  onExtraSelect: (item: SidebarExtraItem) => void;
  groupId?: string | number;
  content: SidebarContent;
};

function iconFromKey(key: SidebarExtraItem["icon"]) {
  switch (key) {
    case "cog":
      return <FaCog className="text-gray-500" />;
    case "quiz":
      return <FaClipboardCheck className="text-gray-500" />;
    case "chat":
      return <FaComments className="text-gray-500" />;
    case "robot":
      return <FaRobot className="text-gray-500" />;
    case "video":
      return <FaVideo className="text-gray-500" />;
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }
}

export default function LessonSidebar({
  currentVideo,
  visitedIds,
  onSelect,
  onExtraSelect,
  groupId,
  content,
}: Props) {
  const [open, setOpen] = useState(false);
  const { units, beforeLearningItems, afterLearningItems } = content;

  const beforeAccordionItems = useMemo(
    () =>
      beforeLearningItems.map((x) => ({
        id: x.id,
        text: x.text,
        icon: iconFromKey(x.icon),
        onClick: () => onExtraSelect(x),
      })),
    [beforeLearningItems, onExtraSelect]
  );

  const afterAccordionItems = useMemo(
    () =>
      afterLearningItems.map((x) => ({
        id: x.id,
        text: x.text,
        icon: iconFromKey(x.icon),
        onClick: () => onExtraSelect(x),
      })),
    [afterLearningItems, onExtraSelect]
  );

  const unitAccordions = useMemo(
    () =>
      units.map((unit) => ({
        unitId: unit.id,
        title: unit.title,
        items: unit.lessons.map((lesson) => ({
          id: `${unit.id}:${lesson.id}`,
          customComponent: (
            <LessonDropdown
              title={lesson.title}
              items={lesson.items}
              currentVideo={currentVideo}
              visitedIds={visitedIds}
              onSelect={onSelect}
            />
          ),
        })),
      })),
    [units, currentVideo, visitedIds, onSelect]
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {/* ✅ زر واضح، ثابت، لا يغير أي Layout */}
        <Button aria-label="فتح قائمة المحتوى" className="   fixed right-1 top-1/2 -translate-y-1/2   h-full w-8   bg-transparent   hover:bg-gray-200   z-50 ">
          <FaChevronCircleLeft className="h-7 w-7 text-gray-700" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" dir="rtl" className="   h-dvh   w-full sm:w-96   max-w-[92dvw]   p-4 text-right   overflow-y-auto overflow-x-hidden   contain-layout">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-lg font-semibold">المحتوى</SheetTitle>
          <SheetDescription className="text-sm text-gray-500">
            {/* {groupId ? `Group: ${groupId}` : ""} */}
          </SheetDescription>
        </SheetHeader>

        <CustomAccordion
          title="قبل التعلم"
          icon={<FaCog className="text-lg" />}
          items={beforeAccordionItems}
        />

        <hr className="my-2 border-t border-gray-200" />

        <div className="space-y-2">
          {unitAccordions.map((u) => (
            <CustomAccordion
              key={u.unitId}
              title={u.title}
              icon={<FaCog className="text-lg" />}
              items={u.items}
            />
          ))}
        </div>

        <hr className="my-2 border-t border-gray-200" />

        <CustomAccordion
          title="بعد التعلم"
          icon={<FaCog className="text-lg" />}
          items={afterAccordionItems}
        />
      </SheetContent>
    </Sheet>
  );
}
