"use client";

import { Check, Subtitles, Ban } from "lucide-react";
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
    <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1F1F1F] rounded-2xl p-6 space-y-6">
      {/* Header with toggle */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20">
            <Subtitles className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-white text-lg font-semibold">
              Subtitles
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Choose a subtitle style to improve readability.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors ${
              subtitlesEnabled
                ? "text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10"
                : "text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#111111]"
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
              subtitlesEnabled ? "bg-[#3B82F6]" : "bg-gray-300 dark:bg-[#1F1F1F]"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                subtitlesEnabled ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Disabled message */}
      {!subtitlesEnabled && (
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-[#1F1F1F] rounded-xl px-4 py-3">
          <Ban className="w-4 h-4 text-gray-400 shrink-0" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Subtitles are disabled. Toggle on to choose a style.
          </p>
        </div>
      )}

      {/* Subtitle style cards */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300 ${
          !subtitlesEnabled ? "opacity-30 pointer-events-none blur-[1px]" : ""
        }`}
      >
        {subtitleStyles.map((style) => {
          const isSelected = subtitleStyle === style.value;
          const isNone = style.value === "none";

          return (
            <button
              key={style.value}
              type="button"
              onClick={() => {
                setSubtitleStyle(style.value);
                if (isNone) {
                  setSubtitlesEnabled(false);
                } else {
                  setSubtitlesEnabled(true);
                }
              }}
              className={`group flex flex-col rounded-xl border transition-all duration-200 overflow-hidden cursor-pointer ${
                isSelected
                  ? "border-[#3B82F6] shadow-[0_0_0_1px_rgba(59,130,246,0.3)]"
                  : "border-gray-200 dark:border-[#1F1F1F] hover:border-[#3B82F6]/50 dark:hover:border-[#3B82F6]/30 hover:shadow-md dark:hover:shadow-black/20"
              }`}
            >
              {/* Preview area */}
              <div
                className={`relative overflow-hidden ${
                  isNone
                    ? "bg-gray-100 dark:bg-[#111111]"
                    : "bg-gradient-to-b from-gray-300 via-gray-200 to-gray-100 dark:from-[#1A1A1A] dark:via-[#141414] dark:to-[#111111]"
                }`}
                style={{ aspectRatio: "16/9" }}
              >
                {isNone ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <Ban className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    <span className="text-gray-400 dark:text-gray-500 text-xs font-medium">
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

                {/* Selected badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-[#3B82F6] text-white text-[10px] font-semibold px-2 py-1 shadow-lg shadow-blue-500/20">
                    <Check className="w-3 h-3" />
                    Selected
                  </div>
                )}

                {/* Hover overlay */}
                {!isSelected && (
                  <div className="absolute inset-0 bg-[#3B82F6]/0 group-hover:bg-[#3B82F6]/5 transition-colors duration-200" />
                )}
              </div>

              {/* Label + credits */}
              <div className={`px-4 py-3 flex items-center justify-between border-t ${
                isSelected
                  ? "bg-[#3B82F6]/5 border-[#3B82F6]/20"
                  : "bg-gray-50 dark:bg-[#0A0A0A] border-gray-100 dark:border-[#1F1F1F]"
              }`}>
                <span className={`text-sm font-medium ${
                  isSelected
                    ? "text-[#3B82F6]"
                    : "text-gray-800 dark:text-gray-200"
                }`}>
                  {style.label}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    style.credits === "Free"
                      ? "text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10"
                      : isSelected
                      ? "text-[#3B82F6] bg-[#3B82F6]/10"
                      : "text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#111111]"
                  }`}
                >
                  {style.credits}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
