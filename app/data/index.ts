import {
  Captions,
  Clapperboard,
  FileText,
  Mic,
  Music,
  Palette,
  Film,
  Settings,
  Share2,
} from "lucide-react";

// Features Section Data
export const features = [
  {
    title: "AI Script to Video",
    desc: "Paste your script directly into Clip Forge — or let our AI generate (coming soon) one for you from a simple prompt. Whether you’re starting from scratch or refining existing content, we turn your words into a ready-to-produce video structure in seconds.",
    icon: FileText,
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-500",
  },
  {
    title: "Background Music",
    desc: "Add the perfect soundtrack from our curated library of royalty-free music tracks.",
    icon: Music,
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-500",
  },
  {
    title: "Video Scenes",
    desc: "Enhance your content with AI-generated video clips that match your narrative.",
    icon: Film,
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-500",
  },
];

// How It Works Section Data
export const steps = [
  {
    step: 1,
    title: "Add Your Script",
    desc: "Paste your script directly into Clip Forge, or let our AI generate one for you from a simple prompt (coming soon). Whether you are starting from scratch or refining existing content, we turn your words into a ready-to-produce video structure in seconds.",
    icon: FileText,
  },
  {
    step: 2,
    title: "Customize Your Video",
    desc: "Bring your content to life by selecting:",
    icon: Settings,
    points: [
      { label: "AI voice narration", icon: Mic },
      { label: "Visual style & imagery", icon: Palette },
      { label: "Background music", icon: Music },
      { label: "Motion effects", icon: Clapperboard },
      { label: "Subtitle options", icon: Captions },
    ],
    note: "Fine-tune the settings to match your brand, audience, and platform.",
  },
  {
    step: 3,
    title: "Generate and Share",
    desc: "Click generate and let Clip Forge do the heavy lifting. Your video is rendered automatically in 9:16 for Shorts and Reels, 16:9 for YouTube and widescreen, or 1:1 for square social posts. Download and publish instantly on your preferred platform.",
    icon: Share2,
  },
];

// Pricing Section Data
export const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "One-time",
    credits: "50 Credits Included",
    features: [
      { text: "1080p Export", included: true },
      { text: "Standard Voices", included: true },
      { text: "Basic Support", included: true },
      { text: "No Watermark", included: true },
    ],
    button: "Buy 50 Credits",
    highlighted: false,
    cardStyle: {
      width: "396.78px",
      height: "555.26px",
      padding: "44.33px",
      gap: "35.46px",
      borderRadius: "26.6px",
      borderWidth: "1.23px",
    },
  },
  {
    name: "Growth",
    price: "$10",
    period: "/one-time",
    credits: "3000 Credits Included",
    features: [
      { text: "4K Export", included: true },
      { text: "Premium AI Voices", included: true },
      { text: "Priority Support", included: true },
      { text: "Unlimited Assets", included: true },
    ],
    button: "Buy 200 Credits",
    highlighted: true,
    badge: "MOST POPULAR",
    cardStyle: {
      width: "420.05px",
      height: "607.36px",
      padding: "44.33px",
      gap: "35.46px",
      borderRadius: "26.6px",
      borderWidth: "1.23px",
    },
  },
  {
    name: "Pro",
    price: "$25",
    period: "/one-time",
    credits: "6000 Credits Included",
    features: [
      { text: "API Access", included: true },
      { text: "Custom Branding", included: true },
      { text: "Dedicated Manager", included: true },
      { text: "Bulk Generation", included: true },
    ],
    button: "Buy 600 Credits",
    highlighted: false,
    cardStyle: {
      width: "396.78px",
      height: "555.26px",
      padding: "44.33px",
      gap: "35.46px",
      borderRadius: "26.6px",
      borderWidth: "1.23px",
    },
  },
];

// Video Section Data
export const videos = [
  {
    title: "Storytelling",
    desc: "Generate viral storytelling content in minutes.",
    bgImage: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    bgColor: "from-slate-900 via-slate-800 to-slate-900",
    image: "/video/storytelling.png",
  },
  {
    title: "Educational",
    desc: "Generate viral educational content in minutes.",
    bgImage: "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)",
    bgColor: "from-gray-900 via-gray-800 to-gray-900",
    image: "/video/educational.png",
  },
  {
    title: "Product Promo",
    desc: "Generate viral product promo content in minutes.",
    bgImage: "linear-gradient(135deg, #0a192f 0%, #112240 50%, #1d3557 100%)",
    bgColor: "from-blue-950 via-blue-900 to-cyan-900",
    image: "/video/productPromo.png",
  },
  {
    title: "Cinematic",
    desc: "Generate viral cinematic content in minutes.",
    bgImage: "linear-gradient(135deg, #000000 0%, #0d1b2a 50%, #1b263b 100%)",
    bgColor: "from-black via-slate-900 to-slate-800",
    image: "/video/cinematic.png",
  },
];

