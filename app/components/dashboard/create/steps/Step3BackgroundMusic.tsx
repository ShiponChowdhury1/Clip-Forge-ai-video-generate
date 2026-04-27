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

const MUSIC_CREDIT_COST = 25;

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
  const { data: musicList = [], isLoading, isError } = useGetMusicQuery({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    if (backgroundMusic === "no-music") return;
    const selectedId = Number(backgroundMusic);
    if (!Number.isFinite(selectedId)) {
      setBackgroundMusic("no-music");
      return;
    }
    const exists = musicList.some((item) => item.id === selectedId);
    if (!exists) {
      setBackgroundMusic("no-music");
    }
  }, [backgroundMusic, musicList, setBackgroundMusic]);

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

  const handleSelectOption = (option: {
    value: string;
    label: string;
    hasPreview: boolean;
  }) => {
    if (option.value === "no-music") {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      setPlayingId(null);
      setBackgroundMusic(option.value);
      return;
    }

    setBackgroundMusic(option.value);
    if (option.hasPreview) {
      handlePlay(option.value, option.label);
    }
  };

  const musicOptions = [
    {
      value: "no-music",
      label: "No Music",
      tag: "None",
      description: "Generate video without background music",
      color: "bg-amber-400",
      hasPreview: false,
      credits: 0,
    },
    ...musicList.map((item, index) => ({
      value: String(item.id),
      label: item.name,
      tag: item.category,
      description: item.file_path,
      color: colorPalette[(index + 1) % colorPalette.length],
      hasPreview: true,
      credits: MUSIC_CREDIT_COST,
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
        ) : isError ? (
          <div className="text-red-500 text-sm py-4 text-center">Failed to load music options. Please try again.</div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {musicOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelectOption(option)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                option.value === "no-music" ? "sm:col-span-2" : ""
              } ${
                backgroundMusic === option.value
                  ? "border-[#3B82F6] bg-blue-50 dark:bg-[#3B82F6]/5"
                  : "border-gray-300 dark:border-[#1A3155] bg-gray-50 dark:bg-[#0B0E12] hover:border-blue-300 dark:hover:border-[#2A4A7A]"
              }`}
            >
              <div className="w-full min-w-0">
                {/* Mobile: two-line layout */}
                <div className="sm:hidden">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-lg ${option.color} shrink-0`}
                    />
                    <span className="text-gray-900 dark:text-white text-sm font-medium truncate">
                      {option.label}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-md border shrink-0 ${
                        option.credits > 0
                          ? "text-[#3B82F6] border-[#3B82F6]/40 bg-[#3B82F6]/10"
                          : "text-gray-500 border-gray-300 dark:border-[#1A3155] bg-gray-100 dark:bg-[#1A2332]"
                      }`}
                    >
                      {option.credits > 0 ? `+${option.credits} credits` : "0 credits"}
                    </span>
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
                  </div>
                </div>

                {/* Tablet/Laptop/Desktop: previous single-line layout */}
                <div className="hidden sm:flex sm:items-center sm:gap-4 sm:w-full">
                  <div
                    className={`w-10 h-10 rounded-lg ${option.color} shrink-0`}
                  />

                  <div className="flex-1 text-left min-w-0">
                    <span className="text-gray-900 dark:text-white text-sm font-medium truncate block">
                      {option.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-md border ${
                        option.credits > 0
                          ? "text-[#3B82F6] border-[#3B82F6]/40 bg-[#3B82F6]/10"
                          : "text-gray-500 border-gray-300 dark:border-[#1A3155] bg-gray-100 dark:bg-[#1A2332]"
                      }`}
                    >
                      {option.credits > 0 ? `+${option.credits} credits` : "0 credits"}
                    </span>
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
                  </div>
                </div>
              </div>
            </button>
          ))}
          {musicList.length === 0 && (
            <p className="col-span-full text-gray-500 dark:text-gray-400 text-xs text-center pt-2">
              Music library is empty on backend right now. You can continue with &quot;No Music&quot;.
            </p>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
