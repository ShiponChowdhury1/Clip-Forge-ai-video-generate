import { FileText, Music, Film, Settings, Share2 } from "lucide-react";

// Features Section Data
export const features = [
  {
    title: "AI Script to Video",
    desc: "Transform any script into a polished video with AI-powered scene generation and transitions.",
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
    title: "Paste your script",
    desc: "Simply paste your content or let our AI generate a script for you from a prompt.",
    icon: FileText,
  },
  {
    step: 2,
    title: "Customize settings",
    desc: "Choose your voice, visual style, and background music to match your brand's vibe.",
    icon: Settings,
  },
  {
    step: 3,
    title: "Export and share",
    desc: "Download your video in 9:16 format and upload directly to your favorite platforms.",
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

// FAQ Section Data
export const faqs = [
  {
    question: "What are credits?",
    answer:
      "Credits are our internal currency. 1 credit = 1 video generation. Credits never expire and you can buy more whenever you need them.",
  },
  {
    question: "Is the content really copyright free?",
    answer:
      "Yes, all our AI-generated scenes, music, and voiceovers are 100% copyright-free and royalty-free for commercial use.",
  },
  {
    question: "Can I use my own voice?",
    answer:
      "Yes, you can upload your own voice recordings or use our premium AI voices. You have complete control over the audio.",
  },
  {
    question: "What format are the videos exported in?",
    answer:
      "Videos are exported in MP4 format in 9:16 aspect ratio (1080x1920) resolution, perfect for TikTok, Reels, and Shorts.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes, our Starter plan includes 50 free credits so you can test the platform before purchasing more credits.",
  },
];
