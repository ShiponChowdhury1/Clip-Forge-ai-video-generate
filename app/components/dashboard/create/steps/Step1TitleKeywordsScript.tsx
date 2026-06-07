"use client";

import { Info } from "lucide-react";

const MAX_SCRIPT_CHARACTERS = 800;

interface Step1TitleKeywordsScriptProps {
  videoTitle: string;
  setVideoTitle: (value: string) => void;
  keywords: string;
  setKeywords: (value: string) => void;
  negativeKeywords: string;
  setNegativeKeywords: (value: string) => void;
  script: string;
  setScript: (value: string) => void;
}

export default function Step1TitleKeywordsScript({
  videoTitle,
  setVideoTitle,
  keywords,
  setKeywords,
  negativeKeywords,
  setNegativeKeywords,
  script,
  setScript,
}: Step1TitleKeywordsScriptProps) {
  const remainingCharacters = Math.max(MAX_SCRIPT_CHARACTERS - script.length, 0);

  return (
    <div className="bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6 space-y-6">
      {/* Video Title */}
      <div>
        <label className="flex items-center gap-2 text-gray-900 dark:text-white text-sm font-semibold mb-3">
          Video Title
          <span className="text-[#3B82F6]">*</span>
          <span className="group relative">
            <Info className="w-4 h-4 text-[#3B82F6] cursor-help" />
            <span
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-100 dark:bg-[#0A0A0A] text-gray-700 dark:text-gray-300 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-300 dark:border-[#1A3155]"
              style={{ whiteSpace: "nowrap" }}
            >
              Enter a descriptive title for your video
            </span>
          </span>
        </label>
        <input
          type="text"
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
          required
          placeholder="Write your video title"
          className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#1A3155] rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors"
        />
      </div>

      {/* Keywords */}
      <div>
        <label className="flex items-center gap-2 text-gray-900 dark:text-white text-sm font-semibold mb-3">
          Keywords
          <span className="group relative">
            <Info className="w-4 h-4 text-[#3B82F6] cursor-help" />
            <span
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-100 dark:bg-[#0A0A0A] text-gray-700 dark:text-gray-300 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-300 dark:border-[#1A3155]"
              style={{ whiteSpace: "nowrap" }}
            >
              Keywords help AI find relevant media for your scenes
            </span>
          </span>
        </label>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Positive keywords"
          className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#1A3155] rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors"
        />
      </div>

      {/* Negative Keywords */}
      <div>
        <label className="flex items-center gap-2 text-gray-900 dark:text-white text-sm font-semibold mb-3">
          Negative Keywords
          <span className="group relative">
            <Info className="w-4 h-4 text-[#3B82F6] cursor-help" />
            <span
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-100 dark:bg-[#0A0A0A] text-gray-700 dark:text-gray-300 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-300 dark:border-[#1A3155]"
              style={{ whiteSpace: "nowrap" }}
            >
              Exclude unwanted elements from generated media
            </span>
          </span>
        </label>
        <input
          type="text"
          value={negativeKeywords}
          onChange={(e) => setNegativeKeywords(e.target.value)}
          placeholder="Negative keywords"
          className="w-full bg-gray-50 dark:bg-[#0B0E12] border border-gray-300 dark:border-[#1A3155] rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors "
        />
      </div>

      {/* Script */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2 text-gray-900 dark:text-white text-sm font-semibold">
            Script
            <span className="text-[#3B82F6]">*</span>
            <span className="group relative">
              <Info className="w-4 h-4 text-[#3B82F6] cursor-help" />
              <span
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-100 dark:bg-[#1A2332] text-gray-700 dark:text-gray-300 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-300 dark:border-[#1A3155]"
                style={{ whiteSpace: "nowrap" }}
              >
                Write or paste your video script here
              </span>
            </span>
          </label>
        </div>
        <textarea
          value={script}
          onChange={(e) => {
            const nextValue = e.target.value;
            if (nextValue.length <= MAX_SCRIPT_CHARACTERS) {
              setScript(nextValue);
              return;
            }

            setScript(nextValue.slice(0, MAX_SCRIPT_CHARACTERS));
          }}
          required
          placeholder="Write your script here or use AI to generate one..."
          rows={6}
          className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#1A3155] rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm leading-relaxed placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors resize-none overflow-hidden"
          style={{ overflow: "hidden" }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
          }}
        />
        <div className="flex justify-end mt-2">
          <span className="text-gray-500 text-xs">
            {remainingCharacters} characters
          </span>
        </div>
      </div>
    </div>
  );
}
