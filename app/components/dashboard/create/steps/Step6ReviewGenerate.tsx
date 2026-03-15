"use client";

import { Mic, Film, Music2, Subtitles } from "lucide-react";
import type { SceneMediaOption } from "./Step2FormatStyleMedia";
import type { VoiceId } from "./Step4VoiceNarration";
import type { MusicOption } from "./Step3BackgroundMusic";
import type { SubtitleStyle } from "./Step5SubtitleSettings";

interface Step6ReviewGenerateProps {
  script: string;
  selectedVoice: VoiceId;
  sceneMedia: SceneMediaOption;
  backgroundMusic: MusicOption;
  subtitleStyle: SubtitleStyle;
  subtitlesEnabled: boolean;
  currentCredits?: number;
  onGenerate: () => void;
  isGenerating: boolean;
}

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export default function Step6ReviewGenerate({
  script,
  selectedVoice,
  sceneMedia,
  backgroundMusic,
  subtitleStyle,
  subtitlesEnabled,
  currentCredits = 0,
  onGenerate,
  isGenerating,
}: Step6ReviewGenerateProps) {
  // Mirror backend billing rules for transparent UX (backend remains source of truth)
  const COSTS = {
    BASE_PER_MINUTE: 200,
    SUBTITLE: 100,
    MUSIC: 25,
  } as const;

  // Word count & estimated duration
  const wordCount = script.trim() ? script.trim().split(/\s+/).length : 0;
  const estimatedMinutes = Math.max(1, Math.ceil(wordCount / 150));
    
  // Credit calculation
  const baseCredits = estimatedMinutes * COSTS.BASE_PER_MINUTE;
  const subtitleCredits = subtitlesEnabled && subtitleStyle !== "none" ? COSTS.SUBTITLE : 0;
  const sceneCredits =
    sceneMedia === "all-images"
      ? 0
      : sceneMedia === "first-last-scene-video"
      ? 2
      : sceneMedia === "first-scene-video" || sceneMedia === "last-scene-video"
      ? 2
      : 0;
  const musicCredits = backgroundMusic !== "no-music" ? COSTS.MUSIC : 0;
  const totalCredits = baseCredits + subtitleCredits + sceneCredits + musicCredits;
  const remainingCredits = Math.max(currentCredits - totalCredits, 0);
  const hasEnoughCredits = currentCredits >= totalCredits;
  const creditsShortage = Math.max(totalCredits - currentCredits, 0);

  // Format scene media for display
  const sceneMediaLabel =
    sceneMedia === "all-images"
      ? "Images only"
      : sceneMedia === "first-scene-video"
      ? "First only"
      : sceneMedia === "last-scene-video"
      ? "Last only"
      : "First & Last";

  const configCards = [
    {
      icon: Mic,
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
      label: "Voice",
      value: formatLabel(selectedVoice),
    },
    {
      icon: Film,
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      label: "Video Scenes",
      value: sceneMediaLabel,
    },
    {
      icon: Music2,
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      label: "Music",
      value: formatLabel(backgroundMusic),
    },
    {
      icon: Subtitles,
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      label: "Subtitles",
      value: subtitlesEnabled ? formatLabel(subtitleStyle) : "none",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Main review card */}
      <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6 space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-gray-900 dark:text-white text-lg font-bold">Review & Generate</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Confirm your settings before generating
          </p>
        </div>

        {/* Configuration Summary */}
        <div>
          <h4 className="text-gray-900 dark:text-white text-sm font-semibold mb-4">
            Configuration Summary
          </h4>

          {/* Script Preview */}
          <div className="bg-gray-50 dark:bg-[#0B0E12] border border-gray-300 dark:border-[#1A3155] rounded-xl p-4 mb-4">
            <h5 className="text-gray-900 dark:text-white text-sm font-semibold">Script Preview</h5>
            <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
              Choose how captions will appear in your video
            </p>
            <p className="text-gray-500 text-xs mt-2">
              {wordCount} words • ~{estimatedMinutes} min video
            </p>
          </div>

          {/* Config cards 2x2 grid */}
          <div className="grid grid-cols-2 gap-3">
            {configCards.map((card) => (
              <div
                key={card.label}
                className="flex items-center gap-3 bg-gray-50 dark:bg-[#0B0E12] border border-gray-300 dark:border-[#1A3155] rounded-xl p-4"
              >
                <div
                  className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center shrink-0`}
                >
                  <card.icon className={`w-4 h-4 ${card.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-900 dark:text-white text-sm font-medium">{card.label}</p>
                  <p className="text-gray-500 text-xs truncate">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Credit Usage */}
      <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-gray-900 dark:text-white text-sm font-bold">Credit Usage</h4>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-600 dark:text-gray-400 text-sm">Balance:</span>
            <span className="text-emerald-400 text-lg font-bold">{currentCredits}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              Base video ({estimatedMinutes} min)
            </span>
            <span className="text-gray-900 dark:text-white text-sm font-medium">
              +{baseCredits} credits
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400 text-sm">Subtitles</span>
            <span className="text-gray-900 dark:text-white text-sm font-medium">
              +{subtitleCredits} credits
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400 text-sm">VideoScenes</span>
            <span className="text-gray-900 dark:text-white text-sm font-medium">
              +{sceneCredits} credits
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400 text-sm">Background Music</span>
            <span className="text-gray-900 dark:text-white text-sm font-medium">
              +{musicCredits} credits
            </span>
          </div>

          <div className="border-t border-gray-200 dark:border-[#1A3155] pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Will Deduct</span>
              <span className="text-red-500 text-sm font-bold">-{totalCredits} credits</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">After Generation</span>
              <span className="text-emerald-400 text-sm font-bold">{remainingCredits} credits</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white text-sm font-bold">Total</span>
              <span className="text-[#3B82F6] text-sm font-bold">
                {totalCredits} credits
              </span>
            </div>
          </div>

          {!hasEnoughCredits && (
            <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-3 py-2">
              <p className="text-red-500 text-xs font-medium">
                Insufficient balance. You need {creditsShortage} more credits to generate this video.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating || !hasEnoughCredits}
        className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-xl transition-colors"
      >
        {isGenerating ? "Generating..." : hasEnoughCredits ? "Generate Video" : `Need ${creditsShortage} More Credits`}
      </button>
    </div>
  );
}
