"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useLogoutMutation } from "@/lib/redux/features/auth/authApi";
import { logout as logoutAction } from "@/lib/redux/features/auth/authSlice";
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

const recentVideos = [
  { id: 1, title: "YouTube Explainer Video", duration: "02:15", date: "May 18, 2025", bg: "#1a1040" },
  { id: 2, title: "Social Media Ad", duration: "00:30", date: "May 16, 2025", bg: "#0f2a10", label: "50% OFF" },
  { id: 3, title: "Company Introduction", duration: "01:20", date: "May 15, 2025", bg: "#1a1a2a" },
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

// ── Donut SVG ─────────────────────────────────────────────────────────────────
function DonutChart({ pct, total }: { pct: number; total: number }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const filled = (pct / 100) * circ;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" aria-label={`${pct}% of credits used`} role="img">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#1e1e3a" strokeWidth="10" />
      <circle
        cx="40" cy="40" r={r} fill="none"
        stroke={PROGRESS_COLOR} strokeWidth="10"
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round"
      />
      <text x="40" y="37" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">{pct}%</text>
      <text x="40" y="50" textAnchor="middle" fill="#5a5a8a" fontSize="7">of {total.toLocaleString()}</text>
    </svg>
  );
}

// ── Spark Line ────────────────────────────────────────────────────────────────
function SparkLine({ color = "#1D9E75" }: { color?: string }) {
  return (
    <svg width="56" height="32" viewBox="0 0 56 32" aria-hidden="true">
      <polyline
        points="0,26 9,20 18,22 27,12 36,15 46,6 56,9"
        fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkBars() {
  const bars = [
    { x: 2, y: 18, h: 14 },
    { x: 13, y: 12, h: 20 },
    { x: 24, y: 6, h: 26 },
    { x: 35, y: 14, h: 18 },
    { x: 46, y: 8, h: 24 },
  ];
  return (
    <svg width="56" height="32" viewBox="0 0 56 32" aria-hidden="true">
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width="8" height={b.h} rx="2"
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
    <div className="group relative bg-[#0A0A0A] rounded-2xl px-5 py-6 min-h-[130px] flex items-center justify-between border border-white/[0.06] hover:border-white/[0.12] transition-all duration-200 hover:bg-[#161638] overflow-hidden">
      {/* accent glow */}
      <div
        className="absolute -top-6 -left-6 w-20 h-20 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"
        style={{ background: accent || GRAD_FROM }}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 text-[11px] text-[#6666a0] mb-3 font-semibold tracking-wide uppercase">
          <span 
            className="flex items-center justify-center w-7 h-7 rounded-lg border"
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
        <div className="text-2xl font-bold text-white leading-none mb-1.5">{value}</div>
        <div className="text-[11px] font-medium" style={{ color: subColor || "#4a4a7a" }}>{sub}</div>
      </div>
      <div className="relative z-10 opacity-70 group-hover:opacity-100 transition-opacity">{chart}</div>
    </div>
  );
}

// ── Tutorial Thumb ────────────────────────────────────────────────────────────
function TutThumb({ duration }: { duration: string }) {
  return (
    <div className="relative rounded-xl bg-gradient-to-br from-[#1a1040] to-[#2a1860] aspect-video flex items-center justify-center mb-2 cursor-pointer group overflow-hidden border border-white/[0.06] hover:border-white/[0.15] transition-all">
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

// ── Main Component ────────────────────────────────────────────────────────────
export default function DashboardHome() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [overviewRange, setOverviewRange] = useState("This Month");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

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
  const userPicture = user?.picture;
  const userCredits = user?.credits ?? 1600;
  const displayTotalCredits = Math.max(CREDITS_TOTAL, userCredits);
  const creditsUsed = Math.max(0, displayTotalCredits - userCredits);
  const creditsPct = displayTotalCredits > 0 ? Math.round((creditsUsed / displayTotalCredits) * 100) : 0;

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
    <div className="bg-[#0A0A0A] text-white min-h-screen flex flex-col">

      {/* ── Top Bar ── */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 lg:px-7 py-4 border-b border-white/[0.06] gap-3 sticky top-0 z-20 bg-[#0A0A0A]/95 backdrop-blur-md">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            Welcome back, <span>{userName}</span>! 👋
          </h2>
          <p className="text-xs text-[#6666a0] mt-0.5">Create stunning videos in minutes with AI.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Upgrade */}
          <button
            onClick={() => router.push("/dashboard/billing")}
            className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl border border-white/10 hover:opacity-90 active:scale-95 transition-all duration-150"
            style={{ background: btnGradient }}
          >
            <Zap size={15} />
            <span className="hidden xs:inline">Upgrade Plan</span>
            <span className="xs:hidden">Upgrade</span>
          </button>

          {/* Bell */}
          <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/10 transition-colors">
            <Bell size={16} className="text-[#9090c0]" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>

          {/* Avatar */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-xl pl-1 pr-3 py-1.5 cursor-pointer hover:bg-white/10 transition-colors"
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
              <span className="text-xs font-medium text-[#ccccee] hidden sm:inline">{userName}</span>
              <ChevronDown size={14} className={`text-[#9090c0] transition-transform ${showProfileMenu ? "rotate-180" : ""}`} />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-[#0A0A0A] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden z-30">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    router.push("/dashboard/settings");
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2.5 text-sm text-[#d7d7ff] hover:bg-white/[0.06] transition-colors"
                >
                  <Settings size={14} />
                  Settings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowLogoutModal(true);
                  }}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-2 px-3.5 py-2.5 text-sm text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-70"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>

        
        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="px-5 lg:px-7 py-5 flex flex-col gap-4">

        {/* ── Row 1: Banner (70%) + Credits (30%) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] gap-4">

          {/* Banner */}
          <div
            className="relative rounded-2xl p-6 sm:p-8 flex items-center justify-between overflow-hidden border border-white/[0.07] min-h-[160px]"
            style={{ background: "#0A0A0A" }}
          >
            {/* decorative circles */}
            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-10" style={{ background: btnGradient }} />
            <div className="absolute -right-4 -bottom-8 w-32 h-32 rounded-full opacity-10" style={{ background: GRAD_TO }} />

            <div className="relative z-10">
      
              <h3 className="text-2xl sm:text-3xl font-semibold leading-snug text-white mb-2">
                Create your next<br />
                <span>
                  amazing video
                </span>
              </h3>
              <p className="text-sm text-[#8888bb] mb-4 max-w-xs leading-relaxed">
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

                <button
                  // onClick={() => router.push("/dashboard/create")}
                  className="h-11 flex items-center gap-2 text-white text-sm font-bold px-5 rounded-xl hover:opacity-90 active:scale-95 transition-all duration-150 shadow-lg"
                  style={{ background: "#1e1255", boxShadow: "0 4px 20px rgba(30,18,85,0.55)" }}
                >
                  <Plus size={14} />
                  Choose a Template
                </button>
              </div>
            </div>

            {/* Visual icon */}
            <div
              className="hidden sm:flex w-24 h-24 lg:w-28 lg:h-28 rounded-2xl items-center justify-center shrink-0 relative z-10 ml-4"
              style={{ background: "rgba(132,54,217,0.18)", border: "1px solid rgba(132,54,217,0.3)" }}
            >
              <Clapperboard size={44} className="opacity-60" style={{ color: GRAD_FROM }} />
            </div>
          </div>

          {/* Credits Card */}
          <div className="bg-[#0A0A0A] rounded-2xl p-5 flex flex-col border border-white/[0.07] hover:border-white/[0.12] transition-colors">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-white">Credits Used</span>
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
              <DonutChart pct={creditsPct} total={CREDITS_TOTAL} />
              <div className="flex-1 space-y-2">
                {[
                  { lbl: "Used", val: creditsUsed.toLocaleString() },
                  { lbl: "Remaining", val: userCredits.toLocaleString() },
                  { lbl: "Reset Date", val: RESET_DATE, muted: true },
                ].map((r) => (
                  <div key={r.lbl} className="flex justify-between items-center">
                    <span className="text-[11px] text-[#5a5a8a]">{r.lbl}</span>
                    <span className={`text-[11px] font-semibold ${r.muted ? "text-[#7070a0]" : "text-white"}`}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#1e1e3a] rounded-full h-1.5 mb-4 overflow-hidden">
              <div
                className="h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${creditsPct}%`, background: PROGRESS_COLOR }}
              />
            </div>

            <button
              onClick={() => router.push("/dashboard/billing")}
              className="w-full h-11 flex items-center justify-center gap-2 text-white text-sm font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all mt-auto"
              style={{ background: btnGradient }}
            >
              <Zap size={13} />
              Purchase Credits
            </button>
          </div>
        </div>

        {/* ── Row 2: 4 Stat Cards ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <StatCard
            icon={<Star size={14} />}
            label="Credits Remaining"
            value={userCredits.toLocaleString()}
            sub={`of ${displayTotalCredits.toLocaleString()} credits`}
            accent={GRAD_FROM}
            chart={
              (() => {
                const pct = 82; // Set to 82% as requested, where 100% will be fully filled
                const r = 24;
                const circ = 2 * Math.PI * r;
                const filled = (pct / 100) * circ;
                return (
                  <svg width="68" height="68" viewBox="0 0 68 68" aria-hidden="true" className="shrink-0">
                    <circle cx="34" cy="34" r={r} fill="none" stroke="##0A0A0A" strokeWidth="5.5" />
                    <circle cx="34" cy="34" r={r} fill="none" stroke={PROGRESS_COLOR} strokeWidth="5.5"
                      strokeDasharray={`${filled} ${circ - filled}`}
                      strokeDashoffset={circ * 0.25} strokeLinecap="round" />
                    <text x="34" y="39" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">
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
            value="38"
            sub="+6 this month"
            subColor="#1D9E75"
            accent="#1D9E75"
            chart={<SparkLine color="#1D9E75" />}
          />
          <StatCard
            icon={<Clock size={16} />}
            label="Render Time"
            value="14.2 hrs"
            sub="+2.5 hrs this month"
            subColor="#EF9F27"
            accent="#EF9F27"
            chart={<SparkLine color="#EF9F27" />}
          />
          <StatCard
            icon={<BarChart2 size={16} />}
            label="Monthly Usage"
            value="72%"
            sub="3,600 of 5,000 credits"
            accent={GRAD_TO}
            chart={<SparkBars />}
          />
        </div>

        {/* ── Row 3: Tutorials + Recent Videos ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] gap-4">

          {/* Tutorials */}
          <div className="bg-[#0A0A0A] rounded-2xl p-5 border border-white/[0.07]">
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
                  <div className="text-[11px] font-semibold text-[#ddddff] group-hover:text-white transition-colors">{t.title}</div>
                  <div className="text-[10px] text-[#4a4a70] mt-0.5 leading-relaxed">{t.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Videos */}
          <div className="bg-[#0A0A0A] rounded-2xl p-5 border border-white/[0.07] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Video size={14} style={{ color: GRAD_FROM }} />
                <span className="text-sm font-bold">Recent Videos</span>
              </div>
            </div>

            <div className="flex flex-col flex-1 divide-y divide-white/[0.05]">
              {recentVideos.map((v) => (
                <div key={v.id} className="flex items-center gap-3 py-3 group cursor-pointer">
                  <div
                    className="w-14 h-10 rounded-lg shrink-0 flex items-center justify-center border border-white/[0.06]"
                    style={{ background: v.bg }}
                  >
                    {v.label ? (
                      <span className="text-[8px] font-bold text-green-400 text-center leading-tight px-1">{v.label}</span>
                    ) : (
                      <Play size={12} fill="rgba(255,255,255,0.4)" className="text-transparent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate text-[#ddddff] group-hover:text-white transition-colors">{v.title}</div>
                    <div className="text-[10px] text-[#4a4a70] mt-0.5">{v.duration} · {v.date}</div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[#5a5a8a] hover:text-white p-1 rounded-lg hover:bg-white/10">
                    <MoreVertical size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/dashboard/videos")}
              className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold pt-3 border-t border-white/[0.05] hover:underline transition-colors"
              style={{ color: PROGRESS_COLOR }}
            >
              <Video size={12} /> Go to My Videos
            </button>
          </div>
        </div>

        {/* ── Row 4: Overview Chart + Inspiration ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Overview */}
          <div className="bg-[#0A0A0A] rounded-2xl p-5 border border-white/[0.07]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} style={{ color: GRAD_FROM }} />
                <span className="text-sm font-bold">Overview</span>
              </div>
              <div className="relative">
                <select
                  value={overviewRange}
                  onChange={(e) => setOverviewRange(e.target.value)}
                  className="appearance-none bg-[#1e1e3a] border border-white/10 text-[#9090c0] rounded-lg pl-3 pr-7 py-1.5 text-[11px] font-medium outline-none cursor-pointer hover:border-white/20 transition-colors"
                >
                  <option>This Month</option>
                  <option>Last Month</option>
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9090c0] pointer-events-none" />
              </div>
            </div>
            <ResponsiveContainer
              width="100%"
              height={140}
              className="outline-none focus:outline-none [&_.recharts-wrapper]:outline-none [&_.recharts-wrapper]:focus:outline-none [&_.recharts-wrapper_svg]:outline-none [&_.recharts-wrapper_svg]:focus:outline-none"
              style={{ outline: "none" }}
            >
              <LineChart
                data={overviewData}
                margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
                className="outline-none focus:outline-none [&_svg]:outline-none [&_svg]:focus:outline-none"
                style={{ outline: "none" }}
              >
                <XAxis dataKey="day" tick={{ fill: "#4a4a70", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4a4a70", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1a1a30", border: `1px solid ${GRAD_FROM}44`, borderRadius: 10, fontSize: 12, color: "#fff" }}
                  labelStyle={{ color: "#8888aa" }}
                  itemStyle={{ color: PROGRESS_COLOR }}
                  cursor={{ stroke: `${GRAD_FROM}33`, strokeWidth: 1 }}
                />
                <Line
                  type="monotone" dataKey="videos"
                  stroke={PROGRESS_COLOR} strokeWidth={2.5}
                  dot={false} activeDot={{ r: 4, fill: PROGRESS_COLOR, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tips & Inspiration */}
          <div
            className="rounded-2xl p-6 flex items-center gap-5 border border-white/[0.07] relative overflow-hidden"
            style={{ background: "#0A0A0A" }}
          >
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-15" style={{ background: GRAD_TO }} />
            <div className="flex-1 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={14} style={{ color: GRAD_FROM }} />
                <h4 className="text-sm font-bold">Tips &amp; Inspiration</h4>
              </div>
              <p className="text-[11px] text-[#7070a0] leading-relaxed mb-3">
                Discover creative ideas and best practices to make your videos stand out.
              </p>
              <button
                className="flex items-center gap-1.5 text-[11px] font-bold hover:underline transition-colors"
                style={{ color: PROGRESS_COLOR }}
              >
                Explore Inspiration <ArrowRight size={11} />
              </button>
            </div>
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 relative z-10"
              style={{ background: `${GRAD_FROM}25`, border: `1px solid ${GRAD_FROM}40` }}
            >
              <Play size={28} style={{ color: GRAD_FROM }} className="opacity-80 ml-1" fill={GRAD_FROM} />
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
          <div className="relative z-10 bg-[#111128] border border-white/[0.08] rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-black/80 animate-in">
            {/* Warning Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-center mb-2 text-white">
              Confirm Logout
            </h3>
            <p className="text-[#8888bb] text-sm text-center mb-8">
              Are you sure you want to sign out of your account? 
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-white/[0.06] hover:bg-white/10 border border-white/[0.08] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
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