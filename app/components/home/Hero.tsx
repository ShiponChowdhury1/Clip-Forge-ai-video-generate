"use client";

import { Play, ShieldCheck, Zap, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12 pt-10 sm:pt-12 md:pt-16 pb-6 sm:pb-8 flex flex-col items-center justify-center gap-4 sm:gap-5 md:gap-6">
      {/* Subtitle */}
      <p className="text-cyan-500 text-[10px] sm:text-xs md:text-sm font-medium tracking-widest uppercase">
        REVOLUTIONIZE YOUR CONTENT
      </p>
      
      {/* Main Heading */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-center max-w-4xl px-2">
        Create Faceless Short-Form Videos with One Click
      </h1>
      
      {/* Description */}
      <p className="text-gray-400 text-sm sm:text-base md:text-lg text-center max-w-2xl leading-relaxed px-2">
        Scale your social media presence without ever showing your face. Automated generation for TikTok, Reels, and Shorts.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center mt-2 sm:mt-4 w-full sm:w-auto px-4 sm:px-0">
        <button className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-5 sm:px-6 py-3 rounded-lg transition flex items-center justify-center gap-2 text-sm">
          Start Creating Free
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="w-full sm:w-auto bg-transparent border border-gray-700 hover:border-gray-500 text-white font-medium px-5 sm:px-6 py-3 rounded-lg transition flex items-center justify-center gap-2 text-sm">
          <Play className="w-4 h-4" />
          Watch Demo
        </button>
      </div>

      {/* Feature Tags */}
      <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 justify-center text-[10px] sm:text-xs text-gray-500 mt-2 px-4">
        <span className="flex items-center gap-1.5 sm:gap-2">
          <ShieldCheck className="w-[18px] h-[18px] text-[#00A6F4]" />
          No Credit Card Required
        </span>
        <span className="flex items-center gap-2">
          <Zap className="w-[18px] h-[18px] text-[#00A6F4]" />
          60s Generation Time
        </span>
        <span className="flex items-center gap-2">
          <Users className="w-[18px] h-[18px] text-[#00A6F4]" />
          50K+ Creators
        </span>
      </div>
    </section>
  );
}
