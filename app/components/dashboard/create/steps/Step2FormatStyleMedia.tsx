"use client";

import { useEffect } from "react";
import Image from "next/image";
import { formatOptions, sceneMediaOptions, videoStyles } from "@/app/data/createVideoOptions";
import type { SceneMediaOption, VideoFormat, VideoStyleOption } from "@/types/createVideo";

interface Step2FormatStyleMediaProps {
  videoFormat: VideoFormat;
  setVideoFormat: (value: VideoFormat) => void;
  videoStyle: VideoStyleOption;
  setVideoStyle: (value: VideoStyleOption) => void;
  sceneMedia: SceneMediaOption;
  setSceneMedia: (value: SceneMediaOption) => void;
}

export default function Step2FormatStyleMedia({
  videoFormat,
  setVideoFormat,
  videoStyle,
  setVideoStyle,
  sceneMedia,
  setSceneMedia,
}: Step2FormatStyleMediaProps) {
  useEffect(() => {
    const hasValidSelection = sceneMediaOptions.some((option) => option.value === sceneMedia);
    if (!hasValidSelection) {
      setSceneMedia("all-images");
    }
  }, [sceneMedia, setSceneMedia]);

  return (
    <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6 space-y-8">
      {/* Video Format */}
      <div>
        <h3 className="text-gray-900 dark:text-white text-base font-semibold mb-4">
          Video Format
        </h3>
        <div className="grid grid-cols-2 items-end gap-3 sm:flex">
          {formatOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setVideoFormat(option.value)}
              className={`flex w-full min-w-0 flex-col items-center gap-2 sm:gap-3 sm:w-37.5 ${option.cardHeight} p-3 sm:p-5 rounded-xl border transition-all ${
                option.value === "16:9" ? "col-span-2 sm:col-span-1" : ""
              } ${
                videoFormat === option.value
                  ? "border-[#3B82F6] bg-blue-50 dark:bg-[#3B82F6]/5"
                  : "border-gray-300 dark:border-[#1A3155] bg-gray-50 dark:bg-[#0B0E12] hover:border-blue-300 dark:hover:border-[#2A4A7A]"
              }`}
            >
              {/* Device mockup */}
              <div className="flex-1 flex items-end justify-center">
                <div
                  className={`${option.innerWidth} ${option.innerHeight} rounded-lg border-2 ${
                    videoFormat === option.value
                      ? "border-[#3B82F6]"
                      : "border-gray-300 dark:border-[#2A3A50]"
                  } transition-colors`}
                />
              </div>
              <span
                className={`text-xs sm:text-sm font-medium ${
                  videoFormat === option.value
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Video Style */}
      <div>
        <h3 className="text-gray-900 dark:text-white text-lg font-semibold mb-5">Video Style</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {videoStyles.map((style) => (
            <button
              key={style.value}
              onClick={() => setVideoStyle(style.value)}
              className={`flex flex-col items-center gap-2 group transition-all ${
                videoStyle === style.value ? "scale-[1.02]" : ""
              }`}
            >
              <div
                className={`w-full aspect-4/3 rounded-xl overflow-hidden border-2 transition-all ${
                  videoStyle === style.value
                    ? "border-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                    : "border-transparent hover:border-blue-300 dark:hover:border-[#2A4A7A]"
                }`}
              >
                <Image
                  src={style.image}
                  alt={style.label}
                  width={200}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  videoStyle === style.value
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                }`}
              >
                {style.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Scene Settings */}
      <div>
        <h3 className="text-gray-900 dark:text-white text-sm font-semibold mb-4">
          Scene Settings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sceneMediaOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSceneMedia(option.value)}
              className={`relative flex flex-col items-start p-4 rounded-xl border transition-all text-left ${
                sceneMedia === option.value
                  ? "border-[#3B82F6] bg-[#3B82F6]/5"
                  : "border-gray-300 dark:border-[#1A3155] bg-gray-50 dark:bg-[#0B0E12] hover:border-blue-300 dark:hover:border-[#2A4A7A]"
              }`}
            >
              <span className="text-gray-900 dark:text-white text-sm font-medium">
                {option.label}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-[11px] mt-1 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-[#1A2332] border border-gray-200 dark:border-[#1A3155]">
                {option.credits > 0 ? `+${option.credits} credits` : "No extra credits"}
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
