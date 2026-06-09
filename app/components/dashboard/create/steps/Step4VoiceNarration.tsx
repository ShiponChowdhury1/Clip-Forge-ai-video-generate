"use client";

import { useCallback, useEffect, useRef, useState } from "react";
// Use native <img> for local voice assets to avoid Next.js image optimizer URLs
import { Check, Volume2 } from "lucide-react";
import { voices } from "@/app/data/createVideoOptions";
import type { VoiceId } from "@/types/createVideo";

interface Step4VoiceNarrationProps {
  selectedVoice: VoiceId;
  setSelectedVoice: (value: VoiceId) => void;
}

export default function Step4VoiceNarration({
  selectedVoice,
  setSelectedVoice,
}: Step4VoiceNarrationProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<VoiceId | null>(null);

  const handleVoiceSelect = (voice: { id: VoiceId; name: string }) => {
    setSelectedVoice(voice.id);
    handlePlayPreview(voice.id, voice.name);
  };

  const stopPreview = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.onended = null;
    audioRef.current = null;
    setPlayingVoiceId(null);
  }, []);

  const getPreviewSrc = (name: string) => {
    const fileName = `Voice Sample - ${name}.mp3`;
    return `/voice/${encodeURIComponent(fileName)}`;
  };

  const handlePlayPreview = async (voiceId: VoiceId, voiceName: string) => {
    if (playingVoiceId === voiceId) {
      stopPreview();
      return;
    }

    stopPreview();

    const audio = new Audio(getPreviewSrc(voiceName));
    audioRef.current = audio;
    setPlayingVoiceId(voiceId);

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
        setPlayingVoiceId(null);
      }
    };

    try {
      await audio.play();
    } catch {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }
      setPlayingVoiceId(null);
    }
  };

  useEffect(() => {
    return () => {
      stopPreview();
    };
  }, [stopPreview]);

  return (
    <div className="bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1F1F1F] rounded-2xl p-6 space-y-8">
      {/* Voice Type */}
      <div>
        <h3 className="text-gray-900 dark:text-white text-lg font-semibold mb-5">Voice Type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {voices.map((voice) => (
            <div
              key={voice.id}
              role="button"
              tabIndex={0}
              onClick={() => handleVoiceSelect(voice)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleVoiceSelect(voice);
                }
              }}
              className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all text-left cursor-pointer outline-none ${
                selectedVoice === voice.id
                  ? "border-[#3B82F6] bg-blue-50 dark:bg-[#3B82F6]/5"
                  : "border-gray-200 dark:border-[#1F1F1F] bg-gray-50 dark:bg-[#0A0A0A] hover:border-blue-300 dark:hover:border-[#2A4A7A]"
              }`}
            >
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 self-center">
                <img
                  src={voice.image}
                  alt={voice.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    try {
                      (e.target as HTMLImageElement).src = "/logo/video.png";
                    } catch {}
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 pr-6">
                <p className="text-gray-900 dark:text-white text-xs font-semibold leading-tight">
                  {voice.name} - {voice.description}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <img
                    src={voice.flag}
                    alt={voice.accent}
                    width={32}
                    height={32}
                    className="shrink-0"
                    onError={(e) => {
                      try {
                        (e.target as HTMLImageElement).src = "/logo/video.png";
                      } catch {}
                    }}
                  />
                  <span className="text-gray-500 text-[10px]">
                    {voice.accent}
                  </span>
                </div>
                <p className="text-gray-500 text-[10px] mt-1">
                  {voice.category}
                </p>
              </div>

              {selectedVoice === voice.id ? (
                <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-[#3B82F6] px-2 py-1 text-[10px] font-semibold text-white">
                  <Check className="w-3 h-3" />
                  Selected
                </div>
              ) : null}

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handlePlayPreview(voice.id, voice.name);
                }}
                aria-label={`Play ${voice.name} voice sample`}
                className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-[#1A3155] transition-colors shrink-0 self-center"
              >
                <Volume2
                  className={`w-4 h-4 ${
                    playingVoiceId === voice.id ? "text-green-500" : "text-[#3B82F6]"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
