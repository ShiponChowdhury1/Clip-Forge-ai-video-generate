"use client";

import { Sparkles } from "lucide-react";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import { useState } from "react";

export default function CreateVideoPage() {
  const [script, setScript] = useState("");
  const [voiceStyle, setVoiceStyle] = useState("Natural");
  const [visualStyle, setVisualStyle] = useState("Cinematic");
  const [musicStyle, setMusicStyle] = useState("None");

  return (
    <div>
      {/* Header - Reusable */}
      <DashboardHeader
        icon={
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        }
        title="Create New Video"
        description="Generate AI-powered videos from your script"
        showCreateButton={false}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Script Input */}
        <div className="lg:col-span-2">
          <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6">
            <label className="block text-white text-sm font-semibold mb-3">
              Your Script
            </label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Paste your script here or describe what you want to create..."
              rows={12}
              className="w-full bg-[#0B0E12] border border-[#1A3155] rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors resize-none"
            />
            <div className="flex justify-between items-center mt-3">
              <p className="text-gray-500 text-xs">
                {script.length} characters
              </p>
              <button className="text-[#3B82F6] text-sm font-medium hover:text-[#60A5FA] transition-colors">
                Generate with AI
              </button>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          {/* Voice Style */}
          <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6">
            <label className="block text-white text-sm font-semibold mb-3">
              Voice Style
            </label>
            <select
              value={voiceStyle}
              onChange={(e) => setVoiceStyle(e.target.value)}
              className="w-full bg-[#0B0E12] border border-[#1A3155] rounded-lg px-4 py-3 text-white text-sm focus:border-[#3B82F6] focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="Natural">Natural</option>
              <option value="Professional">Professional</option>
              <option value="Energetic">Energetic</option>
              <option value="Calm">Calm</option>
            </select>
          </div>

          {/* Visual Style */}
          <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6">
            <label className="block text-white text-sm font-semibold mb-3">
              Visual Style
            </label>
            <select
              value={visualStyle}
              onChange={(e) => setVisualStyle(e.target.value)}
              className="w-full bg-[#0B0E12] border border-[#1A3155] rounded-lg px-4 py-3 text-white text-sm focus:border-[#3B82F6] focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="Cinematic">Cinematic</option>
              <option value="Anime">Anime</option>
              <option value="Realistic">Realistic</option>
              <option value="Cartoon">Cartoon</option>
            </select>
          </div>

          {/* Music */}
          <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6">
            <label className="block text-white text-sm font-semibold mb-3">
              Background Music
            </label>
            <select
              value={musicStyle}
              onChange={(e) => setMusicStyle(e.target.value)}
              className="w-full bg-[#0B0E12] border border-[#1A3155] rounded-lg px-4 py-3 text-white text-sm focus:border-[#3B82F6] focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="None">None</option>
              <option value="Upbeat">Upbeat</option>
              <option value="Dramatic">Dramatic</option>
              <option value="Relaxing">Relaxing</option>
            </select>
          </div>

          {/* Generate Button */}
          <button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm">
            <Sparkles className="w-4 h-4" />
            Generate Video
          </button>
        </div>
      </div>
    </div>
  );
}
