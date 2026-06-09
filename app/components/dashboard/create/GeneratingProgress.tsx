"use client";

import { useEffect, useState, useRef } from "react";
import { Check, Loader2, AlertTriangle, Video, Sparkles, Eye, RotateCcw } from "lucide-react";

interface GenerationStep {
  label: string;
  completed: boolean;
  active: boolean;
}

interface GeneratingProgressProps {
  progress: number;         // backend progress (100 = done)
  steps: GenerationStep[];
  error?: string | null;
  onBack: () => void;
  onNext: () => void;
}

// Hybrid speed config
// 0–50%  : fast phase  → reaches 50% in FAST_SECONDS
// 50–99% : slow phase  → crawls to 99%, waits for backend
const FAST_SECONDS = 60;  // 0→50% in 60s
const SLOW_SECONDS = 600; // 50→99% over 600s (10 min buffer)

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m > 0 ? `${m}:${String(sec).padStart(2, "0")}` : `${sec}s`;
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

  const [displayProgress, setDisplayProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isProcessing) return;

    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
      setDisplayProgress((prev) => {
        if (prev < 50) {
          // Fast phase: 0→50% in FAST_SECONDS
          return Math.min(prev + (50 / FAST_SECONDS), 50);
        } else {
          // Slow phase: 50→99% over SLOW_SECONDS
          return Math.min(prev + (49 / SLOW_SECONDS), 99);
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isProcessing]);

  // Backend confirmed complete → jump to 100%
  useEffect(() => {
    if (isComplete) {
      if (timerRef.current) clearInterval(timerRef.current);
      const frame = requestAnimationFrame(() => setDisplayProgress(100));
      return () => cancelAnimationFrame(frame);
    }
  }, [isComplete]);

  // Error → stop counter
  useEffect(() => {
    if (error && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [error]);

  const roundedProgress = Math.floor(displayProgress);

  return (
    <div className="w-full">
      {/* Header — full width, matches CreateVideoHeader */}
      <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1F1F1F] rounded-2xl p-6 mb-6 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm ${
              error ? "bg-[#E33629] shadow-red-500/20" : isComplete ? "bg-[#22C55E] shadow-green-500/20" : "bg-[#3B82F6] shadow-cyan-500/20"
            }`}>
              {error ? (
                <AlertTriangle className="h-6 w-6" />
              ) : isComplete ? (
                <Check className="h-6 w-6" />
              ) : (
                <Video className="h-6 w-6" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {error ? "Generation Failed" : isComplete ? "Video Ready!" : "Creating Your Video"}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {error ? "Something went wrong during generation" : isComplete ? "Your video has been generated successfully" : "Please wait while we craft your video"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>
              {isProcessing && `${formatTime(elapsed)} elapsed`}
              {isComplete && `Done in ${formatTime(elapsed)}`}
              {error && "Stopped"}
            </span>
          </div>
        </div>
      </div>

      {/* Content — constrained like other steps */}
      <div className="w-full max-w-277 mx-auto">
      <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1F1F1F] rounded-2xl p-6 space-y-6">

        {/* Progress bar section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-gray-900 dark:text-white text-sm font-semibold">
              Progress
            </p>
            <span className={`text-sm font-bold tabular-nums ${
              error ? "text-[#E33629]" : isComplete ? "text-[#22C55E]" : "text-[#3B82F6]"
            }`}>
              {roundedProgress}%
            </span>
          </div>

          <div className="relative w-full h-2.5 bg-gray-100 dark:bg-[#111111] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                error ? "bg-[#E33629]" : isComplete ? "bg-[#22C55E]" : "bg-gradient-to-r from-[#2563EB] to-[#3B82F6]"
              }`}
              style={{
                width: `${roundedProgress}%`,
                transition: "width 1000ms linear",
              }}
            />
            {/* Animated shimmer on processing */}
            {isProcessing && (
              <div
                className="absolute top-0 h-full w-1/3 rounded-full"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                  animation: "shimmer 2s infinite",
                  left: `${Math.max(0, roundedProgress - 33)}%`,
                }}
              />
            )}
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-xs">
            {error ? "Generation stopped due to an error" : isComplete ? "All steps completed successfully" : "This may take a few minutes..."}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-2.5">
          <p className="text-gray-900 dark:text-white text-sm font-semibold">Steps</p>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl border transition-all duration-500 ${
                  step.completed
                    ? "bg-[#22C55E]/5 border-[#22C55E]/20"
                    : step.active
                    ? "bg-[#3B82F6]/5 border-[#3B82F6]/30"
                    : "bg-gray-50 dark:bg-[#111111] border-gray-200 dark:border-[#1F1F1F]"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    step.completed
                      ? "bg-[#22C55E] text-white"
                      : step.active
                      ? "bg-[#3B82F6]/10 border border-[#3B82F6]/30"
                      : "bg-gray-100 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#1F1F1F]"
                  }`}
                >
                  {step.completed ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : step.active ? (
                    <Loader2 className="w-3.5 h-3.5 text-[#3B82F6] animate-spin" />
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 text-[11px] font-semibold">
                      {index + 1}
                    </span>
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  step.completed
                    ? "text-[#22C55E]"
                    : step.active
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-400 dark:text-gray-500"
                }`}>
                  {step.label}
                </span>
                {step.completed && (
                  <span className="ml-auto text-[10px] font-semibold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full">
                    Done
                  </span>
                )}
                {step.active && (
                  <span className="ml-auto text-[10px] font-semibold text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded-full animate-pulse">
                    In Progress
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Completion message */}
        {isComplete && (
          <div className="bg-[#22C55E]/5 border border-[#22C55E]/20 rounded-xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-[#22C55E]" />
            </div>
            <div>
              <p className="text-[#22C55E] text-sm font-semibold">
                Video generation complete!
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                Your video is ready to preview and download.
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-[#E33629]/5 border border-[#E33629]/20 rounded-xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#E33629]/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-[#E33629]" />
            </div>
            <div>
              <p className="text-[#E33629] text-sm font-semibold">Generation Failed</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation — matches StepNavigation style */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#3B82F6] hover:text-[#2563EB] font-medium text-sm py-3 px-5 rounded-xl transition-colors hover:bg-[#3B82F6]/5"
        >
          <RotateCcw className="w-4 h-4" />
          {error ? "Try Again" : "Create New Video"}
        </button>
        <button
          onClick={onNext}
          disabled={!isComplete}
          className={`flex items-center gap-2 font-medium text-sm py-3 px-8 rounded-xl transition-all ${
            isComplete
              ? "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
              : "bg-gray-100 dark:bg-[#111111] text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-[#1F1F1F]"
          }`}
        >
          {isComplete ? (
            <>
              <Eye className="w-4 h-4" />
              View Video
            </>
          ) : (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          )}
        </button>
      </div>
      </div>
    </div>
  );
}