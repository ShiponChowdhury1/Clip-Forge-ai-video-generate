"use client";

import { Info, Wand2 } from "lucide-react";

interface Step1VideoDetailsProps {
  videoTitle: string;
  setVideoTitle: (value: string) => void;
  keywords: string;
  setKeywords: (value: string) => void;
  negativeKeywords: string;
  setNegativeKeywords: (value: string) => void;
  script: string;
  setScript: (value: string) => void;
}

export default function Step1VideoDetails({
  videoTitle,
  setVideoTitle,
  keywords,
  setKeywords,
  negativeKeywords,
  setNegativeKeywords,
  script,
  setScript,
}: Step1VideoDetailsProps) {
  return (
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 space-y-6">
      {/* Video Title */}
      <div>
        <label className="flex items-center gap-2 text-white text-sm font-semibold mb-3">
          Video Title
          <span className="group relative">
            <Info className="w-4 h-4 text-[#3B82F6] cursor-help" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#1A2332] text-gray-300 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#1A3155]">
              Enter a descriptive title for your video
            </span>
          </span>
        </label>
        <input
          type="text"
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
          placeholder="write your video title"
          className="w-full bg-[#0B0E12] border border-[#1A3155] rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors"
        />
      </div>

      {/* Keywords */}
      <div>
        <label className="flex items-center gap-2 text-white text-sm font-semibold mb-3">
          Keywords
          <span className="group relative">
            <Info className="w-4 h-4 text-[#3B82F6] cursor-help" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#1A2332] text-gray-300 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#1A3155]">
              Keywords help AI find relevant media for your scenes
            </span>
          </span>
        </label>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g., summer, beach, sunset, travel"
          className="w-full bg-[#0B0E12] border border-[#1A3155] rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors"
        />
      </div>

      {/* Negative Keywords */}
      <div>
        <label className="flex items-center gap-2 text-white text-sm font-semibold mb-3">
          Negative Keywords
          <span className="group relative">
            <Info className="w-4 h-4 text-[#3B82F6] cursor-help" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#1A2332] text-gray-300 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#1A3155]">
              Exclude unwanted elements from generated media
            </span>
          </span>
        </label>
        <input
          type="text"
          value={negativeKeywords}
          onChange={(e) => setNegativeKeywords(e.target.value)}
          placeholder="e.g., people, text, watermarks"
          className="w-full bg-[#0B0E12] border border-[#1A3155] rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors"
        />
      </div>

      {/* Script */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2 text-white text-sm font-semibold">
            Script
            <span className="group relative">
              <Info className="w-4 h-4 text-[#3B82F6] cursor-help" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#1A2332] text-gray-300 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#1A3155]">
                Write or paste your video script here
              </span>
            </span>
          </label>
    
        </div>
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Write your script here or use AI to generate one..."
          rows={6}
          className="w-full bg-[#0B0E12] border border-[#1A3155] rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors resize-none"
        />
        <div className="flex justify-end mt-2">
          <span className="text-gray-500 text-xs">
            {script.length} characters
          </span>
        </div>
      </div>
    </div>
  );
}
