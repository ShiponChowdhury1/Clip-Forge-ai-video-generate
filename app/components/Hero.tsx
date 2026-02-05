"use client";

import { Play } from "lucide-react";

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
        <button className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 sm:px-6 py-3 rounded-lg transition flex items-center justify-center gap-2 text-sm">
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          No Credit Card Required
        </span>
        <span className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          60s Generation Time
        </span>
        <span className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          50K+ Creators
        </span>
      </div>
    </section>
  );
}
