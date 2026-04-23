"use client";

import { useRouter } from "next/navigation";
import { Play, ShieldCheck, Zap, Users } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";

export default function Hero() {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);

  const handleStartCreating = () => {
    const hasToken = token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    router.push(hasToken ? "/dashboard/create" : "/login");
  };

  return (
    <section className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12 pt-10 sm:pt-12 md:pt-16 pb-6 sm:pb-8 flex flex-col items-center justify-center gap-4 sm:gap-5 md:gap-6">
      {/* Subtitle */}
      <p className="text-cyan-500 text-[10px] sm:text-xs md:text-sm font-medium tracking-widest uppercase">
        REVOLUTIONIZE YOUR CONTENT
      </p>
      
      {/* Main Heading */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-center max-w-4xl px-2">
       Create High-Quality Faceless Videos in Minutes
      </h1>
      
      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg text-center max-w-3xl leading-relaxed px-2">
      Turn scripts or simple prompts into fully rendered short-form videos — complete with visuals, narration, music, motion, and subtitles.
Built for TikTok, Reels, and YouTube Shorts.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center mt-2 sm:mt-4 w-full sm:w-auto px-4 sm:px-0">
        <button
          onClick={handleStartCreating}
          className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-5 sm:px-6 py-3 rounded-lg transition flex items-center justify-center gap-2 text-sm"
        >
          Start Creating Free
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="w-full sm:w-auto bg-transparent border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 font-medium px-5 sm:px-6 py-3 rounded-lg transition flex items-center justify-center gap-2 text-sm">
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
          Fast AI Rendering
        </span>
        <span className="flex items-center gap-2">
          <Users className="w-[18px] h-[18px] text-[#00A6F4]" />
           Commercial Use Included
        </span>
      </div>
    </section>
  );
}
