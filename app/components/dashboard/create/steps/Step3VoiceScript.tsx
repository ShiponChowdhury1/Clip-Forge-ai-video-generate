"use client";

import Image from "next/image";
import { Volume2 } from "lucide-react";

export type VoiceId =
  | "hope"
  | "cassidy"
  | "lana"
  | "brian"
  | "peter"
  | "adam"
  | "alex"
  | "finn"
  | "amelia"
  | "jane"
  | "edward"
  | "archie";

interface Step3VoiceScriptProps {
  selectedVoice: VoiceId;
  setSelectedVoice: (value: VoiceId) => void;
  script: string;
  setScript: (value: string) => void;
}

const voices: {
  id: VoiceId;
  name: string;
  description: string;
  accent: string;
  flag: string;
  category: string;
  image: string;
}[] = [
  {
    id: "hope",
    name: "Hope",
    description: "Upbeat and Clear",
    accent: "American",
    flag: "/flags/american.svg",
    category: "Social Media",
    image: "/voice-type/hope.png",
  },
  {
    id: "cassidy",
    name: "Cassidy",
    description: "Crisp, Direct and Clear",
    accent: "American",
    flag: "/flags/american.svg",
    category: "Conversational",
    image: "/voice-type/cassidy.png",
  },
  {
    id: "lana",
    name: "Lana",
    description: "Upbeat, Friendly and Sweet",
    accent: "American",
    flag: "/flags/american.svg",
    category: "Conversational",
    image: "/voice-type/lana.png",
  },
  {
    id: "brian",
    name: "Brian",
    description: "Clean, Professional and Balanced",
    accent: "American",
    flag: "/flags/american.svg",
    category: "Narrative & Story",
    image: "/voice-type/brian.png",
  },
  {
    id: "peter",
    name: "Peter",
    description: "Calm, Deep and Warm",
    accent: "American",
    flag: "/flags/american.svg",
    category: "Narrative & Story",
    image: "/voice-type/peter.png",
  },
  {
    id: "adam",
    name: "Adam",
    description: "Dominant Firm",
    accent: "American",
    flag: "/flags/american.svg",
    category: "Social Media",
    image: "/voice-type/adam.png",
  },
  {
    id: "alex",
    name: "Alex",
    description: "Upbeat, Energetic and Clear",
    accent: "American",
    flag: "/flags/american.svg",
    category: "Entertainment & TV",
    image: "/voice-type/alex.png",
  },
  {
    id: "finn",
    name: "Finn",
    description: "Youthful Eager and Energetic",
    accent: "American",
    flag: "/flags/american.svg",
    category: "Conversational",
    image: "/voice-type/finn.png",
  },
  {
    id: "amelia",
    name: "Amelia",
    description: "Enthusiastic and Expressive",
    accent: "British",
    flag: "/flags/britain.svg",
    category: "Narrative & Story",
    image: "/voice-type/amelia.png",
  },
  {
    id: "jane",
    name: "Jane",
    description: "Professional Audiobook Reader",
    accent: "British",
    flag: "/flags/britain.svg",
    category: "Social Media",
    image: "/voice-type/jane.png",
  },
  {
    id: "edward",
    name: "Edward",
    description: "Dark Seductive Low",
    accent: "British",
    flag: "/flags/britain.svg",
    category: "Characters & Animation",
    image: "/voice-type/edward.png",
  },
  {
    id: "archie",
    name: "Archie",
    description: "Social Media Narrator",
    accent: "British",
    flag: "/flags/britain.svg",
    category: "Social Media",
    image: "/voice-type/archie.png",
  },
];

export default function Step3VoiceScript({
  selectedVoice,
  setSelectedVoice,
  script,
  setScript,
}: Step3VoiceScriptProps) {
  return (
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 space-y-8">
      {/* Voice Type */}
      <div>
        <h3 className="text-white text-lg font-semibold mb-5">Voice Type</h3>
        <div className="grid grid-cols-3 gap-3">
          {voices.map((voice) => (
            <button
              key={voice.id}
              onClick={() => setSelectedVoice(voice.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                selectedVoice === voice.id
                  ? "border-[#3B82F6] bg-[#3B82F6]/5"
                  : "border-[#1A3155] bg-[#0B0E12] hover:border-[#2A4A7A]"
              }`}
            >
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 self-center">
                <Image
                  src={voice.image}
                  alt={voice.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold leading-tight">
                  {voice.name} - {voice.description}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Image
                    src={voice.flag}
                    alt={voice.accent}
                    width={32}
                    height={32}
                    className="shrink-0"
                  />
                  <span className="text-gray-500 text-[10px]">
                    {voice.accent}
                  </span>
                </div>
                <p className="text-gray-500 text-[10px] mt-1">
                  {voice.category}
                </p>
              </div>

              {/* Play Icon */}
              <Volume2 className="w-4 h-4 text-[#3B82F6] shrink-0 self-center" />
            </button>
          ))}
        </div>
      </div>

      {/* Script */}
      <div>
        <h3 className="text-white text-lg font-semibold mb-3">Script</h3>
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Enter your video script here..."
          rows={5}
          className="w-full bg-[#0B0E12] border border-[#1A3155] rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:border-[#3B82F6] focus:outline-none transition-colors resize-none"
        />
        <p className="text-gray-500 text-xs mt-2">
          AI will generate visuals based on your script
        </p>
      </div>
    </div>
  );
}
