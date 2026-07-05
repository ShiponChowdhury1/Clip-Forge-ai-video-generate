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

// Pricing Section Data – Subscription Plans
export const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    credits: "50 Credits / month",
    features: [
      { text: "1080p Export", included: true },
      { text: "Standard Voices", included: true },
      { text: "Basic Support", included: true },
      { text: "No Watermark", included: true },
      { text: "Commercial Usage", included: false },
    ],
    button: "Get Started",
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
    period: "/month",
    credits: "3,000 Credits / month",
    features: [
      { text: "4K Export", included: true },
      { text: "Premium AI Voices", included: true },
      { text: "Priority Support", included: true },
      { text: "Unlimited Assets", included: true },
      { text: "Commercial Usage", included: true },
    ],
    button: "Choose Plan",
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
    period: "/month",
    credits: "6,000 Credits / month",
    features: [
      { text: "API Access", included: true },
      { text: "Custom Branding", included: true },
      { text: "Dedicated Manager", included: true },
      { text: "Bulk Generation", included: true },
      { text: "Commercial Usage", included: true },
    ],
    button: "Choose Plan",
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
    title: "The Emperor Who Declared War on Birds",
    category: "Fun History",
    bgImage: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    bgColor: "from-slate-900 via-slate-800 to-slate-900",
    videoUrl: "/video/Fun History - The Emperor Who Declared War on Birds.mp4",
  },
  {
    title: "The Warrior Who Refused to Fall",
    category: "Story Telling",
    bgImage: "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)",
    bgColor: "from-gray-900 via-gray-800 to-gray-900",
    videoUrl: "/video/Story Telling - The Warrior Who Refused to Fall.mp4",
  },
  {
    title: "The Fairy Who Stole the Morning Light",
    category: "Fantasy",
    bgImage: "linear-gradient(135deg, #0a192f 0%, #112240 50%, #1d3557 100%)",
    bgColor: "from-blue-950 via-blue-900 to-cyan-900",
    videoUrl: "/video/The Fairy Who Stole the Morning Light.mp4",
  },
  {
    title: "The Last Stand of the Spartans",
    category: "History",
    bgImage: "linear-gradient(135deg, #000000 0%, #0d1b2a 50%, #1b263b 100%)",
    bgColor: "from-black via-slate-900 to-slate-800",
    videoUrl: "/video/The Last Stand of the Spartans.mp4",
  },
  {
    title: "The Man Who Survived TWO Atomic Bombs",
    category: "History",
    bgImage: "linear-gradient(135deg, #2c3e50 0%, #3498db 50%, #2980b9 100%)",
    bgColor: "from-slate-950 via-slate-900 to-blue-900",
    videoUrl: "/video/The Man Who Survived TWO Atomic Bombs.mp4",
  },
  {
    title: "The SECRET Power of Beagles",
    category: "Animals",
    bgImage: "linear-gradient(135deg, #d35400 0%, #e67e22 50%, #f39c12 100%)",
    bgColor: "from-amber-950 via-amber-900 to-yellow-900",
    videoUrl: "/video/The SECRET Power of Beagles.mp4",
  },
  {
    title: "Why Bora Bora Looks Too Perfect to Be Real",
    category: "Travel",
    bgImage: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
    bgColor: "from-teal-950 via-teal-900 to-slate-900",
    videoUrl: "/video/Why Bora Bora Looks Too Perfect to Be Real.mp4",
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

