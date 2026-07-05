"use client";

import { Play, X } from "lucide-react";
import { videos } from "@/app/data";
import { useState } from "react";

const getPreviewUrl = (videoUrl: string) => {
  const parts = videoUrl.split('/');
  const filename = parts.pop();
  return `${parts.join('/')}/previews/preview-${filename}`;
};

interface VideoCardProps {
  item: typeof videos[0];
  onClick: () => void;
}

function VideoCard({ item, onClick }: VideoCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative rounded-2xl overflow-hidden cursor-pointer group border border-gray-200 dark:border-gray-800/80 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-500 ease-out w-[180px] sm:w-[220px] md:w-[260px] xl:w-[280px] shrink-0 shadow-lg shadow-black/5 aspect-[9/16] bg-gray-950"
    >
      {/* Video Element (Dynamic Live Thumbnail) */}
      <video
        src={encodeURI(getPreviewUrl(item.videoUrl))}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0 bg-gray-950"
        preload="metadata"
        autoPlay
        playsInline
        muted
        loop
      />
      {/* Category Info Glass Badge (Top-Left) */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20">
        <span className="px-2.5 py-1 sm:py-1.5 text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold text-cyan-400 bg-black/60 dark:bg-black/80 backdrop-blur-md rounded-lg border border-white/5 dark:border-white/10 shadow-md block">
          {item.category}
        </span>
      </div>
    </div>
  );
}

export default function VideoSection() {
  const [activeVideo, setActiveVideo] = useState<typeof videos[0] | null>(null);

  // Replicate list 4 times for infinite marquee effect
  const marqueeVideos = [...videos, ...videos, ...videos, ...videos];

  return (
    <section className="w-full max-w-[1662px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 md:py-12 relative group/section overflow-hidden">
      <div className="relative w-full">
        {/* Left & Right gradient masks for premium fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-white dark:from-black to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-white dark:from-black to-transparent z-20 pointer-events-none" />

        {/* Marquee Container */}
        <div className="overflow-hidden w-full">
          <div 
            className={`flex gap-4 sm:gap-6 w-max py-4 hover:[animation-play-state:paused] ${
              activeVideo ? "[animation-play-state:paused]" : "animate-marquee"
            }`}
          >
            {marqueeVideos.map((item, index) => (
              <VideoCard
                key={`${item.title}-${index}`}
                item={item}
                onClick={() => setActiveVideo(item)}
              />
            ))}
          </div>
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
                src={encodeURI(activeVideo.videoUrl)}
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
