"use client";

import { useMemo } from "react";

export default function MessageDate({ date }: { date: string | Date }) {
  const formatted = useMemo(() => {
    const d = new Date(date);
    return d.toLocaleString("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }, [date]);

  return <span>{formatted}</span>;
}
