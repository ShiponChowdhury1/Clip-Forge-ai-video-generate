"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useLogoutMutation } from "@/lib/redux/features/auth/authApi";
import { logout as logoutAction } from "@/lib/redux/features/auth/authSlice";
import { useGetDashboardQuery, useGetAllVideosQuery } from "@/lib/redux/features/videos/videosApi";
import Footer from "@/app/components/shared/Footer";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Bell,
  Plus,
  Zap,
  Star,
  Video,
  Clock,
  BarChart2,
  Play,
  MoreVertical,
  ArrowRight,
  ChevronDown,
  Clapperboard,
  Lightbulb,
  TrendingUp,
  Settings,
  LogOut,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.10.12.3:8000/api";

interface UserNotification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  video_id: number | null;
  job_id: string | null;
  created_at: string;
}

const getModalHeaderConfig = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("complete") || t.includes("ready") || t.includes("success") || t.includes("done")) {
    return {
      icon: <Video className="w-6 h-6 text-emerald-500" />,
      bg: "bg-emerald-500/10 border-emerald-500/20",
      glow: "bg-emerald-500/15"
    };
  }
  if (t.includes("fail") || t.includes("error") || t.includes("warn")) {
    return {
      icon: <AlertTriangle className="w-6 h-6 text-rose-500 animate-bounce" />,
      bg: "bg-rose-500/10 border-rose-500/20",
      glow: "bg-rose-500/15"
    };
  }
  return {
    icon: <Bell className="w-6 h-6 text-[#2563EB]" />,
    bg: "bg-[#2563EB]/10 border-[#2563EB]/20",
    glow: "bg-[#2563EB]/15"
  };
};

