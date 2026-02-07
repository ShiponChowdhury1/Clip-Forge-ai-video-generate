"use client";

import { Play, Volume2 } from "lucide-react";

export type VoiceOption =
  | "alex-male"
  | "sarah-female"
  | "james-male"
  | "emma-female"
  | "david-male";

export type VoiceLanguage = "english" | "spanish" | "french" | "german" | "japanese";

interface Step3VoiceOverProps {
  voice: VoiceOption;
  setVoice: (value: VoiceOption) => void;
  language: VoiceLanguage;
  setLanguage: (value: VoiceLanguage) => void;
  voiceSpeed: number;
  setVoiceSpeed: (value: number) => void;
}

const voiceOptions: {
  value: VoiceOption;
  name: string;
  gender: string;
  description: string;
  color: string;
}[] = [
  {
    value: "alex-male",
    name: "Alex",
    gender: "Male",
    description: "Deep and professional voice",
    color: "bg-blue-500",
  },
  {
    value: "sarah-female",
    name: "Sarah",
    gender: "Female",
    description: "Warm and friendly tone",
    color: "bg-pink-500",
  },
  {
    value: "james-male",
    name: "James",
    gender: "Male",
    description: "Energetic narrator voice",
    color: "bg-emerald-500",
  },
  {
    value: "emma-female",
    name: "Emma",
    gender: "Female",
    description: "Calm and soothing voice",
    color: "bg-purple-500",
  },
  {
    value: "david-male",
    name: "David",
    gender: "Male",
    description: "Authoritative and clear",
    color: "bg-amber-500",
  },
];

const languageOptions: { value: VoiceLanguage; label: string; flag: string }[] = [
  { value: "english", label: "English", flag: "🇺🇸" },
  { value: "spanish", label: "Spanish", flag: "🇪🇸" },
  { value: "french", label: "French", flag: "🇫🇷" },
  { value: "german", label: "German", flag: "🇩🇪" },
  { value: "japanese", label: "Japanese", flag: "🇯🇵" },
];

export default function Step3VoiceOver({
  voice,
  setVoice,
  language,
  setLanguage,
  voiceSpeed,
  setVoiceSpeed,
}: Step3VoiceOverProps) {
  return (
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 space-y-8">
      {/* Voice Selection */}
      <div>
        <h3 className="text-white text-base font-semibold mb-4">
          Select Voice
        </h3>
        <div className="space-y-2">
          {voiceOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setVoice(option.value)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                voice === option.value
                  ? "border-[#3B82F6] bg-[#3B82F6]/5"
                  : "border-[#1A3155] bg-[#0B0E12] hover:border-[#2A4A7A]"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full ${option.color} flex items-center justify-center shrink-0`}
              >
                <Volume2 className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">
                    {option.name}
                  </span>
                  <span className="px-2 py-0.5 bg-[#1A2332] text-gray-400 text-[10px] font-medium rounded-md border border-[#1A3155]">
                    {option.gender}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">
                  {option.description}
                </p>
              </div>
              {voice === option.value ? (
                <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#1A2332] border border-[#1A3155] flex items-center justify-center shrink-0 hover:bg-[#243044] transition-colors">
                  <Play className="w-3 h-3 text-gray-400 ml-0.5" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <h3 className="text-white text-base font-semibold mb-4">Language</h3>
        <div className="flex flex-wrap gap-2">
          {languageOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setLanguage(option.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm ${
                language === option.value
                  ? "border-[#3B82F6] bg-[#3B82F6]/5 text-white"
                  : "border-[#1A3155] bg-[#0B0E12] text-gray-400 hover:border-[#2A4A7A]"
              }`}
            >
              <span>{option.flag}</span>
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Voice Speed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-base font-semibold">Voice Speed</h3>
          <span className="text-[#3B82F6] text-sm font-medium">{voiceSpeed}x</span>
        </div>
        <input
          type="range"
          min={0.5}
          max={2}
          step={0.1}
          value={voiceSpeed}
          onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-[#1A2332] rounded-full appearance-none cursor-pointer accent-[#3B82F6] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#3B82F6] [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <div className="flex justify-between mt-2">
          <span className="text-gray-500 text-xs">0.5x</span>
          <span className="text-gray-500 text-xs">1.0x</span>
          <span className="text-gray-500 text-xs">1.5x</span>
          <span className="text-gray-500 text-xs">2.0x</span>
        </div>
      </div>
    </div>
  );
}
