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
  id: number | null;
  value: SubtitleStyle;
  label: string;
  credits: string;
  previewText: string;
  previewStyle: string;
}[] = [
  {
    id: null,
    value: "none",
    label: "None",
    credits: "Free",
    previewText: "No subtitles",
    previewStyle: "text-gray-500 text-xs",
  },
  {
    id: 1,
    value: "classic-white",
    label: "Classic White",
    credits: "10cr",
    previewText:
      "This is a longer subtitle preview that should wrap safely on multiple lines.",
    previewStyle:
      "text-white text-xs font-semibold px-3 py-1.5 bg-black/55 rounded-md [text-shadow:0_2px_6px_rgba(0,0,0,0.95)]",
  },
  {
    id: 2,
    value: "modern-box",
    label: "Modern Box",
    credits: "10cr",
    previewText:
      "This is a longer subtitle preview that should wrap safely on multiple lines.",
    previewStyle:
      "text-white text-xs font-bold px-3 py-2 bg-black/80 rounded-lg [text-shadow:0_2px_6px_rgba(0,0,0,0.95)]",
  },
  {
    id: 3,
    value: "minimal-light",
    label: "Minimal Light",
    credits: "10cr",
    previewText:
      "This is a longer subtitle preview that should wrap safely on multiple lines.",
    previewStyle:
      "text-gray-900 text-xs font-semibold px-3 py-1.5 bg-white/90 rounded-md",
  },
  {
    id: 4,
    value: "yellow-highlight",
    label: "Yellow Highlight",
    credits: "15cr",
    previewText:
      "This is a longer subtitle preview that should wrap safely on multiple lines.",
    previewStyle:
      "text-gray-900 text-xs font-bold px-3 py-1.5 bg-yellow-400 rounded-md",
  },
  {
    id: 5,
    value: "pink-highlight",
    label: "Pink Highlight",
    credits: "15cr",
    previewText:
      "This is a longer subtitle preview that should wrap safely on multiple lines.",
    previewStyle:
      "text-white text-xs font-bold px-3 py-1.5 bg-pink-500 rounded-lg [text-shadow:0_2px_6px_rgba(0,0,0,0.95)]",
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
        <h3 className="text-gray-900 dark:text-white text-lg font-semibold">
          Subtitles
        </h3>
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
        <p className="text-gray-500 text-sm">
          Subtitles are disabled. Toggle on to choose a style.
        </p>
      )}

      {/* Subtitle style cards */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 transition-opacity ${
          !subtitlesEnabled ? "opacity-40 pointer-events-none" : ""
        }`}
      >
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
                : "border-gray-300 dark:border-[#1A3155] hover:border-blue-300 dark:hover:border-[#2A4A7A]"
            }`}
          >
            {/* Preview area */}
            {/* Preview area */}
            <div
              className="relative bg-gray-200 dark:bg-[#1A2332] overflow-hidden"
              style={{ aspectRatio: "16/9" }}
            >
              {style.value === "none" ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={style.previewStyle}>
                    {style.previewText}
                  </span>
                </div>
              ) : (
                <div className="absolute left-[5%] right-[5%] bottom-[8%] flex justify-center">
                  <p
                    className={`${style.previewStyle} max-w-full text-center whitespace-normal wrap-break-word leading-tight`}
                  >
                    {style.previewText}
                  </p>
                </div>
              )}
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
