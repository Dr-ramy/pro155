import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type AccordionItem = {
  id: string;
  text?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  customComponent?: React.ReactNode;
};

type Props = {
  title: string;
  icon?: React.ReactNode;
  items: AccordionItem[];
};

export default function CustomAccordion({ title, icon, items }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-2">
      <Button
        variant="outline"
        className="w-full justify-between text-right px-4 py-2 rounded-xl flex items-center gap-2 overflow-hidden"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2 min-w-0">
          {icon}
          <span className="truncate">{title}</span>
        </div>

        <div className="shrink-0">
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </Button>

      {expanded && (
        <div className="mt-2 space-y-2">
          {items.map((item) =>
            item.customComponent ? (
              <div key={item.id} className="overflow-hidden">
                {item.customComponent}
              </div>
            ) : (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start text-right px-4 py-2 rounded-md flex items-center gap-2 overflow-hidden"
                onClick={item.onClick}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="text-sm min-w-0 truncate">{item.text}</span>
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
}
