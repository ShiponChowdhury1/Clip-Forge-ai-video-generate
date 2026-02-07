"use client";

import { Info } from "lucide-react";

export type SceneMediaOption =
  | "all-images"
  | "first-scene-video"
  | "last-scene-video"
  | "first-last-scene-video";

interface Step1VideoDetailsProps {
  videoTitle: string;
  setVideoTitle: (value: string) => void;
  keywords: string;
  setKeywords: (value: string) => void;
  negativeKeywords: string;
  setNegativeKeywords: (value: string) => void;
  sceneMedia: SceneMediaOption;
  setSceneMedia: (value: SceneMediaOption) => void;
}

const sceneMediaOptions: {
  value: SceneMediaOption;
  label: string;
  credits: number;
}[] = [
  { value: "all-images", label: "Use all images", credits: 0 },
  { value: "first-scene-video", label: "First Scene video", credits: 30 },
  { value: "last-scene-video", label: "Last Scene video", credits: 30 },
  {
    value: "first-last-scene-video",
    label: "First & Last Scene video",
    credits: 60,
  },
];

export default function Step1VideoDetails({
  videoTitle,
  setVideoTitle,
  keywords,
  setKeywords,
  negativeKeywords,
  setNegativeKeywords,
  sceneMedia,
  setSceneMedia,
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

      {/* Scene Media Options */}
      <div>
        <h3 className="text-white text-sm font-semibold mb-4">
          Scene Media Options
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sceneMediaOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSceneMedia(option.value)}
              className={`relative flex flex-col items-start p-4 rounded-xl border transition-all text-left ${
                sceneMedia === option.value
                  ? "border-[#3B82F6] bg-[#3B82F6]/5"
                  : "border-[#1A3155] bg-[#0B0E12] hover:border-[#2A4A7A]"
              }`}
            >
              <span className="text-white text-sm font-medium">
                {option.label}
              </span>
              <span className="text-gray-500 text-xs mt-0.5">
                {option.credits} additional credits
              </span>
              {sceneMedia === option.value && (
                <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
