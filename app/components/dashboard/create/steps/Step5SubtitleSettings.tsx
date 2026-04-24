"use client";

import { Check } from "lucide-react";
import { subtitleStyles } from "@/app/data/createVideoOptions";
import type { SubtitleStyle } from "@/types/createVideo";

interface Step5SubtitleSettingsProps {
  subtitlesEnabled: boolean;
  setSubtitlesEnabled: (value: boolean) => void;
  subtitleStyle: SubtitleStyle;
  setSubtitleStyle: (value: SubtitleStyle) => void;
}

export default function Step5SubtitleSettings({
  subtitlesEnabled,
  setSubtitlesEnabled,
  subtitleStyle,
  setSubtitleStyle,
}: Step5SubtitleSettingsProps) {
  return (
    <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6 space-y-6">
      {/* Header with toggle */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-gray-900 dark:text-white text-lg font-semibold">
            Subtitles
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Choose a subtitle style to improve readability.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-md border ${
              subtitlesEnabled
                ? "text-emerald-600 dark:text-emerald-300 border-emerald-300/70 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10"
                : "text-gray-600 dark:text-gray-400 border-gray-300 dark:border-[#1A3155] bg-gray-100 dark:bg-[#1A2332]"
            }`}
          >
            {subtitlesEnabled ? "Enabled" : "Disabled"}
          </span>
          <button
            onClick={() => {
              const next = !subtitlesEnabled;
              setSubtitlesEnabled(next);
              if (!next) setSubtitleStyle("none");
            }}
            aria-pressed={subtitlesEnabled}
            aria-label="Toggle subtitles"
            className={`relative w-12 h-6 rounded-full transition-colors ${
              subtitlesEnabled ? "bg-[#3B82F6]" : "bg-gray-300 dark:bg-[#1A2332]"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                subtitlesEnabled ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Disabled message */}
      {!subtitlesEnabled && (
        <p className="text-gray-500 text-sm bg-gray-100 dark:bg-[#1A2332] border border-gray-200 dark:border-[#1A3155] rounded-lg px-3 py-2">
          Subtitles are disabled. Toggle on to choose a style.
        </p>
      )}

      {/* Subtitle style cards */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 transition-opacity ${
          !subtitlesEnabled ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        {subtitleStyles.map((style) => (
          <button
            key={style.value}
            type="button"
            onClick={() => {
              setSubtitleStyle(style.value);
              if (style.value === "none") {
                setSubtitlesEnabled(false);
              } else {
                setSubtitlesEnabled(true);
              }
            }}
            className={`flex flex-col rounded-xl border transition-all overflow-hidden ${
              subtitleStyle === style.value
                ? "border-[#3B82F6] ring-1 ring-[#3B82F6]/30 shadow-sm"
                : "border-gray-300 dark:border-[#1A3155] hover:border-blue-300 dark:hover:border-[#2A4A7A]"
            }`}
          >
            {/* Preview area */}
            <div
              className="relative bg-gray-200 dark:bg-[#1A2332] overflow-hidden"
              style={{ aspectRatio: "16/9" }}
            >
              {style.value === "none" ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={style.previewStyle}>
                    {style.previewText}
                  </span>
                </div>
              ) : (
                <div className="absolute left-[5%] right-[5%] bottom-[8%] flex justify-center">
                  <p
                    className={`${style.previewStyle} max-w-full text-center whitespace-normal wrap-break-word leading-tight`}
                  >
                    {style.previewText}
                  </p>
                </div>
              )}

              {subtitleStyle === style.value && (
                <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-[#3B82F6] text-white text-[10px] font-semibold px-2 py-1">
                  <Check className="w-3 h-3" />
                  Selected
                </div>
              )}
            </div>

            {/* Label + credits */}
            <div className="bg-gray-50 dark:bg-[#0B0E12] px-3 py-2 flex items-center justify-between">
              <span className="text-gray-900 dark:text-white text-xs font-medium">
                {style.label}
              </span>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-md border ${
                  style.credits === "Free"
                    ? "text-emerald-600 dark:text-emerald-300 border-emerald-300/70 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10"
                    : "text-[#3B82F6] border-[#3B82F6]/30 bg-[#3B82F6]/10"
                }`}
              >
                {style.credits}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
