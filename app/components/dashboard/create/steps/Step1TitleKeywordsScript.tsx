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
  showErrors?: boolean;
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
  showErrors = false,
}: Step1TitleKeywordsScriptProps) {
  const remainingCharacters = Math.max(MAX_SCRIPT_CHARACTERS - script.length, 0);

  return (
    <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1F1F1F] rounded-2xl p-6 space-y-6">
      {/* Video Title */}
      <div>
        <label className="flex items-center gap-2 text-gray-900 dark:text-white text-sm font-semibold mb-3">
          Video Title
          <span className="text-[#3B82F6] text-xs font-normal">(required)</span>
          <span className="group relative">
            <Info className="w-4 h-4 text-[#3B82F6] cursor-help" />
            <span
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-100 dark:bg-[#0A0A0A] text-gray-700 dark:text-gray-300 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-200 dark:border-[#1F1F1F]"
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
          placeholder="Write your video title here..."
          className={`w-full bg-gray-50 dark:bg-[#0A0A0A] border-[1px] rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none transition-colors ${
            showErrors && !videoTitle.trim()
              ? ""
              : "border-gray-200 dark:border-[#1F1F1F] focus:border-[#3B82F6]"
          }`}
          style={{
            border: showErrors && !videoTitle.trim() ? "1px solid #EF4444" : undefined
          }}
        />
        {showErrors && !videoTitle.trim() && (
          <p className="text-red-500 text-xs mt-1.5 font-medium">Video Title is required.</p>
        )}
      </div>

      {/* Keywords */}
      <div>
        <label className="flex items-center gap-2 text-gray-900 dark:text-white text-sm font-semibold mb-3">
          Keywords
          <span className="group relative">
            <Info className="w-4 h-4 text-[#3B82F6] cursor-help" />
            <span
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-100 dark:bg-[#0A0A0A] text-gray-700 dark:text-gray-300 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-200 dark:border-[#1F1F1F]"
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
          className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1F1F1F] rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors"
        />
      </div>

      {/* Negative Keywords */}
      <div>
        <label className="flex items-center gap-2 text-gray-900 dark:text-white text-sm font-semibold mb-3">
          Negative Keywords
          <span className="group relative">
            <Info className="w-4 h-4 text-[#3B82F6] cursor-help" />
            <span
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-100 dark:bg-[#0A0A0A] text-gray-700 dark:text-gray-300 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-200 dark:border-[#1F1F1F]"
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
          className="w-full bg-gray-50 dark:bg-[#0B0E12] border border-gray-200 dark:border-[#1F1F1F] rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors "
        />
      </div>

      {/* Script */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2 text-gray-900 dark:text-white text-sm font-semibold">
            Script
            <span className="text-[#3B82F6] text-xs font-normal">(required)</span>
            <span className="group relative">
              <Info className="w-4 h-4 text-[#3B82F6] cursor-help" />
              <span
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-100 dark:bg-[#1A2332] text-gray-700 dark:text-gray-300 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-200 dark:border-[#1F1F1F]"
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
          placeholder="Write your script here... (max 800 characters)"
          rows={6}
          className={`w-full bg-gray-50 dark:bg-[#0A0A0A] border-[1px] rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm leading-relaxed placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none transition-colors resize-none overflow-hidden ${
            showErrors && !script.trim()
              ? ""
              : "border-gray-200 dark:border-[#1F1F1F] focus:border-[#3B82F6]"
          }`}
          style={{
            overflow: "hidden",
            border: showErrors && !script.trim() ? "1px solid #EF4444" : undefined
          }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
          }}
        />
        {showErrors && !script.trim() && (
          <p className="text-red-500 text-xs mt-1.5 font-medium">Video Script is required.</p>
        )}
        <div className="flex justify-end mt-2">
          <span className="text-gray-500 text-xs">
            {remainingCharacters} characters
          </span>
        </div>
      </div>
    </div>
  );
}
