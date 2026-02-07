"use client";

export type VisualStyleOption =
  | "cinematic"
  | "anime"
  | "realistic"
  | "abstract"
  | "watercolor"
  | "3d-render";

export type TransitionStyle =
  | "fade"
  | "slide"
  | "zoom"
  | "dissolve";

interface Step5VisualStyleProps {
  visualStyle: VisualStyleOption;
  setVisualStyle: (value: VisualStyleOption) => void;
  transitionStyle: TransitionStyle;
  setTransitionStyle: (value: TransitionStyle) => void;
  sceneDuration: number;
  setSceneDuration: (value: number) => void;
}

const visualStyles: {
  value: VisualStyleOption;
  label: string;
  description: string;
  gradient: string;
}[] = [
  {
    value: "cinematic",
    label: "Cinematic",
    description: "Film-quality visuals",
    gradient: "from-orange-500 to-red-600",
  },
  {
    value: "anime",
    label: "Anime",
    description: "Japanese animation style",
    gradient: "from-pink-500 to-purple-600",
  },
  {
    value: "realistic",
    label: "Realistic",
    description: "Photo-realistic imagery",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    value: "abstract",
    label: "Abstract",
    description: "Artistic & creative visuals",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    value: "watercolor",
    label: "Watercolor",
    description: "Painted watercolor look",
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    value: "3d-render",
    label: "3D Render",
    description: "3D generated graphics",
    gradient: "from-amber-500 to-orange-600",
  },
];

const transitionStyles: {
  value: TransitionStyle;
  label: string;
}[] = [
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide" },
  { value: "zoom", label: "Zoom" },
  { value: "dissolve", label: "Dissolve" },
];

export default function Step5VisualStyle({
  visualStyle,
  setVisualStyle,
  transitionStyle,
  setTransitionStyle,
  sceneDuration,
  setSceneDuration,
}: Step5VisualStyleProps) {
  return (
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 space-y-8">
      {/* Visual Style */}
      <div>
        <h3 className="text-white text-base font-semibold mb-4">
          Visual Style
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {visualStyles.map((option) => (
            <button
              key={option.value}
              onClick={() => setVisualStyle(option.value)}
              className={`flex flex-col items-center p-4 rounded-xl border transition-all ${
                visualStyle === option.value
                  ? "border-[#3B82F6] bg-[#3B82F6]/5"
                  : "border-[#1A3155] bg-[#0B0E12] hover:border-[#2A4A7A]"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.gradient} mb-3`}
              />
              <span className="text-white text-sm font-medium">
                {option.label}
              </span>
              <span className="text-gray-500 text-[10px] mt-0.5">
                {option.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Transition Style */}
      <div>
        <h3 className="text-white text-base font-semibold mb-4">
          Transition Style
        </h3>
        <div className="flex flex-wrap gap-2">
          {transitionStyles.map((option) => (
            <button
              key={option.value}
              onClick={() => setTransitionStyle(option.value)}
              className={`px-5 py-2.5 rounded-xl border transition-all text-sm font-medium ${
                transitionStyle === option.value
                  ? "border-[#3B82F6] bg-[#3B82F6]/5 text-white"
                  : "border-[#1A3155] bg-[#0B0E12] text-gray-400 hover:border-[#2A4A7A]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scene Duration */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-base font-semibold">
            Scene Duration
          </h3>
          <span className="text-[#3B82F6] text-sm font-medium">
            {sceneDuration}s
          </span>
        </div>
        <input
          type="range"
          min={3}
          max={15}
          step={1}
          value={sceneDuration}
          onChange={(e) => setSceneDuration(parseInt(e.target.value))}
          className="w-full h-1.5 bg-[#1A2332] rounded-full appearance-none cursor-pointer accent-[#3B82F6] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#3B82F6] [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <div className="flex justify-between mt-2">
          <span className="text-gray-500 text-xs">3s</span>
          <span className="text-gray-500 text-xs">9s</span>
          <span className="text-gray-500 text-xs">15s</span>
        </div>
      </div>
    </div>
  );
}
