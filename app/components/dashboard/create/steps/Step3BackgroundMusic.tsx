"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useGetMusicQuery } from "@/lib/redux/features/videos/videosApi";

export type MusicOption = string;

interface Step3BackgroundMusicProps {
  backgroundMusic: MusicOption;
  setBackgroundMusic: (value: MusicOption) => void;
}

const colorPalette = [
  "bg-amber-400",
  "bg-emerald-400",
  "bg-cyan-400",
  "bg-blue-500",
  "bg-fuchsia-500",
  "bg-rose-400",
  "bg-violet-500",
  "bg-orange-400",
  "bg-teal-400",
  "bg-indigo-500",
];

// All local music files in public/music/
const localMusicFiles = [
  "/music/Cinematic-Documentary.mp3",
  "/music/Dark-Mystery-Pulse.mp3",
  "/music/Motivational-Rise.mp3",
  "/music/Calm-Ambient-Flow.mp3",
  "/music/Modern-Tech-Energy.mp3",
  "/music/Light-Playful.mp3",
  "/music/Epic-Build.mp3",
  "/music/Minimal-Corporate.mp3",
  "/music/Emotional-Reflection.mp3",
  "/music/Elegant-Escape.mp3",
];

// Normalize a string for matching: lowercase, remove special chars
function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Find matching local file for an API music name
function findMusicFile(apiName: string): string | undefined {
  const norm = normalize(apiName);
  return localMusicFiles.find((f) => {
    const namepart = f.replace("/music/", "").replace(".mp3", "");
    return normalize(namepart).includes(norm) || norm.includes(normalize(namepart));
  });
}

export default function Step3BackgroundMusic({
  backgroundMusic,
  setBackgroundMusic,
}: Step3BackgroundMusicProps) {
  const { data: musicList = [], isLoading } = useGetMusicQuery({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlay = (value: string, name: string) => {
    // If same track is playing, pause it
    if (playingId === value) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      setPlayingId(null);
      return;
    }

    // Stop current audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    const src = findMusicFile(name);
    if (!src) return;

    const audio = new Audio(src);
    audio.onended = () => {
      setPlayingId(null);
      audioRef.current = null;
    };
    audio.play();
    audioRef.current = audio;
    setPlayingId(value);
  };

  const musicOptions = [
    {
      value: "no-music",
      label: "No Music",
      tag: "None",
      description: "Generate video without background music",
      color: "bg-amber-400",
      hasPreview: false,
    },
    ...musicList.map((item, index) => ({
      value: String(item.id),
      label: item.name,
      tag: item.category,
      description: item.file_path,
      color: colorPalette[(index + 1) % colorPalette.length],
      hasPreview: true,
    })),
  ];

  return (
    <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6 space-y-8">
      {/* Background Music */}
      <div>
        <h3 className="text-gray-900 dark:text-white text-base font-semibold mb-4">
          Background Music
        </h3>
        {isLoading ? (
          <div className="text-gray-600 dark:text-gray-400 text-sm py-4 text-center">Loading music...</div>
        ) : (
        <div className="space-y-2">
          {musicOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setBackgroundMusic(option.value);
                if (option.hasPreview) {
                  handlePlay(option.value, option.label);
                }
              }}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                backgroundMusic === option.value
                  ? "border-[#3B82F6] bg-blue-50 dark:bg-[#3B82F6]/5"
                  : "border-gray-300 dark:border-[#1A3155] bg-gray-50 dark:bg-[#0B0E12] hover:border-blue-300 dark:hover:border-[#2A4A7A]"
              }`}
            >
              {/* Color indicator */}
              <div
                className={`w-10 h-10 rounded-lg ${option.color} shrink-0`}
              />

              {/* Info */}
              <div className="flex-1 text-left">
                <span className="text-gray-900 dark:text-white text-sm font-medium">
                  {option.label}
                </span>
              </div>

              {/* Right side - play/pause icon */}
              {option.hasPreview ? (
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    playingId === option.value
                      ? "bg-[#3B82F6]/20 border border-[#3B82F6]"
                      : "bg-gray-100 dark:bg-[#1A2332] border border-gray-300 dark:border-[#1A3155]"
                  }`}
                >
                  {playingId === option.value ? (
                    <Pause className="w-3 h-3 text-[#3B82F6]" />
                  ) : (
                    <Play className="w-3 h-3 text-gray-400 ml-0.5" />
                  )}
                </div>
              ) : null}
            </button>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
