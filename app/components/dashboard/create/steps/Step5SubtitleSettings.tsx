"use client";

export type SubtitleStyle =
  | "none"
  | "classic-white"
  | "modern-box"
  | "minimal-light"
  | "yellow-highlight"
  | "pink-highlight";

interface Step5SubtitleSettingsProps {
  subtitlesEnabled: boolean;
  setSubtitlesEnabled: (value: boolean) => void;
  subtitleStyle: SubtitleStyle;
  setSubtitleStyle: (value: SubtitleStyle) => void;
}

export const subtitleStyles: {
  id: number;
  value: SubtitleStyle;
  label: string;
  credits: string;
  previewText: string;
  previewStyle: string;
}[] = [
  {
    id: 1,
    value: "none",
    label: "None",
    credits: "Free",
    previewText: "No subtitles",
    previewStyle: "text-gray-500 text-xs",
  },
  {
    id: 2,
    value: "classic-white",
    label: "Classic White",
    credits: "10cr",
    previewText: "Sample Text",
    previewStyle:
      "text-white text-xs font-medium px-3 py-1 bg-black/50 rounded",
  },
  {
    id: 3,
    value: "modern-box",
    label: "Modern Box",
    credits: "10cr",
    previewText: "Sample Text",
    previewStyle:
      "text-white text-xs font-bold px-3 py-1.5 bg-black/80 rounded-lg",
  },
  {
    id: 4,
    value: "minimal-light",
    label: "Minimal Light",
    credits: "10cr",
    previewText: "Sample Text",
    previewStyle:
      "text-gray-900 text-xs font-medium px-3 py-1 bg-white/90 rounded-md",
  },
  {
    id: 5,
    value: "yellow-highlight",
    label: "Yellow Highlight",
    credits: "15cr",
    previewText: "Sample Text",
    previewStyle:
      "text-gray-900 text-xs font-bold px-3 py-1 bg-yellow-400 rounded-md",
  },
  {
    id: 6,
    value: "pink-highlight",
    label: "Pink Highlight",
    credits: "15cr",
    previewText: "Sample Text",
    previewStyle:
      "text-white text-xs font-bold px-3 py-1.5 bg-pink-500 to-pink-500 rounded-lg",
  },
];

export default function Step5SubtitleSettings({
  subtitlesEnabled,
  setSubtitlesEnabled,
  subtitleStyle,
  setSubtitleStyle,
}: Step5SubtitleSettingsProps) {
  return (
    <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6 space-y-6">
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-gray-900 dark:text-white text-lg font-semibold">Subtitles</h3>
        <button
          onClick={() => {
            const next = !subtitlesEnabled;
            setSubtitlesEnabled(next);
            if (!next) setSubtitleStyle("none");
          }}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            subtitlesEnabled ? "bg-[#3B82F6]" : "bg-gray-300 dark:bg-[#1A2332]"
          }`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              subtitlesEnabled ? "translate-x-6" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {/* Disabled message */}
      {!subtitlesEnabled && (
        <p className="text-gray-500 text-sm">Subtitles are disabled. Toggle on to choose a style.</p>
      )}

      {/* Subtitle style cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 transition-opacity ${
        !subtitlesEnabled ? "opacity-40 pointer-events-none" : ""
      }`}>
        {subtitleStyles.map((style) => (
          <button
            key={style.value}
            onClick={() => {
              setSubtitleStyle(style.value);
              if (style.value === "none") {
                setSubtitlesEnabled(false);
              } else {
                setSubtitlesEnabled(true);
              }
            }}
            className={`flex flex-col rounded-xl border transition-all overflow-hidden ${
              subtitleStyle === style.value
                ? "border-[#3B82F6]"
                : "border-gray-300 dark:border-[#1A3155] hover:border-[#2A4A7A]"
            }`}
          >
            {/* Preview area */}
            <div className="bg-gray-200 dark:bg-[#1A2332] h-24 flex items-center justify-center">
              <span className={style.previewStyle}>{style.previewText}</span>
            </div>

            {/* Label + credits */}
            <div className="bg-gray-50 dark:bg-[#0B0E12] px-3 py-2 flex items-center justify-between">
              <span className="text-gray-900 dark:text-white text-xs font-medium">
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
