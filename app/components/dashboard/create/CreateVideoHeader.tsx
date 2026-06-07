"use client";
import { Sparkles, Video } from "lucide-react";

interface CreateVideoHeaderProps {
  credits?: number;
}

export default function CreateVideoHeader({
  credits = 450,
}: CreateVideoHeaderProps) {
  return (
    <div className="bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1F1F1F] rounded-2xl p-6 mb-6 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B82F6] text-white shadow-sm shadow-cyan-500/20">
            <Video className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Create New Video</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Design your video step by step</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Credits: {credits}</span>
        </div>
      </div>
    </div>
  );
}
