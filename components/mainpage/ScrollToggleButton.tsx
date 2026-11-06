'use client';

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScrollToggleButton() {
  const [isScrollingDown, setIsScrollingDown] = useState(true);

  const handleClick = () => {
    const scrollStep = window.innerHeight * 0.9; // Scroll ~90% of viewport height
    if (isScrollingDown) {
      window.scrollBy({ top: scrollStep, behavior: 'smooth' });
    } else {
      window.scrollBy({ top: -scrollStep, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
      const atTop = window.scrollY <= 10;

      if (nearBottom) {
        setIsScrollingDown(false);
      } else if (atTop) {
        setIsScrollingDown(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="icon"
      className="rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 fixed bottom-6 left-6 z-50"
    >
      {isScrollingDown ? <ChevronDown className="w-6 h-6" /> : <ChevronUp className="w-6 h-6" />}
    </Button>
  );
}
