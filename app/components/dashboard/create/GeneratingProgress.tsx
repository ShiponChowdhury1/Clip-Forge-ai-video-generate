"use client";

import { ArrowLeft, Check, Loader2, AlertTriangle } from "lucide-react";

interface GenerationStep {
  label: string;
  completed: boolean;
  active: boolean;
}

interface GeneratingProgressProps {
  progress: number;
  steps: GenerationStep[];
  error?: string | null;
  onBack: () => void;
  onNext: () => void;
}

export default function GeneratingProgress({
  progress,
  steps,
  error,
  onBack,
  onNext,
}: GeneratingProgressProps) {
  const isComplete = progress >= 100;
  const isProcessing = !isComplete && !error;

  return (
    <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[#3B82F6] hover:text-[#2563EB] transition-colors px-3 py-2 rounded-lg hover:bg-[#3B82F6]/8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <h2 className="text-gray-900 dark:text-white text-lg font-bold">Create New Video</h2>
      </div>

      {/* Generate heading */}
      <div className="flex items-center gap-3">
        <h3 className="text-gray-900 dark:text-white text-base font-semibold">
          {error ? "Generation Failed" : isComplete ? "Generation Complete" : "Generating..."}
        </h3>
        {isProcessing && (
          <Loader2 className="w-4 h-4 text-[#3B82F6] animate-spin" />
        )}
      </div>

      {/* Progress bar */}
      <div>
        <div className="relative w-full h-2 bg-gray-200 dark:bg-[#1A2332] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              error ? "bg-[#E33629]" : isComplete ? "bg-[#22C55E]" : "bg-[#3B82F6]"
            }`}
            style={{ width: `${progress}%` }}
          />
          {/* Thumb indicator */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 transition-all duration-1000 ease-out ${
              error ? "border-[#E33629]" : isComplete ? "border-[#22C55E]" : "border-[#3B82F6]"
            }`}
            style={{ left: `calc(${progress}% - 7px)` }}
          />
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{progress}% Completed</p>
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
                ? "bg-gray-50 dark:bg-[#0B0E12] border-[#3B82F6] text-gray-900 dark:text-white"
                : "bg-gray-50 dark:bg-[#0B0E12] border-gray-300 dark:border-[#1A3155] text-gray-600 dark:text-gray-400"
            }`}
          >
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                step.completed
                  ? "bg-white/20 border-white/40"
                  : step.active
                  ? "border-[#3B82F6] bg-transparent"
                  : "border-gray-600 bg-transparent"
              }`}
            >
              {step.completed ? (
                <Check className="w-3 h-3 text-white" />
              ) : step.active ? (
                <Loader2 className="w-3 h-3 text-[#3B82F6] animate-spin" />
              ) : null}
            </div>
            <span className="text-sm font-medium">{step.label}</span>
          </div>
        ))}
      </div>

      {/* Completion message */}
      {isComplete && (
        <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl p-4 text-center">
          <p className="text-[#22C55E] text-sm font-medium">
            Video generation complete! Review in the next step.
          </p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-[#E33629]/10 border border-[#E33629]/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[#E33629] shrink-0" />
          <p className="text-[#E33629] text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={onBack}
          className="bg-[#EFF6FF] dark:bg-[#0B1D33] hover:bg-[#DBEAFE] dark:hover:bg-[#10253F] text-[#2563EB] dark:text-[#93C5FD] font-medium text-sm py-3 rounded-xl transition-colors border border-[#BFDBFE] dark:border-[#1A3155]"
        >
          {error ? "Try Again" : "Back"}
        </button>
        <button
          onClick={onNext}
          disabled={!isComplete}
          className={`font-medium text-sm py-3 rounded-xl transition-colors ${
            isComplete
              ? "bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
              : "bg-gray-100 dark:bg-[#1A2332] text-gray-500 cursor-not-allowed border border-gray-300 dark:border-[#1A3155]"
          }`}
        >
          {isComplete ? "View Video" : "Generating..."}
        </button>
      </div>
    </div>
  );
}
