"use client";

export type SubtitleStyle =
  | "none"
  | "classic-white"
  | "modern-box"
  | "minimal-light"
  | "yellow-highlight"
  | "gradient";

interface Step5SubtitlesProps {
  subtitlesEnabled: boolean;
  setSubtitlesEnabled: (value: boolean) => void;
  subtitleStyle: SubtitleStyle;
  setSubtitleStyle: (value: SubtitleStyle) => void;
}

const subtitleStyles: {
  value: SubtitleStyle;
  label: string;
  credits: string;
  previewText: string;
  previewStyle: string;
}[] = [
  {
    value: "none",
    label: "None",
    credits: "Free",
    previewText: "No subtitles",
    previewStyle: "text-gray-500 text-xs",
  },
  {
    value: "classic-white",
    label: "Classic White",
    credits: "10cr",
    previewText: "Sample Text",
    previewStyle:
      "text-white text-xs font-medium px-3 py-1 bg-black/50 rounded",
  },
  {
    value: "modern-box",
    label: "Modern Box",
    credits: "10cr",
    previewText: "Sample Text",
    previewStyle:
      "text-white text-xs font-bold px-3 py-1.5 bg-black/80 rounded-lg",
  },
  {
    value: "minimal-light",
    label: "Minimal Light",
    credits: "10cr",
    previewText: "Sample Text",
    previewStyle:
      "text-gray-900 text-xs font-medium px-3 py-1 bg-white/90 rounded-md",
  },
  {
    value: "yellow-highlight",
    label: "Yellow Highlight",
    credits: "15cr",
    previewText: "Sample Text",
    previewStyle:
      "text-gray-900 text-xs font-bold px-3 py-1 bg-yellow-400 rounded-md",
  },
  {
    value: "gradient",
    label: "Gradient",
    credits: "15cr",
    previewText: "Sample Text",
    previewStyle:
      "text-white text-xs font-bold px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg",
  },
];

export default function Step5Subtitles({
  subtitlesEnabled,
  setSubtitlesEnabled,
  subtitleStyle,
  setSubtitleStyle,
}: Step5SubtitlesProps) {
  return (
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 space-y-6">
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-white text-lg font-semibold">Subtitles</h3>
        <button
          onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            subtitlesEnabled ? "bg-[#3B82F6]" : "bg-[#1A2332]"
          }`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              subtitlesEnabled ? "translate-x-6" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {/* Subtitle style cards */}
      <div className="grid grid-cols-3 gap-3">
        {subtitleStyles.map((style) => (
          <button
            key={style.value}
            onClick={() => {
              setSubtitleStyle(style.value);
              if (style.value !== "none") setSubtitlesEnabled(true);
            }}
            className={`flex flex-col rounded-xl border transition-all overflow-hidden ${
              subtitleStyle === style.value
                ? "border-[#3B82F6]"
                : "border-[#1A3155] hover:border-[#2A4A7A]"
            }`}
          >
            {/* Preview area */}
            <div className="bg-[#1A2332] h-24 flex items-center justify-center">
              <span className={style.previewStyle}>{style.previewText}</span>
            </div>

            {/* Label + credits */}
            <div className="bg-[#0B0E12] px-3 py-2 flex items-center justify-between">
              <span className="text-white text-xs font-medium">
                {style.label}
              </span>
              <span
                className={`text-xs font-medium ${
                  style.credits === "Free"
                    ? "text-emerald-400"
                    : "text-[#3B82F6]"
                }`}
              >
                {style.credits}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
