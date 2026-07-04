"use client";

import { Play, ChevronLeft, ChevronRight, X } from "lucide-react";
import { videos } from "@/app/data";
import { useState, useEffect, useCallback, useRef } from "react";

interface VideoCardProps {
  item: typeof videos[0];
  index: number;
  activeIndex: number;
  onClick: () => void;
}

function VideoCard({ item, index, activeIndex, onClick }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = 0.1;
      } catch (e) {
        console.error("Error setting initial time:", e);
      }
    }
  };

  useEffect(() => {
    if (!videoRef.current) return;
    if (isHovered) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      try {
        videoRef.current.pause();
        if (videoRef.current.readyState >= 1) {
          videoRef.current.currentTime = 0.1;
        }
      } catch (err) {
        console.error("Error pausing video:", err);
      }
    }
  }, [isHovered]);

  // Determine if this card is one of the middle two visible cards
  const isMiddle = index === activeIndex + 1 || index === activeIndex + 2;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden cursor-pointer group border border-gray-250 dark:border-gray-800/80 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-500 ease-out w-[78vw] sm:w-[45vw] md:w-[30vw] xl:w-[calc(25%-18px)] shrink-0 snap-start shadow-lg shadow-black/5 aspect-[3/4] ${
        isMiddle ? "xl:aspect-[3/4]" : "xl:aspect-[4/5]"
      }`}
    >
      {/* Video Element (Dynamic Live Thumbnail) */}
      <video
        ref={videoRef}
        src={`${item.videoUrl}#t=0.1`}
        onLoadedMetadata={handleLoadedMetadata}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0 bg-gray-950"
        preload="metadata"
        playsInline
        muted
        loop
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:from-black/90 group-hover:via-black/45 transition-all duration-300 z-10" />

      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-cyan-500/80 rounded-full flex items-center justify-center group-hover:bg-cyan-500 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-cyan-500/20 transform scale-90 group-hover:scale-105">
          <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white ml-1" />
        </div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-gradient-to-t from-black/95 via-black/55 to-transparent z-20 text-left">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-cyan-400 mb-1 block">
          {item.category}
        </span>
        <h3 className="text-white font-semibold text-base sm:text-lg mb-1 leading-snug">
          {item.title}
        </h3>
        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-2">
          {item.desc}
        </p>
      </div>
    </div>
  );
}

export default function VideoSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeVideo, setActiveVideo] = useState<typeof videos[0] | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
    // Find closest index
    const index = Math.round(scrollLeft / (scrollWidth / videos.length));
    setActiveIndex(index);
    
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      // Listen to resize
      window.addEventListener("resize", checkScroll);
      // Run once initially
      checkScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      }
    };
  }, [checkScroll]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.scrollWidth / videos.length;
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });
  };

  // Auto-play — slides every 5 s, pauses on hover or when video modal is open
  useEffect(() => {
    if (activeVideo) return;
    const autoPlayTimer = setInterval(() => {
      if (!scrollRef.current) return;
      const container = scrollRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      
      if (scrollLeft >= scrollWidth - clientWidth - 15) {
        // Wrap around to start
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const cardWidth = scrollWidth / videos.length;
        container.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 5000);
    return () => clearInterval(autoPlayTimer);
  }, [activeVideo]);

  return (
    <section className="w-full max-w-[1662px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 md:py-12 relative group/section">
      <div className="relative">
        {/* Scrollable container */}
        <div 
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 select-none [&::-webkit-scrollbar]:hidden items-end"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {videos.map((item, index) => (
            <VideoCard
              key={index}
              item={item}
              index={index}
              activeIndex={activeIndex}
              onClick={() => setActiveVideo(item)}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black text-gray-900 dark:text-white backdrop-blur-sm border border-gray-300 dark:border-gray-700/50 rounded-full flex items-center justify-center transition-all duration-200 shadow-md opacity-0 group-hover/section:opacity-100 hover:scale-105 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black text-gray-900 dark:text-white backdrop-blur-sm border border-gray-300 dark:border-gray-700/50 rounded-full flex items-center justify-center transition-all duration-200 shadow-md opacity-0 group-hover/section:opacity-100 hover:scale-105 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Dot Indicators */}
        <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8">
          {Array.from({ length: videos.length }).map((_, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={index}
                onClick={() => {
                  if (scrollRef.current) {
                    const cardWidth = scrollRef.current.scrollWidth / videos.length;
                    scrollRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" });
                  }
                }}
                className="relative p-1"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-cyan-400 w-6"
                      : "bg-gray-650 dark:bg-gray-600 hover:bg-gray-500 w-2"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Video Playback Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setActiveVideo(null)}
          />
          
          {/* Modal Card */}
          <div className="relative bg-[#05050e] rounded-3xl w-full max-w-4xl mx-auto shadow-2xl border border-gray-800/85 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300 z-10">
            {/* Header */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-800/50 bg-[#020206]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Play size={16} className="text-cyan-400 fill-cyan-400" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-cyan-400 block">
                    {activeVideo.category}
                  </span>
                  <h3 className="text-sm font-bold text-white tracking-wide">{activeVideo.title}</h3>
                </div>
              </div>
              <button 
                onClick={() => setActiveVideo(null)} 
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Video Container */}
            <div className="aspect-video bg-black relative flex items-center justify-center">
              <video
                src={activeVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full max-h-[75vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
