import type { SceneMediaOption, SubtitleStyle, VideoFormat, VideoStyleOption, VoiceId } from "@/types/createVideo";

export interface VideoStyleData {
  value: VideoStyleOption;
  label: string;
  image: string;
}

export interface VideoFormatData {
  value: VideoFormat;
  label: string;
  cardHeight: string;
  innerWidth: string;
  innerHeight: string;
}

export interface SceneMediaData {
  value: SceneMediaOption;
  label: string;
  credits: number;
}

export interface VoiceData {
  id: VoiceId;
  name: string;
  description: string;
  accent: string;
  flag: string;
  category: string;
  image: string;
}

export interface SubtitleStyleData {
  id: number | null;
  value: SubtitleStyle;
  label: string;
  credits: string;
  previewText: string;
  previewStyle: string;
}

export const videoStyles: VideoStyleData[] = [
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
    label: "Caricature",
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

export const formatOptions: VideoFormatData[] = [
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

export const sceneMediaOptions: SceneMediaData[] = [
  { value: "all-images", label: "Use all images", credits: 0 },
  { value: "first-scene-video", label: "First Scene video", credits: 200 },
  { value: "last-scene-video", label: "Last Scene video", credits: 200 },
  {
    value: "first-last-scene-video",
    label: "First & Last Scene video",
    credits: 300,
  },
];

export const voices: VoiceData[] = [
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

export const subtitleStyles: SubtitleStyleData[] = [
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
    credits: "0cr",
    previewText:
      "This is a longer subtitle preview that should wrap safely on multiple lines.",
    previewStyle:
      "text-white text-xs font-semibold px-3 py-1.5 bg-black/55 rounded-md [text-shadow:0_2px_6px_rgba(0,0,0,0.95)]",
  },
  {
    id: 3,
    value: "modern-box",
    label: "Modern Box",
    credits: "0cr",
    previewText:
      "This is a longer subtitle preview that should wrap safely on multiple lines.",
    previewStyle:
      "text-white text-xs font-bold px-3 py-2 bg-black/80 rounded-lg [text-shadow:0_2px_6px_rgba(0,0,0,0.95)]",
  },
  {
    id: 4,
    value: "minimal-light",
    label: "Minimal Light",
    credits: "0cr",
    previewText:
      "This is a longer subtitle preview that should wrap safely on multiple lines.",
    previewStyle:
      "text-gray-900 text-xs font-semibold px-3 py-1.5 bg-white/90 rounded-md",
  },
  {
    id: 5,
    value: "yellow-highlight",
    label: "Yellow Highlight",
    credits: "0cr",
    previewText:
      "This is a longer subtitle preview that should wrap safely on multiple lines.",
    previewStyle:
      "text-gray-900 text-xs font-bold px-3 py-1.5 bg-yellow-400 rounded-md",
  },
  {
    id: 6,
    value: "pink-highlight",
    label: "Pink Highlight",
    credits: "0cr",
    previewText:
      "This is a longer subtitle preview that should wrap safely on multiple lines.",
    previewStyle:
      "text-white text-xs font-bold px-3 py-1.5 bg-pink-500 rounded-lg [text-shadow:0_2px_6px_rgba(0,0,0,0.95)]",
  },
];
