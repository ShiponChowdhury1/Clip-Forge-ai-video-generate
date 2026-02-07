"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";

interface CreateVideoHeaderProps {
  credits?: number;
}

export default function CreateVideoHeader({
  credits = 450,
}: CreateVideoHeaderProps) {
  return (
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/logo/video.png"
            alt="Create Video"
            width={48}
            height={48}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div>
            <h1 className="text-xl font-bold text-white">Create New Video</h1>
            <p className="text-sm text-gray-400">Design your video step by step</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Credits: {credits}</span>
        </div>
      </div>
    </div>
  );
}