// Video Card Data (Reusable for Dashboard & All Videos page)
export interface VideoCardData {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  createdAt: string;
  keywords?: string;
  negativeKeywords?: string;
  videoFormat?: string;
  videoStyle?: string;
  voiceType?: string;
  status?: "Completed" | "Processing" | "Failed";
}

export const videoCardData: VideoCardData[] = [
  {
    id: "1",
    title: "A Small Effort, A Big Heart",
    category: "Inspirational",
    videoUrl: "/video/a-small-effort-a-big-heart.mp4",
    createdAt: "Created 10min ago",
    keywords: "Heart, Kindness, Effort",
    negativeKeywords: "Violence",
    videoFormat: "9:16",
    videoStyle: "Cinematic",
    voiceType: "Griffin",
    status: "Completed",
  },
  {
    id: "2",
    title: "Anime Episode",
    category: "Anime",
    videoUrl: "/video/anime-episode.mp4",
    createdAt: "Created 15min ago",
    keywords: "Anime, Action",
    negativeKeywords: "Gore",
    videoFormat: "9:16",
    videoStyle: "Anime",
    voiceType: "Griffin",
    status: "Completed",
  },
  {
    id: "3",
    title: "Create Faceless Videos",
    category: "Tutorial",
    videoUrl: "/video/create-faceless-short-form-videos-with-one-click.mp4",
    createdAt: "Created 20min ago",
    keywords: "Faceless, Tutorial, AI",
    negativeKeywords: "Face",
    videoFormat: "9:16",
    videoStyle: "Educational",
    voiceType: "Nova",
    status: "Completed",
  },
  {
    id: "4",
    title: "Doraemon",
    category: "Anime",
    videoUrl: "/video/doraimon.mp4",
    createdAt: "Created 25min ago",
    keywords: "Doraemon, Cartoon, Fun",
    negativeKeywords: "Violence",
    videoFormat: "9:16",
    videoStyle: "Anime",
    voiceType: "Griffin",
    status: "Completed",
  },
  {
    id: "5",
    title: "Love Each Other",
    category: "Emotional",
    videoUrl: "/video/love-each-other.mp4",
    createdAt: "Created 30min ago",
    keywords: "Love, Emotion, Relationship",
    negativeKeywords: "Hate",
    videoFormat: "9:16",
    videoStyle: "Storytelling",
    voiceType: "Shimmer",
    status: "Completed",
  },
  {
    id: "6",
    title: "Multi Disease Detection Dogs",
    category: "Educational",
    videoUrl: "/video/multi-disease-detection-dogs.mp4",
    createdAt: "Created 35min ago",
    keywords: "Dogs, Health, Detection",
    negativeKeywords: "Violence",
    videoFormat: "9:16",
    videoStyle: "Educational",
    voiceType: "Nova",
    status: "Completed",
  },
  {
    id: "7",
    title: "Rhythm of the Night",
    category: "Music",
    videoUrl: "/video/rhythm-of-the-night.mp4",
    createdAt: "Created 40min ago",
    keywords: "Music, Night, Rhythm",
    negativeKeywords: "Silence",
    videoFormat: "9:16",
    videoStyle: "Cinematic",
    voiceType: "Echo",
    status: "Completed",
  },
  {
    id: "8",
    title: "Story",
    category: "Storytelling",
    videoUrl: "/video/story.mp4",
    createdAt: "Created 45min ago",
    keywords: "Story, Narrative",
    negativeKeywords: "Boring",
    videoFormat: "9:16",
    videoStyle: "Storytelling",
    voiceType: "Griffin",
    status: "Completed",
  },
  {
    id: "9",
    title: "The Insect That Can See Time Slower",
    category: "Science",
    videoUrl: "/video/the-insect-that-can-see-time-slowe.mp4",
    createdAt: "Created 50min ago",
    keywords: "Insect, Time, Science",
    negativeKeywords: "Phobia",
    videoFormat: "9:16",
    videoStyle: "Educational",
    voiceType: "Nova",
    status: "Completed",
  },
  {
    id: "10",
    title: "The Village Where Everyone Shares One Clock",
    category: "Story",
    videoUrl: "/video/the-village-where-everyone-shares-one-clock_20260112_012548_883_f59617a9.mp4",
    createdAt: "Created 1hr ago",
    keywords: "Village, Clock, Community",
    negativeKeywords: "Loneliness",
    videoFormat: "9:16",
    videoStyle: "Storytelling",
    voiceType: "Shimmer",
    status: "Completed",
  },
];

