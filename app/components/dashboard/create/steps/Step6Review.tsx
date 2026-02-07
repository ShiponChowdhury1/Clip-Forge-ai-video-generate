"use client";

import { Mic, Film, Music2, Subtitles } from "lucide-react";
import type { SceneMediaOption } from "./Step1VideoDetails";
import type { VoiceId } from "./Step3VoiceScript";
import type { MusicOption } from "./Step4MusicFormat";
import type { SubtitleStyle } from "./Step5Subtitles";

interface Step6ReviewProps {
  script: string;
  selectedVoice: VoiceId;
  sceneMedia: SceneMediaOption;
  backgroundMusic: MusicOption;
  subtitleStyle: SubtitleStyle;
  subtitlesEnabled: boolean;
  onGenerate: () => void;
  isGenerating: boolean;
}

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export default function Step6Review({
  script,
  selectedVoice,
  sceneMedia,
  backgroundMusic,
  subtitleStyle,
  subtitlesEnabled,
  onGenerate,
  isGenerating,
}: Step6ReviewProps) {
  // Word count & estimated duration
  const wordCount = script.trim() ? script.trim().split(/\s+/).length : 0;
  const estimatedMinutes = Math.max(1, Math.ceil(wordCount / 150));

  // Credit calculation
  const baseCredits = 1;
  const subtitleCredits = subtitlesEnabled && subtitleStyle !== "none" ? 1 : 0;
  const sceneCredits =
    sceneMedia === "all-images"
      ? 0
      : sceneMedia === "first-last-scene-video"
      ? 2
      : sceneMedia === "first-scene-video" || sceneMedia === "last-scene-video"
      ? 2
      : 0;
  const totalCredits = baseCredits + subtitleCredits + sceneCredits;

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
      <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-white text-lg font-bold">Review & Generate</h3>
          <p className="text-gray-400 text-sm mt-1">
            Confirm your settings before generating
          </p>
        </div>

        {/* Configuration Summary */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-4">
            Configuration Summary
          </h4>

          {/* Script Preview */}
          <div className="bg-[#0B0E12] border border-[#1A3155] rounded-xl p-4 mb-4">
            <h5 className="text-white text-sm font-semibold">Script Preview</h5>
            <p className="text-gray-400 text-xs mt-1">
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
                className="flex items-center gap-3 bg-[#0B0E12] border border-[#1A3155] rounded-xl p-4"
              >
                <div
                  className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center shrink-0`}
                >
                  <card.icon className={`w-4 h-4 ${card.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium">{card.label}</p>
                  <p className="text-gray-500 text-xs truncate">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Credit Usage */}
      <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white text-sm font-bold">Credit Usage</h4>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 text-sm">Balance:</span>
            <span className="text-emerald-400 text-lg font-bold">127</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">
              Base video ({estimatedMinutes} min)
            </span>
            <span className="text-white text-sm font-medium">
              +{baseCredits} credit
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Subtitles</span>
            <span className="text-white text-sm font-medium">
              +{subtitleCredits} credit
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">VideoScenes</span>
            <span className="text-white text-sm font-medium">
              +{sceneCredits} credits
            </span>
          </div>

          <div className="border-t border-[#1A3155] pt-3">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-bold">Total</span>
              <span className="text-[#3B82F6] text-sm font-bold">
                {totalCredits} credits
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-xl transition-colors"
      >
        {isGenerating ? "Generating..." : "Generate Video"}
      </button>
    </div>
  );
}
