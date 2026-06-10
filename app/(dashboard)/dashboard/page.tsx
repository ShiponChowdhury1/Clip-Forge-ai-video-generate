"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useLogoutMutation } from "@/lib/redux/features/auth/authApi";
import { logout as logoutAction } from "@/lib/redux/features/auth/authSlice";
import { useGetDashboardQuery, useGetAllVideosQuery } from "@/lib/redux/features/videos/videosApi";
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
} from "lucide-react";

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
  { id: 1, title: "Getting Started", duration: "0:52", desc: "A quick guide to get started with ClipForge." },
  { id: 2, title: "Using Templates", duration: "1:15", desc: "Customize templates for your videos." },
  { id: 3, title: "AI Features", duration: "1:42", desc: "Explore the power of AI tools in ClipForge." },
  { id: 4, title: "Export & Share", duration: "1:05", desc: "Export and share your videos easily." },
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
function TutThumb({ duration }: { duration: string }) {
  return (
    <div className="relative rounded-xl bg-gradient-to-br from-[#1a1040] to-[#2a1860] aspect-video flex items-center justify-center mb-2 cursor-pointer group overflow-hidden border border-gray-200 dark:border-[#1F1F1F] hover:border-gray-300 dark:hover:border-[#2A2A2A] transition-all">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 duration-200"
        style={{ background: `linear-gradient(135deg, ${GRAD_FROM}, ${GRAD_TO})` }}
      >
        <Play size={12} fill="white" className="text-white ml-0.5" />
      </div>
      <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-[9px] text-white px-1.5 py-0.5 rounded-md font-medium">
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

  return (
    <div className="bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white min-h-screen flex flex-col">

      {/* ── Top Bar ── */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pl-5 lg:pl-7 pr-5 lg:pr-5 py-4 border-b border-gray-200 dark:border-[#1F1F1F] gap-3 sticky top-0 z-20 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-md">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            Welcome back, <span>{userFirstName}</span>! 👋
          </h2>
          <p className="text-xs text-gray-500 dark:text-[#6666a0] mt-0.5">Create stunning videos in minutes with AI.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Upgrade */}
          <button
            onClick={() => router.push("/dashboard/billing?change=1")}
            className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl border border-white/10 hover:opacity-90 active:scale-95 transition-all duration-150"
            style={{ background: btnGradient }}
          >
            <Zap size={15} />
            <span className="hidden xs:inline">Upgrade Plan</span>
            <span className="xs:hidden">Upgrade</span>
          </button>

          {/* Bell */}
          <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/[0.06] border border-gray-200 dark:border-[#1F1F1F] hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <Bell size={16} className="text-gray-600 dark:text-[#9090c0]" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>

          {/* Avatar */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="flex items-center gap-2 bg-gray-50 dark:bg-white/[0.06] border border-gray-200 dark:border-[#1F1F1F] rounded-xl pl-1 pr-3 py-1.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              {userPicture ? (
                <Image
                  src={userPicture} alt={userName}
                  width={28} height={28} unoptimized referrerPolicy="no-referrer"
                  className="rounded-full object-cover w-7 h-7"
                />
              ) : (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: btnGradient }}
                >
                  {getInitials(userName)}
                </div>
              )}
              <span className="text-xs font-medium text-gray-700 dark:text-[#ccccee] hidden sm:inline">{userName}</span>
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
            className="relative rounded-2xl p-6 sm:p-8 flex items-center justify-between overflow-hidden border border-gray-200 dark:border-[#1F1F1F] bg-gray-50 dark:bg-[#0A0A0A] min-h-[250px]"
          >
            {/* decorative circles */}
            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-10" style={{ background: btnGradient }} />
            <div className="absolute -right-4 -bottom-8 w-32 h-32 rounded-full opacity-10" style={{ background: GRAD_TO }} />

            <div className="relative z-10 w-1/2 shrink-0">

              <h3 className="text-2xl sm:text-3xl font-semibold leading-snug text-gray-900 dark:text-white mb-2">
                Create your next amazing<br />
                <span>
                 video
                </span>
              </h3>
              <p className="text-sm text-gray-600 dark:text-[#8888bb] mb-4 max-w-xs leading-relaxed">
                Turn your ideas into captivating videos with the power of AI.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => router.push("/dashboard/create")}
                  className="h-11 flex items-center gap-2 text-white text-sm font-bold px-5 rounded-xl hover:opacity-90 active:scale-95 transition-all duration-150 shadow-lg"
                  style={{ background: btnGradient, boxShadow: `0 4px 20px ${GRAD_FROM}55` }}
                >
                  <Plus size={14} />
                  Create Video
                </button>

                {/* <button
                  // onClick={() => router.push("/dashboard/create")}
                  className="h-11 flex items-center gap-2 text-white text-sm font-bold px-5 rounded-xl hover:opacity-90 active:scale-95 transition-all duration-150 shadow-lg"
                  style={{ background: "#1e1255", boxShadow: "0 4px 20px rgba(30,18,85,0.55)" }}
                >
                  <Plus size={14} />
                  Choose a Template
                </button> */}
              </div>
            </div>

            {/* Visual banner image */}
            <div className="hidden sm:block absolute right-0 bottom-0 top-0 w-1/2 z-10">
              <Image
                src="/banner1.png"
                alt="Banner Illustration"
                fill
                priority
                className="object-cover object-right-bottom rounded-r-2xl"
              />
            </div>
          </div>

          {/* Credits Card */}
          <div className="bg-gray-50 dark:bg-[#0A0A0A] rounded-2xl p-5 flex flex-col border border-gray-200 dark:border-[#1F1F1F] hover:border-gray-300 dark:hover:border-[#2A2A2A] transition-colors min-h-[250px]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-gray-900 dark:text-white">Credits Used</span>
              <button
                onClick={() => router.push("/dashboard/billing")}
                className="text-[11px] font-semibold hover:underline transition-colors"
                style={{ color: PROGRESS_COLOR }}
              >
                View Details
              </button>
            </div>

            {/* Donut + rows */}
            <div className="flex items-center gap-4 mb-4">
              <DonutChart pct={creditsPct} total={displayTotalCredits} />
              <div className="flex-1 space-y-1">
                {[
                  { lbl: "Used", val: creditsUsed.toLocaleString() },
                  { lbl: "Remaining", val: userCredits.toLocaleString() },
                  { lbl: "Reset Date", val: resetDate, muted: true },
                ].map((r) => (
                  <div key={r.lbl} className="flex justify-between items-center">
                    <span className="text-[11px] text-gray-500 dark:text-[#5a5a8a]">{r.lbl}</span>
                    <span className={`text-[11px] font-semibold ${r.muted ? "text-gray-400 dark:text-[#7070a0]" : "text-gray-900 dark:text-white"}`}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-[#1e1e3a] rounded-full h-1.5 mb-4 overflow-hidden">
              <div
                className="h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${creditsPct}%`, background: PROGRESS_COLOR }}
              />
            </div>

            <button
              onClick={() => router.push("/dashboard/billing?buy=1")}
              className="w-full h-11 flex items-center justify-center gap-2 text-white text-sm font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all mt-auto"
              style={{ background: btnGradient }}
            >
              <Zap size={13} />
              Purchase Credits
            </button>
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
                <div key={t.id} className="group cursor-pointer">
                  <TutThumb duration={t.duration} />
                  <div className="text-[11px] font-semibold text-gray-700 dark:text-[#ddddff] group-hover:text-gray-950 dark:group-hover:text-white transition-colors">{t.title}</div>
                  <div className="text-[10px] text-gray-500 dark:text-[#4a4a70] mt-0.5 leading-relaxed">{t.desc}</div>
                </div>
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
    </div>
  );
}