"use client";

import { ArrowLeft, Check } from "lucide-react";

interface GenerationStep {
  label: string;
  completed: boolean;
  active: boolean;
}

interface GeneratingProgressProps {
  progress: number;
  steps: GenerationStep[];
  onBack: () => void;
  onNext: () => void;
}

export default function GeneratingProgress({
  progress,
  steps,
  onBack,
  onNext,
}: GeneratingProgressProps) {
  return (
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-white text-lg font-bold">Create New Video</h2>
      </div>

      {/* Generate heading */}
      <h3 className="text-white text-base font-semibold">Generate</h3>

      {/* Progress bar */}
      <div>
        <div className="relative w-full h-2 bg-[#1A2332] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#3B82F6] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
          {/* Thumb indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#3B82F6] transition-all duration-500"
            style={{ left: `calc(${progress}% - 7px)` }}
          />
        </div>
        <p className="text-gray-400 text-sm mt-2">{progress}% Completed</p>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
              step.completed
                ? "bg-[#22C55E] border-[#22C55E] text-white"
                : step.active
                ? "bg-[#0B0E12] border-[#3B82F6] text-white"
                : "bg-[#0B0E12] border-[#1A3155] text-gray-400"
            }`}
          >
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                step.completed
                  ? "bg-white/20 border-white/40"
                  : "border-gray-600 bg-transparent"
              }`}
            >
              {step.completed && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm font-medium">{step.label}</span>
          </div>
        ))}
      </div>

      {/* Completion message */}
      {progress >= 100 && (
        <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl p-4 text-center">
          <p className="text-[#22C55E] text-sm font-medium">
            Video generation complete! Review in the next step.
          </p>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={onBack}
          className="bg-[#1A2332] hover:bg-[#243044] text-white font-medium text-sm py-3 rounded-xl transition-colors border border-[#1A3155]"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-sm py-3 rounded-xl transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
