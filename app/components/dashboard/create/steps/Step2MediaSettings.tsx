"use client";

import { Play } from "lucide-react";

export type MusicOption =
  | "no-music"
  | "sunrise-energy"
  | "calm-waters"
  | "modern-business"
  | "epic-journey";

export type VideoFormat = "9:16" | "1:1" | "16:9";

interface Step2MediaSettingsProps {
  backgroundMusic: MusicOption;
  setBackgroundMusic: (value: MusicOption) => void;
  videoFormat: VideoFormat;
  setVideoFormat: (value: VideoFormat) => void;
}

const musicOptions: {
  value: MusicOption;
  label: string;
  tag: string;
  description: string;
  color: string;
  hasPreview: boolean;
}[] = [
  {
    value: "no-music",
    label: "No Music",
    tag: "None",
    description: "Generate video without background music",
    color: "bg-amber-400",
    hasPreview: false,
  },
  {
    value: "sunrise-energy",
    label: "Sunrise Energy",
    tag: "Upbeat",
    description: "Energetic and motivational track",
    color: "bg-emerald-400",
    hasPreview: true,
  },
  {
    value: "calm-waters",
    label: "Calm Waters",
    tag: "Ambient",
    description: "Soft atmospheric soundscape",
    color: "bg-cyan-400",
    hasPreview: true,
  },
  {
    value: "modern-business",
    label: "Modern Business",
    tag: "Corporate",
    description: "Professional and inspiring",
    color: "bg-blue-500",
    hasPreview: true,
  },
  {
    value: "epic-journey",
    label: "Epic Journey",
    tag: "Cinematic",
    description: "Dramatic orchestral piece",
    color: "bg-fuchsia-500",
    hasPreview: true,
  },
];

const formatOptions: {
  value: VideoFormat;
  label: string;
  widthClass: string;
  heightClass: string;
}[] = [
  {
    value: "9:16",
    label: "9:16",
    widthClass: "w-12",
    heightClass: "h-20",
  },
  {
    value: "1:1",
    label: "1:1",
    widthClass: "w-14",
    heightClass: "h-14",
  },
  {
    value: "16:9",
    label: "16:9",
    widthClass: "w-20",
    heightClass: "h-12",
  },
];

export default function Step2MediaSettings({
  backgroundMusic,
  setBackgroundMusic,
  videoFormat,
  setVideoFormat,
}: Step2MediaSettingsProps) {
  return (
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 space-y-8">
      {/* Background Music */}
      <div>
        <h3 className="text-white text-base font-semibold mb-4">
          Background Music
        </h3>
        <div className="space-y-2">
          {musicOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setBackgroundMusic(option.value)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                backgroundMusic === option.value
                  ? "border-[#3B82F6] bg-[#3B82F6]/5"
                  : "border-[#1A3155] bg-[#0B0E12] hover:border-[#2A4A7A]"
              }`}
            >
              {/* Color indicator */}
              <div
                className={`w-10 h-10 rounded-lg ${option.color} shrink-0`}
              />

              {/* Info */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">
                    {option.label}
                  </span>
                  <span className="px-2 py-0.5 bg-[#1A2332] text-gray-400 text-[10px] font-medium rounded-md border border-[#1A3155]">
                    {option.tag}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">
                  {option.description}
                </p>
              </div>

              {/* Right side - selected dot or play button */}
              {backgroundMusic === option.value ? (
                <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shrink-0" />
              ) : option.hasPreview ? (
                <div className="w-8 h-8 rounded-full bg-[#1A2332] border border-[#1A3155] flex items-center justify-center shrink-0 hover:bg-[#243044] transition-colors">
                  <Play className="w-3 h-3 text-gray-400 ml-0.5" />
                </div>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Video Format */}
      <div>
        <h3 className="text-white text-base font-semibold mb-4">
          Video Format
        </h3>
        <div className="flex items-end gap-4">
          {formatOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setVideoFormat(option.value)}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${
                videoFormat === option.value
                  ? "border-[#3B82F6] bg-[#3B82F6]/5"
                  : "border-[#1A3155] bg-[#0B0E12] hover:border-[#2A4A7A]"
              }`}
            >
              {/* Device mockup */}
              <div className="flex items-center justify-center h-20">
                <div
                  className={`${option.widthClass} ${option.heightClass} rounded-md border-2 ${
                    videoFormat === option.value
                      ? "border-[#3B82F6]"
                      : "border-[#2A3A50]"
                  } transition-colors`}
                />
              </div>
              <span
                className={`text-sm font-medium ${
                  videoFormat === option.value
                    ? "text-white"
                    : "text-gray-400"
                }`}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
