"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ButtonItem } from "@/components/content/mainitems/types";
import {
  FaVideo,
  FaLightbulb,
  FaCog,
  FaClipboardCheck,
  FaRobot,
  FaComments,
} from "react-icons/fa";

type Props = {
  title: string;
  items: ButtonItem[];
  currentVideo?: ButtonItem;
  visitedIds?: Set<string>;
  onSelect: (item: ButtonItem) => void;
};

export default function LessonDropdown({
  title,
  items,
  currentVideo,
  visitedIds,
  onSelect,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const renderIcon = (type?: string) => {
    switch (type) {
      case "intro":
        return <FaLightbulb className="text-lg ml-2 text-yellow-500" />;
      case "video":
        return <FaVideo className="text-lg ml-2 text-blue-600" />;
      case "activity":
        return <FaCog className="text-lg ml-2 text-green-600" />;
      case "comment":
        return <FaComments className="text-lg ml-2 text-red-300" />;
      case "robot":
        return <FaRobot className="text-lg ml-2 text-gray-600" />;
      case "quiz":
        return <FaClipboardCheck className="text-lg ml-2 text-purple-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="mb-2">
      <Button
        variant="outline"
        className="w-full justify-between text-right px-4 py-2 rounded-xl"
        onClick={() => setExpanded(!expanded)}
      >
        {title}
        <span className="ml-2">{expanded ? "▲" : "▼"}</span>
      </Button>

      {expanded && (
        <div className="mt-2 space-y-2">
          {items.map((btn) => {
            const isActive = currentVideo?.id === btn.id;
            const isVisited = visitedIds?.has(btn.id);

            return (
              <Button
                key={btn.id} // ✅ بدل idx
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-right px-4 py-2 rounded-md",
                  isActive && "bg-primary text-white hover:bg-primary/90",
                  !isActive &&
                    isVisited &&
                    "text-muted-foreground opacity-80 hover:bg-muted",
                  !isActive && !isVisited && "hover:bg-muted"
                )}
                onClick={() => onSelect(btn)}
              >
                {renderIcon(btn.icon)}
                <span className="text-sm truncate">{btn.text}</span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
