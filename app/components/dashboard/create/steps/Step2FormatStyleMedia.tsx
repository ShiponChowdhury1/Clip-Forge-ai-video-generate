"use client";

import Image from "next/image";

export type VideoFormat = "9:16" | "1:1" | "16:9";

export type SceneMediaOption =
  | "all-images"
  | "first-scene-video"
  | "last-scene-video"
  | "first-last-scene-video";

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

interface Step2FormatStyleMediaProps {
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
    cardHeight: "h-[190px] sm:h-[250px]",
    innerWidth: "w-[72px] sm:w-[100px]",
    innerHeight: "h-[95px] sm:h-[160px]",
  },
  {
    value: "1:1",
    label: "1:1",
    cardHeight: "h-[160px] sm:h-[184px]",
    innerWidth: "w-[72px] sm:w-[100px]",
    innerHeight: "h-[96px] sm:h-[96px]",
  },
  {
    value: "16:9",
    label: "16:9",
    cardHeight: "h-[126px] sm:h-[134px]",
    innerWidth: "w-[78px] sm:w-[110px]",
    innerHeight: "h-[44px] sm:h-[60px]",
  },
];

const sceneMediaOptions: {
  value: SceneMediaOption;
  label: string;
  credits: number;
}[] = [
  { value: "all-images", label: "Use all images", credits: 0 },
  { value: "first-scene-video", label: "First Scene video", credits: 200 },
  { value: "last-scene-video", label: "Last Scene video", credits: 200 },
  {
    value: "first-last-scene-video",
    label: "First & Last Scene video",
    credits: 300,
  },
];

export default function Step2FormatStyleMedia({
  videoFormat,
  setVideoFormat,
  videoStyle,
  setVideoStyle,
  sceneMedia,
  setSceneMedia,
}: Step2FormatStyleMediaProps) {
  return (
    <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6 space-y-8">
      {/* Video Format */}
      <div>
        <h3 className="text-gray-900 dark:text-white text-base font-semibold mb-4">
          Video Format
        </h3>
        <div className="grid grid-cols-2 items-end gap-3 sm:flex">
          {formatOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setVideoFormat(option.value)}
              className={`flex w-full min-w-0 flex-col items-center gap-2 sm:gap-3 sm:w-37.5 ${option.cardHeight} p-3 sm:p-5 rounded-xl border transition-all ${
                option.value === "16:9" ? "col-span-2 sm:col-span-1" : ""
              } ${
                videoFormat === option.value
                  ? "border-[#3B82F6] bg-blue-50 dark:bg-[#3B82F6]/5"
                  : "border-gray-300 dark:border-[#1A3155] bg-gray-50 dark:bg-[#0B0E12] hover:border-blue-300 dark:hover:border-[#2A4A7A]"
              }`}
            >
              {/* Device mockup */}
              <div className="flex-1 flex items-end justify-center">
                <div
                  className={`${option.innerWidth} ${option.innerHeight} rounded-lg border-2 ${
                    videoFormat === option.value
                      ? "border-[#3B82F6]"
                      : "border-gray-300 dark:border-[#2A3A50]"
                  } transition-colors`}
                />
              </div>
              <span
                className={`text-xs sm:text-sm font-medium ${
                  videoFormat === option.value
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400"
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
        <h3 className="text-gray-900 dark:text-white text-lg font-semibold mb-5">Video Style</h3>
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
                    : "border-transparent hover:border-blue-300 dark:hover:border-[#2A4A7A]"
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
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                }`}
              >
                {style.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Scene Media Options */}
      <div>
        <h3 className="text-gray-900 dark:text-white text-sm font-semibold mb-4">
          Scene Media Options
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sceneMediaOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSceneMedia(option.value)}
              className={`relative flex flex-col items-start p-4 rounded-xl border transition-all text-left ${
                sceneMedia === option.value
                  ? "border-[#3B82F6] bg-[#3B82F6]/5"
                  : "border-gray-300 dark:border-[#1A3155] bg-gray-50 dark:bg-[#0B0E12] hover:border-blue-300 dark:hover:border-[#2A4A7A]"
              }`}
            >
              <span className="text-gray-900 dark:text-white text-sm font-medium">
                {option.label}
              </span>
              <span className="text-gray-500 text-xs mt-0.5">
                {option.credits} additional credits
              </span>
              {sceneMedia === option.value && (
                <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
