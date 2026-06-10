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
              className={`group flex flex-col rounded-2xl border-2 transition-all duration-200 overflow-hidden cursor-pointer ${
                isSelected
                  ? "border-[#3B82F6] ring-4 ring-[#3B82F6]/10 scale-[1.02]"
                  : "border-gray-200 dark:border-[#1A1A1A] hover:border-[#3B82F6]/40 dark:hover:border-[#3B82F6]/30 hover:shadow-lg dark:hover:shadow-black/30 hover:scale-[1.01]"
              }`}
            >
              {/* Preview area — simulated video frame */}
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "16/9" }}
              >
                {isNone ? (
                  /* "None" style — clean empty state */
                  <div className="absolute inset-0 bg-gray-100 dark:bg-[#0E0E0E] flex flex-col items-center justify-center gap-2.5">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-[#1A1A1A] flex items-center justify-center">
                      <Ban className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <span className="text-gray-400 dark:text-gray-500 text-xs font-medium">
                      No Subtitles
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Realistic dark video scene background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
                      {/* Simulated scene elements */}
                      <div className="absolute top-[12%] left-[8%] w-[35%] h-[18%] rounded-lg bg-white/[0.04]" />
                      <div className="absolute top-[10%] right-[6%] w-[22%] h-[22%] rounded-full bg-yellow-400/[0.06]" />
                      <div className="absolute bottom-[30%] left-[15%] w-[25%] h-[12%] rounded bg-white/[0.03]" />
                      <div className="absolute bottom-[35%] right-[10%] w-[30%] h-[15%] rounded-lg bg-white/[0.04]" />
                      {/* Cinematic letterbox gradient */}
                      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    </div>

                    {/* Subtitle text preview */}
                    <div className="absolute left-[6%] right-[6%] bottom-[10%] flex justify-center">
                      <p
                        className={`${style.previewStyle} max-w-full text-center whitespace-normal break-words leading-snug`}
                      >
                        The world is full of stories
                      </p>
                    </div>
                  </>
                )}

                {/* Selected checkmark badge */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#3B82F6] flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                )}

                {/* Hover overlay */}
                {!isSelected && (
                  <div className="absolute inset-0 bg-[#3B82F6]/0 group-hover:bg-[#3B82F6]/5 transition-colors duration-200" />
                )}
              </div>

              {/* Label + credits footer */}
              <div
                className={`px-4 py-3 flex items-center justify-between border-t ${
                  isSelected
                    ? "bg-[#3B82F6]/5 border-[#3B82F6]/20"
                    : "bg-gray-50 dark:bg-[#0A0A0A] border-gray-100 dark:border-[#1A1A1A]"
                }`}
              >
                <span
                  className={`text-sm font-semibold ${
                    isSelected
                      ? "text-[#3B82F6]"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
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
