"use client";

import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { videos } from "@/app/data";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

export default function VideoSection() {
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  // Build visible window — each item gets a unique key so AnimatePresence
  // can detect which card enters / exits
  const visibleItems = Array.from({ length: 4 }, (_, i) => {
    const idx =
      ((startIndex + i) % videos.length + videos.length) % videos.length;
    return { ...videos[idx], uniqueKey: startIndex + i };
  });

  const nextSlide = useCallback(() => {
    setDirection(1);
    setStartIndex((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setStartIndex((prev) => prev - 1);
  }, []);

  // Auto-play — slides every 4 s, pauses on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Which dot is active
  const activeDot =
    ((startIndex % videos.length) + videos.length) % videos.length;

  const cardVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 320 : -320,
      opacity: 0,
      scale: 0.92,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -320 : 320,
      opacity: 0,
      scale: 0.92,
    }),
  };

  return (
    <section className="w-full max-w-[1662px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 md:py-12">
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slider */}
        <div className="overflow-hidden">
          <div className="flex flex-wrap xl:flex-nowrap gap-4 sm:gap-5 items-end justify-center">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              {visibleItems.map((item, index) => (
                <motion.div
                  key={item.uniqueKey}
                  layout
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 260, damping: 28 },
                    opacity: { duration: 0.25 },
                    scale: { duration: 0.25 },
                    layout: { type: "spring", stiffness: 260, damping: 28 },
                  }}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer group border border-gray-800/50 hover:border-gray-700/50 transition-colors duration-300 w-full sm:w-[calc(50%-10px)] xl:w-[calc(25%-15px)] ${
                    index === 1 || index === 2 ? "aspect-[3/4]" : "aspect-[4/5]"
                  }`}
                >
                  {/* Background Image */}
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 sm:w-14 sm:h-14 bg-cyan-500/80 rounded-full flex items-center justify-center group-hover:bg-cyan-500 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-cyan-500/20"
                    >
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 text-black fill-black ml-1" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <h3 className="text-white font-semibold text-base sm:text-lg mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Arrows */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="absolute left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-black/70 hover:bg-black/90 backdrop-blur-sm border border-gray-700/50 rounded-full flex items-center justify-center text-white transition-all duration-200"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="absolute right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-black/70 hover:bg-black/90 backdrop-blur-sm border border-gray-700/50 rounded-full flex items-center justify-center text-white transition-all duration-200"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>

        {/* Dot Indicators */}
        <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > activeDot ? 1 : -1);
                setStartIndex(index);
              }}
              className="relative"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeDot
                    ? "bg-cyan-400 w-6"
                    : "bg-gray-600 hover:bg-gray-500 w-2"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
