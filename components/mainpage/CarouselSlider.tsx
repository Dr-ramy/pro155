'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "/mainimage/image-slider-1n.jpg",
  "/mainimage/image-slider-2n.jpg",
  "/mainimage/image-slider-3n.jpg",
];

export default function CarouselSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full mx-auto overflow-hidden rounded-lg aspect-1024/350 bg-white">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
          transition={{ duration: 0.6 }}
          className="absolute top-0 left-0 w-full h-full"
        >
          <Image
            src={images[current]}
            alt={`Slide ${current + 1}`}
            fill
            className="object-cover object-center"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 z-10">
<Button
  variant="ghost"
  size="icon"
  onClick={prevSlide}
  className="bg-black/30 hover:bg-black/50 w-10 h-10 rounded-full"
>
  <FaChevronLeft className="w-5 h-5 text-white" />
</Button>

      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 z-10">
<Button
  variant="ghost"
  size="icon"
  onClick={nextSlide}
  className="bg-black/30 hover:bg-black/50 w-10 h-10 rounded-full"
>
  <FaChevronRight className="w-5 h-5 text-white" />
</Button>

      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > current ? 1 : -1);
              setCurrent(index);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === current ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
