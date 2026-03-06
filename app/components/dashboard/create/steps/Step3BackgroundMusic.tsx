"use client";

import { useRef, useState } from "react";
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

// Map API music names to local public/music/ file names
const musicFileMap: Record<string, string> = {
  "Cinematic Documentary": "/music/1. Cinematic Documentary.mp3",
  "Dark Mystery Pulse": "/music/2. Dark Mystery Pulse.mp3",
  "Motivational Rise": "/music/3. Motivational Rise.mp3",
  "Calm Ambient Flow": "/music/4. Calm Ambient Flow.mp3",
  "Modern Tech Energy": "/music/5. Modern Tech Energy.mp3",
  "Light & Playful": "/music/6. Light _ Playful.mp3",
  "Light _ Playful": "/music/6. Light _ Playful.mp3",
  "Epic Build (Short)": "/music/7. Epic Build (Short).mp3",
  "Minimal Corporate": "/music/8. Minimal Corporate.mp3",
  "Emotional Reflection": "/music/9. Emotional Reflection.mp3",
  "Elegant Escape": "/music/10. Elegant Escape.mp3",
};

export default function Step3BackgroundMusic({
  backgroundMusic,
  setBackgroundMusic,
}: Step3BackgroundMusicProps) {
  const { data: musicList = [], isLoading } = useGetMusicQuery({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlay = (value: string, name: string) => {
    // If same track is playing, pause it
    if (playingId === value) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const src = musicFileMap[name];
    if (!src) return;

    const audio = new Audio(src);
    audio.onended = () => setPlayingId(null);
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
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 space-y-8">
      {/* Background Music */}
      <div>
        <h3 className="text-white text-base font-semibold mb-4">
          Background Music
        </h3>
        {isLoading ? (
          <div className="text-gray-400 text-sm py-4 text-center">Loading music...</div>
        ) : (
        <div className="space-y-2">
          {musicOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setBackgroundMusic(option.value)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                backgroundMusic === option.value
                  ? "border-[#3B82F6] bg-[#3B82F6]/5"
                  : "border-[#1A3155] bg-[#0B0E12] hover:border-[#2A4A7A]"
              }`}
            >
              {/* Color indicator */}
              <div
                className={`w-10 h-10 rounded-lg ${option.color} shrink-0`}
              />

              {/* Info */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">
                    {option.label}
                  </span>
                  <span className="px-2 py-0.5 bg-[#1A2332] text-gray-400 text-[10px] font-medium rounded-md border border-[#1A3155]">
                    {option.tag}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">
                  {option.description}
                </p>
              </div>

              {/* Right side - selected dot or play button */}
              {backgroundMusic === option.value ? (
                <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shrink-0" />
              ) : option.hasPreview ? (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlay(option.value, option.label);
                  }}
                  className="w-8 h-8 rounded-full bg-[#1A2332] border border-[#1A3155] flex items-center justify-center shrink-0 hover:bg-[#243044] transition-colors"
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
