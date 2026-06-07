"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Check, Loader2, AlertTriangle } from "lucide-react";

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
      setDisplayProgress(100);
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
    <div className="bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1F1F1F] rounded-2xl p-6 space-y-6">
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

      {/* Status heading */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-gray-900 dark:text-white text-base font-semibold">
            {error ? "Generation Failed" : isComplete ? "Generation Complete!" : "Generating..."}
          </h3>
          {isProcessing && <Loader2 className="w-4 h-4 text-[#3B82F6] animate-spin" />}
        </div>

        {/* Elapsed time */}
        {isProcessing && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(elapsed)} elapsed
          </span>
        )}
        {isComplete && (
          <span className="text-xs text-[#22C55E]">
            Done in {formatTime(elapsed)}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div>
        <div className="relative w-full h-2 bg-gray-200 dark:bg-[#1A2332] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              error ? "bg-[#E33629]" : isComplete ? "bg-[#22C55E]" : "bg-[#3B82F6]"
            }`}
            style={{
              width: `${roundedProgress}%`,
              transition: "width 1000ms linear",
            }}
          />
          {/* Thumb */}
          {!error && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 ${
                isComplete ? "border-[#22C55E]" : "border-[#3B82F6]"
              }`}
              style={{
                left: `calc(${roundedProgress}% - 7px)`,
                transition: "left 1000ms linear",
              }}
            />
          )}
        </div>

        {/* % text */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {roundedProgress}% Completed
          </p>
        
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-500 ${
              step.completed
                ? "bg-[#22C55E] border-[#22C55E] text-white"
                : step.active
                ? "bg-gray-50 dark:bg-[#0A0A0A] border-[#3B82F6] text-gray-900 dark:text-white"
                : "bg-gray-50 dark:bg-[#0A0A0A] border-gray-300 dark:border-[#1A3155] text-gray-600 dark:text-gray-400"
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
          <p className="text-[#22C55E] text-sm font-semibold">
            Video generation complete!
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-[#E33629]/10 border border-[#E33629]/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[#E33629] shrink-0" />
          <p className="text-[#E33629] text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={onBack}
          className="bg-[#EFF6FF] dark:bg-[#0A0A0A] hover:bg-[#DBEAFE] dark:hover:bg-[#10253F] text-[#2563EB] dark:text-[#93C5FD] font-medium text-sm py-3 rounded-xl transition-colors border border-[#BFDBFE] dark:border-[#1A3155]"
        >
          {error ? "Try Again" : "Back"}
        </button>
        <button
          onClick={onNext}
          disabled={!isComplete}
          className={`font-medium text-sm py-3 rounded-xl transition-colors ${
            isComplete
              ? "bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
              : "bg-gray-100 dark:bg-[#0A0A0A] text-gray-500 cursor-not-allowed border border-gray-300 dark:border-[#1A3155]"
          }`}
        >
          {isComplete ? "View Video" : "Generating..."}
        </button>
      </div>
    </div>
  );
}