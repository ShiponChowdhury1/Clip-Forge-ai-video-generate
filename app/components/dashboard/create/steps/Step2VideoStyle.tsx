"use client";

import Image from "next/image";
import type { SceneMediaOption } from "./Step1VideoDetails";

export type VideoFormat = "9:16" | "1:1" | "16:9";

export type VideoStyleOption =
  | "3d-cartoon"
  | "anime"
  | "comic-noir"
  | "b-w-sketch"
  | "characature"
  | "hyper-realistic"
  | "medeival-painting"
  | "realistic-action-art"
  | "retro-noir"
  | "warm-fable";

interface Step2VideoStyleProps {
  videoFormat: VideoFormat;
  setVideoFormat: (value: VideoFormat) => void;
  videoStyle: VideoStyleOption;
  setVideoStyle: (value: VideoStyleOption) => void;
  sceneMedia: SceneMediaOption;
  setSceneMedia: (value: SceneMediaOption) => void;
}

const videoStyles: {
  value: VideoStyleOption;
  label: string;
  image: string;
}[] = [
  {
    value: "3d-cartoon",
    label: "3D Cartoon",
    image: "/video-style/3D-cartoon.png",
  },
  {
    value: "anime",
    label: "Anime",
    image: "/video-style/anime.png",
  },
  {
    value: "comic-noir",
    label: "Comic Noir",
    image: "/video-style/comicNoir.png",
  },
  {
    value: "b-w-sketch",
    label: "B&W Sketch",
    image: "/video-style/b-W-Sketch.png",
  },
  {
    value: "characature",
    label: "Characature",
    image: "/video-style/characature.png",
  },
  {
    value: "hyper-realistic",
    label: "Hyper Realistic",
    image: "/video-style/hyperRealistic.png",
  },
  {
    value: "medeival-painting",
    label: "Medieval Painting",
    image: "/video-style/medeivalPainting.png",
  },
  {
    value: "realistic-action-art",
    label: "Realistic Action Art",
    image: "/video-style/realisticActionArt.png",
  },
  {
    value: "retro-noir",
    label: "Retro Noir",
    image: "/video-style/retroNoir.png",
  },
  {
    value: "warm-fable",
    label: "Warm Fable",
    image: "/video-style/warmFable.png",
  },
];

const formatOptions: {
  value: VideoFormat;
  label: string;
  cardHeight: string;
  innerWidth: string;
  innerHeight: string;
}[] = [
  {
    value: "9:16",
    label: "9:16",
    cardHeight: "h-[250px]",
    innerWidth: "w-[100px]",
    innerHeight: "h-[120px]",
  },
  {
    value: "1:1",
    label: "1:1",
    cardHeight: "h-[194px]",
    innerWidth: "w-[100px]",
    innerHeight: "h-[120px]",
  },
  {
    value: "16:9",
    label: "16:9",
    cardHeight: "h-[134px]",
    innerWidth: "w-[110px]",
    innerHeight: "h-[60px]",
  },
];

export default function Step2VideoStyle({
  videoFormat,
  setVideoFormat,
  videoStyle,
  setVideoStyle,
  sceneMedia,
  setSceneMedia,
}: Step2VideoStyleProps) {
  return (
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 space-y-8">
      {/* Video Format */}
      <div>
        <h3 className="text-white text-base font-semibold mb-4">
          Video Format
        </h3>
        <div className="flex items-end gap-3">
          {formatOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setVideoFormat(option.value)}
              className={`flex flex-col items-center gap-3 w-[150px] ${option.cardHeight} p-5 rounded-xl border transition-all ${
                videoFormat === option.value
                  ? "border-[#3B82F6] bg-[#3B82F6]/5"
                  : "border-[#1A3155] bg-[#0B0E12] hover:border-[#2A4A7A]"
              }`}
            >
              {/* Device mockup */}
              <div className="flex-1 flex items-end justify-center">
                <div
                  className={`${option.innerWidth} ${option.innerHeight} rounded-lg border-2 ${
                    videoFormat === option.value
                      ? "border-[#3B82F6]"
                      : "border-[#2A3A50]"
                  } transition-colors`}
                />
              </div>
              <span
                className={`text-sm font-medium ${
                  videoFormat === option.value
                    ? "text-white"
                    : "text-gray-400"
                }`}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Video Style */}
      <div>
        <h3 className="text-white text-lg font-semibold mb-5">Video Style</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {videoStyles.map((style) => (
            <button
              key={style.value}
              onClick={() => setVideoStyle(style.value)}
              className={`flex flex-col items-center gap-2 group transition-all ${
                videoStyle === style.value ? "scale-[1.02]" : ""
              }`}
            >
              <div
                className={`w-full aspect-4/3 rounded-xl overflow-hidden border-2 transition-all ${
                  videoStyle === style.value
                    ? "border-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                    : "border-transparent hover:border-[#2A4A7A]"
                }`}
              >
                <Image
                  src={style.image}
                  alt={style.label}
                  width={200}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  videoStyle === style.value
                    ? "text-white"
                    : "text-gray-400 group-hover:text-gray-300"
                }`}
              >
                {style.label}
              </span>
            </button>
          ))}
        </div>
      </div>

   
      
     
    </div>
  );
}