function NotificationDetailsModal({
  notification,
  onClose,
  onViewVideo,
}: {
  notification: UserNotification;
  onClose: () => void;
  onViewVideo?: (videoId: number) => void;
}) {
  const createdAt = new Date(notification.created_at).toLocaleString();
  const config = getModalHeaderConfig(notification.title);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <div className="relative bg-white dark:bg-[#0D0D1A] rounded-3xl w-full max-w-md mx-auto shadow-2xl border border-gray-200 dark:border-[#1F1F1F] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        
        {/* Dynamic Top Glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 ${config.glow} rounded-full blur-3xl pointer-events-none`} />

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 p-1.5 rounded-xl text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-200 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 relative z-10 flex flex-col items-center text-center">
          {/* Dynamic Responsive Icon */}
          <div className={`w-14 h-14 rounded-2xl ${config.bg} border flex items-center justify-center mb-5 shadow-inner`}>
            {config.icon}
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 max-w-xs leading-snug">
            {notification.title}
          </h3>
          
          {/* Created Date */}
          <p className="text-xs text-gray-500 dark:text-[#7070a0] mb-5">
            {createdAt}
          </p>

          {/* Message Content */}
          <div className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-[#1F1F1F] rounded-2xl p-4 text-left max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <p className="text-sm leading-relaxed text-gray-700 dark:text-[#ccccee] whitespace-pre-wrap">
              {notification.message}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 w-full flex flex-col gap-2.5">
            {notification.video_id && onViewVideo ? (
              <>
                <button
                  onClick={() => onViewVideo(notification.video_id!)}
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-3 rounded-xl transition-all duration-150 shadow-lg shadow-[#2563EB]/10 hover:shadow-[#2563EB]/25 active:scale-[0.98] text-sm flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white text-white" />
                  View Video
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-white/[0.05] dark:hover:bg-white/10 text-gray-700 dark:text-[#a0a0c0] font-semibold py-3 rounded-xl transition-all duration-150 text-sm"
                >
                  Close
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-3 rounded-xl transition-all duration-150 shadow-lg shadow-[#2563EB]/10 hover:shadow-[#2563EB]/25 active:scale-[0.98] text-sm"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Constants ─────────────────────────────────────────────────────────────────
const CREDITS_TOTAL = 5000;
const RESET_DATE = "Jun 1, 2026";

// Brand gradient colors
const GRAD_FROM = "#2563EB";
const GRAD_TO = "#3A49F6";
const PROGRESS_COLOR = "#2E6AF5";

const overviewData = [
  { day: "1", videos: 2 },
  { day: "5", videos: 5 },
  { day: "10", videos: 4 },
  { day: "15", videos: 8 },
  { day: "20", videos: 6 },
  { day: "25", videos: 10 },
  { day: "30", videos: 9 },
];


const tutorials = [
  { id: 1, title: "Navigating the Dashboard", duration: "3:41", image: "/tutorials/clip-forge-navigating_dashboard.png", video: "/tutorials/tutorial-1.mp4" },
  { id: 2, title: "Create a Video", duration: "5:21", image: "/tutorials/clip-forge-create_video.png", video: "/tutorials/tutorial-2.mp4" },
  { id: 3, title: "Write a Script with AI", duration: "5:23", image: "/tutorials/clip-forge-write_script.png", video: "/tutorials/tutorial-3.mp4" },
  { id: 4, title: "Processing vs Queued Videos", duration: "3:05", image: "/tutorials/clip-forge-processing_queued.png", video: "/tutorials/tutorial-4.mp4" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function formatDuration(seconds: number): string {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (e) {
    return dateString;
  }
}

function buildVideoUrl(path: string | null | undefined): string {
  if (!path || typeof path !== "string" || path.trim() === "") return "";
  if (path.startsWith("http")) return path;
  const match = path.match(/outputs\/.+$/);
  const relativePath = match ? `/${match[0]}` : path;
  return `/api/video-proxy?path=${encodeURIComponent(relativePath)}`;
}

interface RecentVideoRowThumbnailProps {
  v: {
    id: number;
    title: string;
    thumbnail_path: string | null;
    status: string;
    duration: number;
    created_at: string;
  };
  videoUrl: string;
  bg: string;
  isCompleted: boolean;
  isProcessing: boolean;
  isFailed: boolean;
}

function RecentVideoRowThumbnail({
  v,
  videoUrl,
  bg,
  isCompleted,
  isProcessing,
  isFailed,
}: RecentVideoRowThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div
      className="w-14 h-10 rounded-lg shrink-0 flex items-center justify-center border border-gray-200 dark:border-[#1F1F1F] relative overflow-hidden"
      style={{ background: bg }}
    >
      {isCompleted && videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={v.thumbnail_path ? buildVideoUrl(v.thumbnail_path) : undefined}
          className="absolute inset-0 w-full h-full object-cover z-10"
          muted
          loop
          autoPlay
          playsInline
          onTimeUpdate={(e) => {
            const video = e.currentTarget;
            if (video.currentTime >= 10) {
              video.currentTime = 0;
              video.play().catch(() => { });
            }
          }}
        />
      ) : isCompleted && v.thumbnail_path ? (
        <Image
          src={buildVideoUrl(v.thumbnail_path)}
          alt={v.title || "video thumbnail"}
          fill
          sizes="56px"
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          unoptimized
        />
      ) : isCompleted ? (
        <Play size={12} fill="white" className="text-white" />
      ) : isProcessing ? (
        <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        <AlertTriangle size={12} className="text-red-400" />
      )}
    </div>
  );
}

// ── Donut SVG ─────────────────────────────────────────────────────────────────
function DonutChart({ pct, total }: { pct: number; total: number }) {
  const r = 25;
  const circ = 2 * Math.PI * r;
  const filled = (pct / 100) * circ;
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" aria-label={`${pct}% of credits used`} role="img">
      <circle cx="34" cy="34" r={r} fill="none" className="stroke-gray-200 dark:stroke-[#1e1e3a]" strokeWidth="7" />
      <circle
        cx="34" cy="34" r={r} fill="none"
        stroke={PROGRESS_COLOR} strokeWidth="7"
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round"
      />
      <text x="34" y="32" textAnchor="middle" className="fill-gray-900 dark:fill-white" fontSize="12" fontWeight="700">{pct}%</text>
      <text x="34" y="44" textAnchor="middle" fill="#5a5a8a" fontSize="6.5">of {total.toLocaleString()}</text>
    </svg>
  );
}

function DonutChartLarge({ pct, total }: { pct: number; total: number }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const filled = (pct / 100) * circ;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" aria-label={`${pct}% of credits used`} role="img">
      <circle cx="50" cy="50" r={r} fill="none" className="stroke-gray-200 dark:stroke-[#1e1e3a]" strokeWidth="9" />
      <circle
        cx="50" cy="50" r={r} fill="none"
        stroke={PROGRESS_COLOR} strokeWidth="9"
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round"
      />
      <text x="50" y="46" textAnchor="middle" className="fill-gray-900 dark:fill-white font-extrabold" fontSize="18" fontWeight="800">{pct}%</text>
      <text x="50" y="62" textAnchor="middle" fill="#7070a0" className="font-semibold" fontSize="8.5">of {total.toLocaleString()}</text>
    </svg>
  );
}

// ── Spark Line ────────────────────────────────────────────────────────────────
function SparkLine({ color = "#1D9E75" }: { color?: string }) {
  return (
    <svg width="72" height="40" viewBox="0 0 72 40" aria-hidden="true">
      <polyline
        points="0,32 12,25 24,28 36,15 48,19 60,8 72,12"
        fill="none" stroke={color} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkBars() {
  const bars = [
    { x: 2, y: 22, h: 18 },
    { x: 16, y: 14, h: 26 },
    { x: 30, y: 6, h: 34 },
    { x: 44, y: 18, h: 22 },
    { x: 58, y: 10, h: 30 },
  ];
  return (
    <svg width="72" height="40" viewBox="0 0 72 40" aria-hidden="true">
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width="10" height={b.h} rx="2.5"
          fill={PROGRESS_COLOR} opacity={0.4 + i * 0.12} />
      ))}
    </svg>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  subColor?: string;
  chart: React.ReactNode;
  accent?: string;
}

function StatCard({ icon, label, value, sub, subColor, chart, accent }: StatCardProps) {
  return (
    <div className="group relative bg-gray-50 dark:bg-[#0A0A0A] rounded-2xl px-5 py-5 min-h-[130px] flex items-center justify-between border border-gray-200 dark:border-[#1F1F1F] hover:border-gray-300 dark:hover:border-[#2A2A2A] transition-all duration-200 hover:bg-gray-100 dark:hover:bg-[#161638] overflow-hidden">
      {/* accent glow */}
      <div
        className="absolute -top-6 -left-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"
        style={{ background: accent || GRAD_FROM }}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 text-[11px] text-gray-500 dark:text-[#6666a0] mb-3 font-semibold tracking-wide uppercase">
          <span
            className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200/50 dark:border-[#1F1F1F]"
            style={{
              color: accent || GRAD_FROM,
              backgroundColor: `${accent || GRAD_FROM}15`,
              borderColor: `${accent || GRAD_FROM}25`
            }}
          >
            {icon}
          </span>
          {label}
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white leading-none mb-1.5">{value}</div>
        <div className="text-[11px] font-medium" style={{ color: subColor || "#4a4a7a" }}>{sub}</div>
      </div>
      <div className="relative z-10 opacity-70 group-hover:opacity-100 transition-opacity">{chart}</div>
    </div>
  );
}

// ── Tutorial Thumb ────────────────────────────────────────────────────────────
function TutThumb({ title, duration, image, onClick }: { title: string; duration: string; image: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className="relative rounded-xl h-48 sm:h-64 w-full cursor-pointer group overflow-hidden border border-gray-200 dark:border-[#1F1F1F] hover:border-gray-300 dark:hover:border-[#2A2A2A] transition-all duration-300 shadow-lg shadow-black/5">
      {/* Background Image */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500 z-0"
        unoptimized
      />
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10 group-hover:from-black/90 group-hover:via-black/55 transition-colors duration-300 z-10" />

      {/* Play Icon in the Center (appears on hover) */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform scale-75 opacity-0 group-hover:scale-110 group-hover:opacity-100 group-hover:bg-white/20 group-hover:border-white/35">
          <Play size={16} fill="white" className="text-white ml-0.5" />
        </div>
      </div>

      {/* Title (Centered in the card, left-aligned text, hides on hover) */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-4 select-none transition-all duration-300 opacity-100 group-hover:opacity-0 transform translate-y-0 group-hover:translate-y-2">
        <div className="text-[15px] sm:text-lg font-extrabold text-white leading-snug tracking-tight drop-shadow-md max-w-[80%] font-sans text-left">
          {title}
        </div>
      </div>

      {/* Duration Badge (Top Right) */}
      <span className="absolute top-3 right-3 bg-black/75 backdrop-blur-sm text-[9px] text-white px-1.5 py-0.5 rounded-md font-medium z-20">
        {duration}
      </span>
    </div>
  );
}

// ── Tips & Inspiration Constant ──────────────────────────────────────────────
const TIPS = [
  {
    title: "Use Detailed Keywords for Better Results",
    desc: "The more specific your keywords are, the more accurately the AI can match your intended subject, style, and visual theme. Detailed keywords often lead to stronger and more consistent scene generation."
  },
  {
    title: "Include a Specific Historical Time Period",
    desc: "When creating history videos, include a time period, civilization, or event. Terms like Ancient Rome, Victorian Era, or World War II help the AI generate visuals that better match your story."
  },
  {
    title: "Specify the Exact Animal Breed",
    desc: "For animal-related videos, include the specific breed whenever possible. Using 'Golden Retriever' instead of simply 'dog' will produce more relevant and consistent imagery throughout your video."
  },
  {
    title: "Longer Scripts Create More Complete Stories",
    desc: "Scripts closer to the 800-character limit typically result in videos around one minute long, giving the AI more context for scene generation and storytelling."
  },
  {
    title: "Top 5 and List Videos Perform Well",
    desc: "List-style content is popular because it is easy to follow and keeps viewers watching to the end. Consider topics like Top 5 Destinations, Top 5 Facts, or Top 5 Dog Breeds."
  },
  {
    title: "Start with Proven Content Categories",
    desc: "If you're unsure where to begin, consider creating videos about history, luxury travel, animals, business, or interesting facts. These categories consistently perform well across social media platforms."
  },
  {
    title: "Use Negative Keywords to Refine Results",
    desc: "Negative keywords help eliminate unwanted styles and elements from your video. This can improve visual consistency and help the AI focus on what matters most."
  },
  {
    title: "Open with a Strong Hook",
    desc: "The first few seconds of a video are critical. Starting with a question, surprising fact, or bold statement can help capture attention and improve viewer retention."
  },
  {
    title: "Experiment with Different Voice Narrators",
    desc: "Each voice has its own personality and tone. Testing different narrators can dramatically change how your content feels and help you connect with different audiences."
  },
  {
    title: "Build Content Faster with Video Queues",
    desc: "Instead of creating videos one at a time, use the queue system to prepare multiple videos in advance. This is a great way to maintain a consistent posting schedule."
  },
  {
    title: "Focus on One Main Topic Per Video",
    desc: "Videos that center around a single topic are often easier to follow and more engaging. Avoid trying to cover too many ideas within the same script."
  },
  {
    title: "Educational Content Builds Trust",
    desc: "People enjoy learning something new. Educational videos that combine storytelling with strong visuals can increase engagement and encourage viewers to follow your content."
  },
  {
    title: "Consistent Posting Beats Perfection",
    desc: "Many successful creators focus on publishing content regularly rather than chasing perfection. Consistency is one of the most important factors in long-term growth."
  },
  {
    title: "Looking for Your Next Video Idea?",
    desc: "Try creating content about unsolved mysteries, world records, luxury lifestyles, historical events, or fascinating animal facts. These topics often attract strong engagement."
  },
  {
    title: "Every Great Video Starts with a Simple Idea",
    desc: "You don't need a complex concept to create engaging content. Start with a topic you're curious about and let AI help transform it into a polished video."
  }
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function DashboardHome() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [currentTip, setCurrentTip] = useState(TIPS[0]);
  const [fade, setFade] = useState(true);
  const [activeTutorial, setActiveTutorial] = useState<{ id: number; title: string; duration: string; image: string; video: string } | null>(null);

  useEffect(() => {
    // Shuffle on mount (client-side only to prevent hydration mismatch)
    const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];
    setCurrentTip(randomTip);
  }, []);

  const handleNextTip = () => {
    setFade(false);
    setTimeout(() => {
      let nextIndex = Math.floor(Math.random() * TIPS.length);
      const currentIndex = TIPS.findIndex(t => t.title === currentTip.title);
      if (currentIndex !== -1) {
        while (nextIndex === currentIndex) {
          nextIndex = Math.floor(Math.random() * TIPS.length);
        }
      }
      setCurrentTip(TIPS[nextIndex]);
      setFade(true);
    }, 150);
  };
  const user = useAppSelector((state) => state.auth.user);
  const [overviewRange, setOverviewRange] = useState("This Month");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<UserNotification | null>(null);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState<string | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const token = useAppSelector((state) => state.auth.token);
  const { data: dashboardData, isLoading: isDashboardLoading } = useGetDashboardQuery(
    undefined,
    { refetchOnMountOrArgChange: true, pollingInterval: 30000, skipPollingIfUnfocused: true, skip: !token }
  );
  const { data: allVideos = [] } = useGetAllVideosQuery(
    { skip: 0, limit: 100 },
    { skip: !token }
  );

  const fetchNotifications = useCallback(async () => {
    setNotificationsLoading(true);
    setNotificationsError(null);
    const tokenVal = token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    try {
      const response = await fetch(`${API_BASE_URL}/v1/users/notifications?limit=50`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(tokenVal ? { Authorization: `Bearer ${tokenVal}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load notifications");
      }

      const data = (await response.json()) as UserNotification[];
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      setNotificationsError("Failed to load notifications");
    } finally {
      setNotificationsLoading(false);
    }
  }, [token]);

  const markNotificationAsRead = async (notificationId: number) => {
    const tokenVal = token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    const response = await fetch(`${API_BASE_URL}/v1/users/notifications/${notificationId}/read`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        ...(tokenVal ? { Authorization: `Bearer ${tokenVal}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to mark notification as read");
    }
  };

  const handleNotificationClick = async (notification: UserNotification) => {
    setShowNotificationMenu(false);
    setSelectedNotification(notification);

    if (notification.is_read) {
      return;
    }

    // Optimistically mark as read instantly in UI
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notification.id ? { ...item, is_read: true } : item
      )
    );

    try {
      await markNotificationAsRead(notification.id);
    } catch {
      // Keep local state marked as read to prevent UI jumping.
    }
  };

  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(() => {
      fetchNotifications();
    }, 60000);

    return () => clearInterval(timer);
  }, [fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setShowNotificationMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return;

    const hasModalOpen =
      showLogoutModal ||
      selectedNotification !== null;

    if (!hasModalOpen) return;

    const scrollY = window.scrollY;
    const originalBodyStyle = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflowY: document.body.style.overflowY,
    };

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflowY = "scroll";

    return () => {
      document.body.style.position = originalBodyStyle.position;
      document.body.style.top = originalBodyStyle.top;
      document.body.style.width = originalBodyStyle.width;
      document.body.style.overflowY = originalBodyStyle.overflowY;
      window.scrollTo(0, scrollY);
    };
  }, [selectedNotification, showLogoutModal]);

  useEffect(() => {
    if (!showProfileMenu) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showProfileMenu]);

  const userName = user?.name || "User";
  const userFirstName = userName.split(" ")[0];
  const userPicture = user?.picture;

  const userCredits = dashboardData ? dashboardData.credits_remaining : (user?.credits ?? 1600);
  const creditsUsed = dashboardData ? dashboardData.credits_used : 0;
  const displayTotalCredits = dashboardData ? (creditsUsed + userCredits) : Math.max(CREDITS_TOTAL, userCredits);
  const creditsPct = displayTotalCredits > 0 ? Math.round((creditsUsed / displayTotalCredits) * 100) : 0;
  const resetDate = dashboardData?.credits_reset_date ? formatDate(dashboardData.credits_reset_date) : RESET_DATE;

  const recentVideos = dashboardData?.recent_videos || [];

  const chartData = useMemo(() => {
    if (!dashboardData) return [];
    const isThisMonth = overviewRange === "This Month";
    const overview = isThisMonth ? dashboardData.credits_overview_this_month : dashboardData.credits_overview_all_time;
    if (!overview || !overview.data) return [];
    return overview.data.map((item) => {
      let label = item.date;
      if (isThisMonth) {
        const parts = item.date.split("-");
        label = parts[2] ? String(parseInt(parts[2], 10)) : item.date;
      } else {
        const parts = item.date.split("-");
        const monthNum = parseInt(parts[1], 10);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        label = monthNum && months[monthNum - 1] ? `${months[monthNum - 1]} ${parts[0].slice(2)}` : item.date;
      }
      return {
        name: label,
        credits: item.credits_used,
      };
    });
  }, [dashboardData, overviewRange]);

  const btnGradient = `linear-gradient(135deg, ${GRAD_FROM}, ${GRAD_TO})`;

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // Even if API fails, clear local state
    }
    dispatch(logoutAction());
    setShowLogoutModal(false);
    router.push("/");
  };

  const unreadNotificationsCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white min-h-screen flex flex-col">

      {/* ── Top Bar ── */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pl-5 lg:pl-7 pr-5 lg:pr-5 py-4 border-b border-gray-200 dark:border-[#1F1F1F] gap-3 sticky top-0 z-20 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-md">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            Welcome back, <span>{userFirstName}</span>!
          </h2>
          <p className="text-xs text-gray-500 dark:text-[#6666a0] mt-0.5">Create stunning videos in minutes with AI.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Upgrade */}
          <button
            onClick={() => router.push("/dashboard/billing?change=1")}
            className="h-11 flex items-center gap-2 text-white text-sm font-semibold px-5 rounded-2xl border border-white/10 hover:opacity-90 active:scale-95 transition-all duration-150"
            style={{ background: btnGradient }}
          >
            <Zap size={15} />
            <span className="hidden xs:inline">Upgrade Plan</span>
            <span className="xs:hidden">Upgrade</span>
          </button>

          {/* Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => {
                const nextValue = !showNotificationMenu;
                setShowNotificationMenu(nextValue);
                if (nextValue && !notificationsLoading) {
                  fetchNotifications();
                }
              }}
              className="relative w-11 h-11 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-white/[0.06] border border-gray-200 dark:border-[#1F1F1F] hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Open notifications"
            >
              <Bell size={18} className="text-gray-600 dark:text-[#9090c0]" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none border border-white dark:border-[#0A0A0A]">
                  {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
                </span>
              )}
            </button>

            {showNotificationMenu && (
              <div className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] bg-white dark:bg-[#0D0D1A] border border-gray-200 dark:border-[#1F1F1F] rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/60 z-30 overflow-hidden animate-in fade-in-50 slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-[#1F1F1F] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h4>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-[#2563EB]/10 text-[#2563EB] text-[10px] font-bold">
                        {unreadNotificationsCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={fetchNotifications}
                    className="text-xs text-[#2563EB] hover:text-[#1D4ED8] font-medium"
                  >
                    Refresh
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-200 dark:divide-[#1F1F1F] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {notificationsLoading ? (
                    <div className="py-8 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Loading...
                    </div>
                  ) : notificationsError ? (
                    <p className="text-sm text-red-500 px-4 py-6">{notificationsError}</p>
                  ) : notifications.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-6 text-center">No notifications.</p>
                  ) : (
                    notifications.map((notification) => {
                      const isUnread = !notification.is_read;
                      return (
                        <button
                          key={notification.id}
                          onClick={() => {
                            handleNotificationClick(notification);
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors relative flex gap-2.5 items-start ${
                            isUnread 
                              ? "bg-blue-50/45 dark:bg-[#2563EB]/5" 
                              : "bg-transparent"
                          }`}
                        >
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-[#2563EB] mt-1.5 shrink-0 animate-pulse" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate ${
                              isUnread 
                                ? "font-bold text-gray-900 dark:text-white" 
                                : "font-medium text-gray-500 dark:text-[#a0a0c0]"
                            }`}>
                              {notification.title}
                            </p>
                            <p className={`text-xs mt-0.5 line-clamp-2 ${
                              isUnread 
                                ? "text-gray-700 dark:text-[#ccccee] font-medium" 
                                : "text-gray-400 dark:text-[#707090]"
                            }`}>
                              {notification.message}
                            </p>
                            <p className="text-[10px] text-gray-400 dark:text-[#606085] mt-1">
                              {new Date(notification.created_at).toLocaleString()}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="h-11 flex items-center gap-2.5 bg-gray-50 dark:bg-white/[0.06] border border-gray-200 dark:border-[#1F1F1F] rounded-2xl pl-1.5 pr-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              {userPicture ? (
                <Image
                  src={userPicture} alt={userName}
                  width={32} height={32} unoptimized referrerPolicy="no-referrer"
                  className="rounded-full object-cover w-8 h-8"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: btnGradient }}
                >
                  {getInitials(userName)}
                </div>
              )}
              <span className="text-xs font-semibold text-gray-700 dark:text-[#ccccee] hidden sm:inline">{userName}</span>
              <ChevronDown size={14} className={`text-gray-500 dark:text-[#9090c0] transition-transform ${showProfileMenu ? "rotate-180" : ""}`} />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0D0D1A] border border-gray-200 dark:border-[#1F1F1F] rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/60 overflow-hidden z-30">
                {/* User Info Section */}
                <div className="px-4 py-3.5 flex items-center gap-3 border-b border-gray-200 dark:border-[#1F1F1F]">
                  {userPicture ? (
                    <Image
                      src={userPicture} alt={userName}
                      width={36} height={36} unoptimized referrerPolicy="no-referrer"
                      className="rounded-full object-cover w-9 h-9 shrink-0 ring-2 ring-white/10"
                    />
                  ) : (
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 ring-2 ring-white/10"
                      style={{ background: btnGradient }}
                    >
                      {getInitials(userName)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{userName}</div>
                    <div className="text-[11px] text-gray-500 dark:text-[#7070a0] truncate">{user?.email || "user@email.com"}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="py-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push("/dashboard/settings");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-[#ccccee] hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
                  >
                    <Settings size={15} className="text-gray-500 dark:text-[#7070a0]" />
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowLogoutModal(true);
                    }}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-70"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>


        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="pl-5 lg:pl-7 pr-5 md:pr-[10%] lg:pr-[10%] py-5 flex flex-col gap-4">

        {/* ── Row 1: Banner (60%) + Credits (25%) ── */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] gap-4">

          {/* Banner */}
          <div
            className="relative rounded-3xl py-6 sm:py-8 md:py-12 pl-6 sm:pl-8 md:pl-8 pr-6 sm:pr-8 md:pr-12 flex items-center overflow-hidden  min-h-[320px] sm:min-h-[380px] md:min-h-[420px]"
          >
            {/* Visual banner image as background */}
            <div className="absolute inset-0 z-0 w-full h-full rounded-3xl overflow-hidden">
              <Image
                src="/banner-image.png"
                alt="Banner Background"
                fill
                priority
                className="object-cover object-right opacity-100 rounded-3xl"
                unoptimized
              />
              {/* Very subtle overall overlay to tie colors together without blocking details */}
              <div className="absolute inset-0 bg-black/[0.04] dark:bg-black/35 z-0" />
            </div>

            {/* Content Container (no background color/card overlay) */}
            <div className="relative z-10 max-w-sm sm:max-w-md pl-0">
              <h3 className="text-3xl sm:text-4xl font-extrabold leading-tight text-gray-900 dark:text-white mb-2 tracking-tight">
                Create your next amazing<br />
                <span className="text-[#ffffff] dark:text-[#ffffff]">
                  video
                </span>
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Turn your ideas into captivating videos with the power of AI.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/dashboard/create")}
                  className="h-10 flex items-center gap-2 text-white text-xs sm:text-sm font-bold px-5 rounded-xl hover:opacity-90 active:scale-95 transition-all duration-150 shadow-md cursor-pointer"
                  style={{ background: btnGradient, boxShadow: `0 4px 15px ${GRAD_FROM}33` }}
                >
                  <Plus size={14} />
                  Create Video
                </button>
              </div>
            </div>
          </div>

          {/* Credits Card */}
          <div className="bg-gray-50 dark:bg-[#0A0A0A] rounded-2xl p-6 flex flex-col border border-gray-200 dark:border-[#1F1F1F] hover:border-gray-300 dark:hover:border-[#2A2A2A] transition-colors min-h-[250px]">
            {/* Card Header */}
            <div className="flex justify-between items-center mb-5">
              <span className="text-base font-bold text-gray-900 dark:text-white">Credits Used</span>
              <button
                onClick={() => router.push("/dashboard/billing")}
                className="text-xs font-semibold hover:underline transition-colors"
                style={{ color: PROGRESS_COLOR }}
              >
                View Details
              </button>
            </div>

            {/* Main Content Area - Evenly spaced to match height */}
            <div className="flex-1 flex flex-col justify-between gap-4">
              {/* Donut Chart (Enlarged and Centered) */}
              <div className="flex justify-center my-1">
                <DonutChartLarge pct={creditsPct} total={displayTotalCredits} />
              </div>

              {/* Rows (Larger text size) */}
              <div className="space-y-2 px-1">
                {[
                  { lbl: "Used", val: creditsUsed.toLocaleString() },
                  { lbl: "Remaining", val: userCredits.toLocaleString() },
                  { lbl: "Reset Date", val: resetDate, muted: true },
                ].map((r) => (
                  <div key={r.lbl} className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-500 dark:text-[#7070a0] font-medium">{r.lbl}</span>
                    <span className={`font-bold ${r.muted ? "text-gray-400 dark:text-[#8888b5]" : "text-gray-900 dark:text-white"}`}>{r.val}</span>
                  </div>
                ))}
              </div>

              {/* Progress bar (thicker) */}
              <div className="w-full bg-gray-200 dark:bg-[#1e1e3a] rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-700"
                  style={{ width: `${creditsPct}%`, background: PROGRESS_COLOR }}
                />
              </div>

              {/* Purchase button */}
              <button
                onClick={() => router.push("/dashboard/billing?buy=1")}
                className="w-full h-12 flex items-center justify-center gap-2 text-white text-sm font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                style={{ background: btnGradient }}
              >
                <Zap size={14} />
                Purchase Credits
              </button>
            </div>
          </div>
        </div>



        {/* ── Row 2: 3 Stat Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard
            icon={<Star size={14} />}
            label="Credits Remaining"
            value={userCredits.toLocaleString()}
            sub={`of ${displayTotalCredits.toLocaleString()} credits`}
            accent={GRAD_FROM}
            chart={
              (() => {
                const pct = displayTotalCredits > 0 ? Math.round((userCredits / displayTotalCredits) * 100) : 100;
                const r = 24;
                const circ = 2 * Math.PI * r;
                const filled = (pct / 100) * circ;
                return (
                  <svg width="68" height="68" viewBox="0 0 68 68" aria-hidden="true" className="shrink-0">
                    <circle cx="34" cy="34" r={r} fill="none" className="stroke-gray-200 dark:stroke-[#1e1e3a]" strokeWidth="5.5" />
                    <circle cx="34" cy="34" r={r} fill="none" stroke={PROGRESS_COLOR} strokeWidth="5.5"
                      strokeDasharray={`${filled} ${circ - filled}`}
                      strokeDashoffset={circ * 0.25} strokeLinecap="round" />
                    <text x="34" y="38" textAnchor="middle" className="fill-gray-900 dark:fill-white" fontSize="11" fontWeight="700">
                      {pct}%
                    </text>
                  </svg>
                );
              })()
            }
          />
          <StatCard
            icon={<Video size={16} />}
            label="Videos Created"
            value={String(dashboardData?.total_videos ?? 0)}
            sub={`+${dashboardData?.videos_this_month ?? 0} this month`}
            subColor="#1D9E75"
            accent="#1D9E75"
            chart={<SparkLine color="#1D9E75" />}
          />

          <StatCard
            icon={<BarChart2 size={16} />}
            label="Monthly Usage"
            value={`${creditsPct}%`}
            sub={`${creditsUsed.toLocaleString()} of ${displayTotalCredits.toLocaleString()} credits`}
            accent={GRAD_TO}
            chart={<SparkBars />}
          />
        </div>

        {/* ── Row 3: Tutorials + Recent Videos ── */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,300px)] gap-4">

          {/* Tutorials */}
          <div className="bg-gray-50 dark:bg-[#0A0A0A] rounded-2xl p-5 border border-gray-200 dark:border-[#1F1F1F]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Play size={14} style={{ color: GRAD_FROM }} />
                <span className="text-sm font-bold">Tutorials &amp; Guides</span>
              </div>
              <button className="text-[11px] font-semibold flex items-center gap-1 hover:underline" style={{ color: PROGRESS_COLOR }}>
                View All <ArrowRight size={11} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {tutorials.map((t) => (
                <TutThumb key={t.id} title={t.title} duration={t.duration} image={t.image} onClick={() => setActiveTutorial(t)} />
              ))}
            </div>
          </div>

          {/* Recent Videos */}
          <div className="bg-gray-50 dark:bg-[#0A0A0A] rounded-2xl p-5 border border-gray-200 dark:border-[#1F1F1F] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Video size={14} style={{ color: GRAD_FROM }} />
                <span className="text-sm font-bold">Recent Videos</span>
              </div>
            </div>

            <div className="flex flex-col flex-1 divide-y divide-gray-200 dark:divide-[#1F1F1F]">
              {isDashboardLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex items-center gap-3 py-3 animate-pulse">
                      <div className="w-14 h-10 rounded-lg bg-white/[0.04] shrink-0" />
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="h-3 bg-white/[0.04] rounded w-3/4" />
                        <div className="h-2.5 bg-white/[0.04] rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentVideos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Video size={20} className="text-[#5a5a8a] mb-2 opacity-55" />
                  <p className="text-xs text-[#5a5a8a]">No generated videos yet.</p>
                  <button
                    onClick={() => router.push("/dashboard/create")}
                    className="mt-3 text-[11px] font-bold text-white px-3 py-1.5 rounded-lg hover:opacity-90 active:scale-95 transition-all"
                    style={{ background: btnGradient }}
                  >
                    Create Your First Video
                  </button>
                </div>
              ) : (
                recentVideos.map((v) => {
                  const status = v.status?.toLowerCase();
                  const isCompleted = status === "completed";
                  const isFailed = status === "failed";
                  const isProcessing = !isCompleted && !isFailed;
                  const bg = isCompleted ? "#1a1040" : isFailed ? "#2a0f0f" : "#2a1e0f";

                  return (
                    <div
                      key={v.id}
                      onClick={() => router.push("/dashboard/videos")}
                      className="flex items-center gap-3 py-3 group cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
                    >
                      <RecentVideoRowThumbnail
                        v={v}
                        videoUrl={allVideos.find((item) => item.id === v.id)?.path ? buildVideoUrl(allVideos.find((item) => item.id === v.id)!.path) : ""}
                        bg={bg}
                        isCompleted={isCompleted}
                        isProcessing={isProcessing}
                        isFailed={isFailed}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate text-gray-800 dark:text-[#ddddff] group-hover:text-gray-950 dark:group-hover:text-white transition-colors">
                          {v.title || "Untitled Video"}
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-[#4a4a70] mt-0.5 flex items-center gap-1.5">
                          {isCompleted && <span>{formatDuration(v.duration)}</span>}
                          {isCompleted && <span>·</span>}
                          <span>{formatDate(v.created_at)}</span>
                        </div>
                      </div>
                      <div>
                        {isCompleted ? (
                          <span className="text-[9px] font-semibold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-md">
                            Ready
                          </span>
                        ) : isProcessing ? (
                          <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md animate-pulse">
                            Running
                          </span>
                        ) : (
                          <span className="text-[9px] font-semibold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-md">
                            Failed
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => router.push("/dashboard/videos")}
              className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold pt-3 border-t border-gray-200 dark:border-[#1F1F1F] hover:underline transition-colors"
              style={{ color: PROGRESS_COLOR }}
            >
              <Video size={12} /> Go to My Videos
            </button>
          </div>
        </div>

        {/* ── Row 4: Overview Chart + Inspiration ── */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,6.5fr)_minmax(0,3.5fr)] gap-4">

          {/* Overview */}
          <div className="bg-gray-50 dark:bg-[#0A0A0A] rounded-2xl p-5 border border-gray-200 dark:border-[#1F1F1F]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} style={{ color: GRAD_FROM }} />
                <span className="text-sm font-bold">Overview</span>
              </div>
              <div className="relative">
                <select
                  value={overviewRange}
                  onChange={(e) => setOverviewRange(e.target.value)}
                  className="appearance-none bg-white dark:bg-[#1e1e3a] border border-gray-200 dark:border-[#1F1F1F] text-gray-600 dark:text-[#9090c0] rounded-lg pl-3 pr-7 py-1.5 text-[11px] font-medium outline-none cursor-pointer hover:border-gray-300 dark:hover:border-[#2A2A2A] transition-colors"
                >
                  <option>This Month</option>
                  <option>All Time</option>
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#9090c0] pointer-events-none" />
              </div>
            </div>
            <ResponsiveContainer
              width="100%"
              height={180}
              className="outline-none focus:outline-none [&_.recharts-wrapper]:outline-none [&_.recharts-wrapper]:focus:outline-none [&_.recharts-wrapper_svg]:outline-none [&_.recharts-wrapper_svg]:focus:outline-none"
              style={{ outline: "none" }}
            >
              <LineChart
                data={chartData}
                margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
                className="outline-none focus:outline-none [&_svg]:outline-none [&_svg]:focus:outline-none"
                style={{ outline: "none" }}
              >
                <XAxis dataKey="name" tick={{ fill: "#4a4a70", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4a4a70", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "rgba(26, 26, 48, 0.95)", border: `1px solid ${GRAD_FROM}44`, borderRadius: 10, fontSize: 12, color: "#fff" }}
                  labelStyle={{ color: "#8888aa" }}
                  itemStyle={{ color: PROGRESS_COLOR }}
                  cursor={{ stroke: `${GRAD_FROM}33`, strokeWidth: 1 }}
                />
                <Line
                  type="monotone" dataKey="credits"
                  stroke={PROGRESS_COLOR} strokeWidth={2.5}
                  dot={false} activeDot={{ r: 4, fill: PROGRESS_COLOR, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tips & Inspiration */}
          <div
            className="rounded-2xl p-6 flex items-center gap-5 border border-gray-200 dark:border-[#1F1F1F] bg-gray-50 dark:bg-[#0A0A0A] relative overflow-hidden"
          >
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-15" style={{ background: GRAD_TO }} />
            
            <div className={`flex-1 relative z-10 transition-opacity duration-150 ${fade ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={14} style={{ color: GRAD_FROM }} />
                <h4 className="text-sm font-bold">Tips &amp; Inspiration</h4>
              </div>
              <h5 className="text-[12px] font-bold text-gray-900 dark:text-white mb-1 leading-snug">
                {currentTip?.title}
              </h5>
              <p className="text-[11px] text-gray-500 dark:text-[#7070a0] leading-relaxed mb-3">
                {currentTip?.desc}
              </p>
              <button
                onClick={handleNextTip}
                className="flex items-center gap-1.5 text-[11px] font-bold hover:underline transition-colors"
                style={{ color: PROGRESS_COLOR }}
              >
                Next Tip <ArrowRight size={11} />
              </button>
            </div>

            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 relative z-10"
              style={{ background: `${GRAD_FROM}25`, border: `1px solid ${GRAD_FROM}40` }}
            >
              <Lightbulb size={28} style={{ color: GRAD_FROM }} className="opacity-80" />
            </div>
          </div>
        </div>

      </main>

      <Footer />

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] grid place-items-center p-4">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />

          {/* Modal */}
          <div className="relative z-10 bg-white dark:bg-[#111128] border border-gray-200 dark:border-[#1F1F1F] rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-black/10 dark:shadow-black/80 animate-in">
            {/* Warning Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white">
              Confirm Logout
            </h3>
            <p className="text-gray-500 dark:text-[#8888bb] text-sm text-center mb-8">
              Are you sure you want to sign out of your account?
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-white/[0.06] dark:hover:bg-white/10 border border-gray-200 dark:border-[#1F1F1F] text-gray-900 dark:text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-75"
              >
                <LogOut className="w-4 h-4" />
                {isLoggingOut ? "Logging out..." : "Yes, Logout"}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedNotification && (
        <NotificationDetailsModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
          onViewVideo={(videoId) => {
            router.push(`/dashboard/videos/${videoId}`);
            setSelectedNotification(null);
          }}
        />
      )}

      {/* Tutorial Video Player Modal */}
      {activeTutorial && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setActiveTutorial(null)}
          />
          
          {/* Modal Card */}
          <div className="relative bg-[#080816] rounded-3xl w-full max-w-4xl mx-auto shadow-2xl border border-gray-800/80 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300 z-10">
            {/* Header */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-800/50 bg-[#04040a]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Play size={16} className="text-blue-500 fill-blue-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">{activeTutorial.title}</h3>
                  <p className="text-[10px] text-gray-400 font-medium">Video Tutorial • {activeTutorial.duration}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTutorial(null)} 
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Video Container */}
            <div className="aspect-video bg-black relative flex items-center justify-center">
              <video
                src={activeTutorial.video}
                controls
                autoPlay
                className="w-full h-full max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}