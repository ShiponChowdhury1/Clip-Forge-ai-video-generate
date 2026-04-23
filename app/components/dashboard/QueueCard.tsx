"use client";

import { useState, useEffect } from "react";
import { Loader2, Clock, Layers, Clapperboard } from "lucide-react";
import type { QueueItem } from "@/lib/redux/features/videos/videosApi";

interface QueueCardProps {
  item: QueueItem;
  position?: number;
  type: "processing" | "queued";
}

function ElapsedTimer() {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    const start = Date.now();

    const tick = () => {
      const diff = Math.max(0, Math.floor((Date.now() - start) / 1000));
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      if (h > 0) {
        setElapsed(`${h}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`);
      } else if (m > 0) {
        setElapsed(`${m}m ${s.toString().padStart(2, "0")}s`);
      } else {
        setElapsed(`${s}s`);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-[#F59E0B] font-mono text-sm font-semibold">{elapsed}</span>
  );
}

function WaitingTimer({ createdAt }: { createdAt: string }) {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    const start = new Date(createdAt).getTime();

    const tick = () => {
      const diff = Math.max(0, Math.floor((Date.now() - start) / 1000));
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      if (h > 0) {
        setElapsed(`${h}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`);
      } else if (m > 0) {
        setElapsed(`${m}m ${s.toString().padStart(2, "0")}s`);
      } else {
        setElapsed(`${s}s`);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  return (
    <span className="text-gray-400 font-mono text-sm">{elapsed}</span>
  );
}

export default function QueueCard({ item, position, type }: QueueCardProps) {
  const isProcessing = type === "processing";
  const [displayProgress, setDisplayProgress] = useState(item.progress);

  useEffect(() => {
    setDisplayProgress(item.progress);
  }, [item.id, item.progress]);

  useEffect(() => {
    if (!isProcessing) return;
    if (item.progress >= 100) {
      setDisplayProgress(100);
      return;
    }

    const targetCap = 99;
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (item.progress > prev) return item.progress;
        if (prev >= targetCap) return prev;
        return prev + 1;
      });
    }, 900);

    return () => clearInterval(interval);
  }, [isProcessing, item.progress]);

  useEffect(() => {
    if (!isProcessing) return;
    if (item.progress > displayProgress) {
      setDisplayProgress(item.progress);
    }
  }, [isProcessing, item.progress, displayProgress]);

  return (
    <div
      className={`bg-white dark:bg-[#0D1117] border rounded-2xl overflow-hidden ${
        isProcessing
          ? "border-[#F59E0B]/30"
          : "border-gray-300 dark:border-[#1A3155]"
      }`}
    >
      {/* Thumbnail area with spinner */}
      <div className="relative h-[230px] bg-gray-50 dark:bg-[#0A0E14] flex flex-col items-center justify-center gap-3">
        {isProcessing ? (
          <>
            {/* Animated spinner */}
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#1A3155] border-t-[#F59E0B] rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#F59E0B] text-xs font-bold">{displayProgress}%</span>
              </div>
            </div>
            {/* Status message */}
            <p className="text-[#F59E0B] text-xs font-medium animate-pulse">
              {item.message || "Processing..."}
            </p>
            {/* Timer */}
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
              <ElapsedTimer />
            </div>
          </>
        ) : (
          <>
            {/* Animated waiting spinner */}
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#1A3155] border-t-[#3B82F6] rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                {position !== undefined && (
                  <span className="text-[#3B82F6] text-sm font-bold">#{position}</span>
                )}
              </div>
            </div>
            {/* Status */}
            <p className="text-[#3B82F6] text-xs font-medium animate-pulse">
              Waiting in queue...
            </p>
            {/* Waiting time */}
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
              <WaitingTimer createdAt={item.created_at} />
            </div>
          </>
        )}

        {/* Processing badge */}
        {isProcessing && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-full px-2.5 py-1">
            <Loader2 className="w-3 h-3 text-[#F59E0B] animate-spin" />
            <span className="text-[#F59E0B] text-[10px] font-bold uppercase tracking-wider">
              Processing
            </span>
          </div>
        )}

        {/* Queued badge */}
        {!isProcessing && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-full px-2.5 py-1">
            <Layers className="w-3 h-3 text-[#3B82F6]" />
            <span className="text-[#3B82F6] text-[10px] font-bold uppercase tracking-wider">
              Queued
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-gray-900 dark:text-white font-semibold text-sm truncate mb-2">
          {item.video_data.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clapperboard className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-gray-500 text-xs capitalize">{item.video_data.style}</span>
          </div>
          <span className="text-gray-600 text-xs">{item.video_data.format}</span>
        </div>

        {/* Progress bar for processing */}
        {isProcessing && (
          <div className="mt-3">
            <div className="w-full h-1.5 bg-gray-200 dark:bg-[#1A2332] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#F59E0B] to-[#F97316] rounded-full transition-all duration-500"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
