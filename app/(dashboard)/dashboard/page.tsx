"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Bell, Plus, Zap } from "lucide-react";

// ── Static mock data ──────────────────────────────────────────────────────────
const CREDITS_TOTAL = 5000;
const RESET_DATE = "Jun 1, 2026";

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
  { id: 2, title: "Using Templates", duration: "1:15", desc: "Learn how to customize templates for your videos." },
  { id: 3, title: "AI Features Overview", duration: "1:42", desc: "Explore the power of AI tools in ClipForge." },
  { id: 4, title: "Export & Share", duration: "1:05", desc: "Learn how to export and share your videos." },
];

// ── Helper: get initials ──────────────────────────────────────────────────────
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ── Donut SVG ─────────────────────────────────────────────────────────────────
function DonutChart({ pct, total }: { pct: number; total: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const filled = (pct / 100) * circ;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" aria-label={`${pct}% of credits used`} role="img">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#222244" strokeWidth="10" />
      <circle
        cx="36" cy="36" r={r} fill="none"
        stroke="#7E36DD" strokeWidth="10"
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round"
      />
      <text x="36" y="33" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">{pct}%</text>
      <text x="36" y="45" textAnchor="middle" fill="#666" fontSize="7">of {total.toLocaleString()} credits</text>
    </svg>
  );
}

// ── Mini spark line ───────────────────────────────────────────────────────────
function SparkLine({ color = "#1D9E75" }: { color?: string }) {
  return (
    <svg width="60" height="36" viewBox="0 0 60 36" aria-hidden="true">
      <polyline
        points="0,28 10,22 20,24 30,14 40,16 50,8 60,10"
        fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkBars() {
  return (
    <svg width="60" height="36" viewBox="0 0 60 36" aria-hidden="true">
      {[
        [4, 20, 16], [16, 14, 22], [28, 8, 28], [40, 16, 20], [52, 10, 26],
      ].map(([x, y, h], i) => (
        <rect key={i} x={x} y={y} width="8" height={h} rx="2" fill="#7E36DD" opacity={0.5 + i * 0.1} />
      ))}
    </svg>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, subColor, chart }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  subColor?: string;
  chart: React.ReactNode;
}) {
  return (
    <div className="bg-[#161630] rounded-[10px] p-3 flex items-center justify-between">
      <div>
        <div className="text-[10px] text-[#888] flex items-center gap-1 mb-1">
          <span className="text-[#7E36DD] text-[13px]">{icon}</span>
          {label}
        </div>
        <div className="text-xl font-semibold">{value}</div>
        <div className="text-[10px] mt-0.5" style={{ color: subColor || "#666" }}>{sub}</div>
      </div>
      <div className="hidden sm:block">{chart}</div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DashboardHome() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [overviewRange, setOverviewRange] = useState("This Month");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userName = mounted ? (user?.name || "User") : "User";
  const userPicture = mounted ? user?.picture : undefined;
  const userCredits = mounted ? (user?.credits ?? 0) : 0;
  const creditsUsed = CREDITS_TOTAL - userCredits;
  const creditsPct = Math.round((creditsUsed / CREDITS_TOTAL) * 100);

  return (
    <div className="bg-[#0d0d1a] text-white min-h-screen flex flex-col font-[Inter,sans-serif]">
      {/* ── Top bar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 lg:px-6 border-b border-white/[0.07] gap-3">
        <div>
          <h2 className="text-base sm:text-xl font-semibold m-0">Welcome back, {userName}! 👋</h2>
          <p className="text-xs text-[#8888aa] mt-1">Create stunning videos in minutes with AI.</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {/* Upgrade Plan */}
          <button
            className="bg-gradient-to-br from-[#7E36DD] to-[#6C6CE3] text-white border-none rounded-lg px-3 py-1.5 text-xs cursor-pointer flex items-center font-medium hover:opacity-90 transition-opacity"
            onClick={() => router.push("/dashboard/billing")}
          >
            <Zap size={14} className="mr-1" />
            <span className="hidden xs:inline">Upgrade Plan</span>
            <span className="xs:hidden">Upgrade</span>
          </button>

          {/* Notification Bell */}
          <button className="bg-white/[0.06] border-none rounded-lg text-[#aaa] w-[34px] h-[34px] cursor-pointer flex items-center justify-center relative hover:bg-white/10 transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-[7px] w-[7px] h-[7px] bg-red-500 rounded-full border-[1.5px] border-[#0d0d1a]" />
          </button>

          {/* Profile Pic + Name */}
          <div className="flex items-center gap-2 bg-white/[0.06] rounded-lg pl-1 pr-3 py-1 cursor-pointer">
            {userPicture ? (
              <Image
                src={userPicture}
                alt={userName}
                width={30}
                height={30}
                unoptimized
                referrerPolicy="no-referrer"
                className="rounded-full object-cover w-[30px] h-[30px]"
              />
            ) : (
              <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#7E36DD] to-[#6C6CE3] flex items-center justify-center text-[11px] font-semibold text-white">
                {getInitials(userName)}
              </div>
            )}
            <span className="text-xs font-medium text-[#ddd] hidden sm:inline">{userName}</span>
          </div>

          {/* Create New Video */}
          <button
            className="bg-gradient-to-br from-[#7E36DD] to-[#6C6CE3] text-white border-none rounded-lg px-3 sm:px-4 py-1.5 text-xs cursor-pointer flex items-center font-medium hover:opacity-90 transition-opacity"
            onClick={() => router.push("/dashboard/create")}
          >
            <Plus size={14} className="mr-1" />
            <span className="hidden sm:inline">Create New Video</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      <div className="p-4 lg:px-6 flex flex-col gap-3.5">
        {/* ── Row 1: Banner + Credits ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-3.5">
          {/* Banner */}
          <div className="bg-gradient-to-br from-[#1a1040] via-[#2a1860] to-[#1a1040] rounded-xl p-5 sm:p-6 flex items-center justify-between min-h-[130px] sm:min-h-[150px]">
            <div>
              <h3 className="text-lg sm:text-[22px] font-bold leading-tight m-0">Create your next<br />amazing video</h3>
              <p className="text-xs text-[#8888bb] mt-2 mb-3.5">Turn your ideas into captivating videos<br className="hidden sm:block" />with the power of AI.</p>
              <button
                className="bg-gradient-to-br from-[#7E36DD] to-[#6C6CE3] text-white border-none rounded-lg px-4 py-2 text-xs cursor-pointer flex items-center font-medium hover:opacity-90 transition-opacity"
                onClick={() => router.push("/dashboard/create")}
              >
                <Plus size={14} className="mr-1" />
                Create Video
              </button>
            </div>
            <div className="w-[80px] h-[64px] sm:w-[100px] sm:h-[80px] bg-[rgba(126,54,221,0.2)] rounded-[10px] flex items-center justify-center shrink-0 ml-4">
              <span className="text-3xl sm:text-5xl opacity-50">🎬</span>
            </div>
          </div>

          {/* Credits card */}
          <div className="bg-[#161630] rounded-xl p-4">
            <div className="flex justify-between items-center mb-3.5">
              <span className="text-[13px] font-medium">Credits Used</span>
              <span
                className="text-[11px] text-[#7E36DD] cursor-pointer hover:underline"
                onClick={() => router.push("/dashboard/billing")}
              >
                View Details
              </span>
            </div>
            <div className="flex items-center gap-3.5 mb-3.5">
              <DonutChart pct={creditsPct} total={CREDITS_TOTAL} />
              <div className="flex-1">
                <div className="flex justify-between text-[11px] py-[3px]">
                  <span className="text-[#888]">Used</span>
                  <span className="text-white font-medium">{creditsUsed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] py-[3px]">
                  <span className="text-[#888]">Remaining</span>
                  <span className="text-white font-medium">{userCredits.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] py-[3px]">
                  <span className="text-[#888]">Reset Date</span>
                  <span className="text-[#aaa] font-medium">{RESET_DATE}</span>
                </div>
              </div>
            </div>
            <button
              className="w-full bg-gradient-to-br from-[#7E36DD] to-[#6C6CE3] text-white border-none rounded-lg py-2.5 text-xs cursor-pointer flex items-center justify-center font-medium hover:opacity-90 transition-opacity"
              onClick={() => router.push("/dashboard/billing")}
            >
              <Zap size={14} className="mr-1" />
              Upgrade Plan
            </button>
          </div>
        </div>

        {/* ── Row 2: Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          <StatCard
            icon="⭐"
            label="Credits Remaining"
            value={userCredits.toLocaleString()}
            sub={`of ${CREDITS_TOTAL.toLocaleString()} credits`}
            chart={
              <svg width="60" height="36" viewBox="0 0 60 36" aria-hidden="true">
                <circle cx="30" cy="18" r="14" fill="none" stroke="#222244" strokeWidth="5" />
                <circle cx="30" cy="18" r="14" fill="none" stroke="#7E36DD" strokeWidth="5"
                  strokeDasharray="44 88" strokeDashoffset="22" strokeLinecap="round" />
                <text x="30" y="22" textAnchor="middle" fill="#aaa" fontSize="8">
                  {Math.round((userCredits / CREDITS_TOTAL) * 100)}%
                </text>
              </svg>
            }
          />
          <StatCard
            icon="🎥"
            label="Videos Created"
            value="38"
            sub="+6 this month"
            subColor="#1D9E75"
            chart={<SparkLine color="#1D9E75" />}
          />
          <StatCard
            icon="⏱"
            label="Render Time"
            value="14.2 hrs"
            sub="+2.5 hrs this month"
            subColor="#EF9F27"
            chart={<SparkLine color="#EF9F27" />}
          />
          <StatCard
            icon="📊"
            label="Monthly Usage"
            value="72%"
            sub="3,600 of 5,000 credits"
            chart={<SparkBars />}
          />
        </div>

        {/* ── Row 3: Tutorials + Recent Videos ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3.5">
          {/* Tutorials */}
          <div className="bg-[#161630] rounded-xl p-3.5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-medium">Tutorials &amp; Guides</span>
              <span className="text-[11px] text-[#7E36DD] cursor-pointer hover:underline">View All</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {tutorials.map((t) => (
                <div key={t.id}>
                  <div className="rounded-lg bg-gradient-to-br from-[#1a1040] to-[#2a1860] aspect-video flex items-center justify-center relative mb-1.5 cursor-pointer group">
                    <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-[10px] text-[#7E36DD] group-hover:scale-110 transition-transform">▶</div>
                    <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] text-white px-1 rounded">{t.duration}</span>
                  </div>
                  <div className="text-[11px] font-medium text-[#ddd]">{t.title}</div>
                  <div className="text-[10px] text-[#666] mt-0.5 leading-[1.4]">{t.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent videos */}
          <div className="bg-[#161630] rounded-xl p-3.5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-medium">Recent Videos</span>
            </div>
            {recentVideos.map((v, i) => (
              <div
                key={v.id}
                className="flex items-center gap-2.5 py-2"
                style={{
                  borderBottom: i < recentVideos.length - 1 ? "0.5px solid rgba(255,255,255,0.07)" : "none",
                }}
              >
                <div
                  className="w-[54px] h-[36px] rounded-md shrink-0 flex items-center justify-center"
                  style={{ background: v.bg }}
                >
                  {v.label ? (
                    <span className="text-[9px] font-semibold text-green-400 text-center leading-tight">
                      {v.label}
                    </span>
                  ) : (
                    <span className="text-sm opacity-50">▶</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{v.title}</div>
                  <div className="text-[10px] text-[#666] mt-0.5">{v.duration} · {v.date}</div>
                </div>
                <span className="text-[#555] text-base cursor-pointer hover:text-white transition-colors">⋮</span>
              </div>
            ))}
            <div
              className="flex items-center gap-1.5 text-[11px] text-[#7E36DD] cursor-pointer mt-2 hover:underline"
              onClick={() => router.push("/dashboard/videos")}
            >
              🎬 Go to My Videos
            </div>
          </div>
        </div>

        {/* ── Row 4: Overview chart + Inspiration ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="bg-[#161630] rounded-xl p-3.5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-medium">Overview</span>
              <select
                value={overviewRange}
                onChange={(e) => setOverviewRange(e.target.value)}
                className="bg-[#222244] border border-white/10 text-[#aaa] rounded-md px-2 py-[3px] text-[11px] outline-none"
              >
                <option>This Month</option>
                <option>Last Month</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={130}>
              <LineChart data={overviewData}>
                <XAxis dataKey="day" tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1a1a2e", border: "none", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#aaa" }}
                  itemStyle={{ color: "#7E36DD" }}
                />
                <Line
                  type="monotone" dataKey="videos"
                  stroke="#7E36DD" strokeWidth={2}
                  dot={false} fill="rgba(126,54,221,0.15)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gradient-to-br from-[#1a1040] to-[#2a1860] rounded-xl p-4 flex items-center gap-3.5">
            <div className="flex-1">
              <h4 className="text-sm font-medium mb-1.5">Tips &amp; Inspiration</h4>
              <p className="text-[11px] text-[#8888aa] leading-relaxed mb-2.5">
                Discover creative ideas and best practices to make your videos stand out.
              </p>
              <span className="text-[11px] text-[#7E36DD] cursor-pointer hover:underline">Explore Inspiration →</span>
            </div>
            <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] bg-[rgba(126,54,221,0.3)] rounded-xl flex items-center justify-center shrink-0">
              <span className="text-2xl sm:text-3xl opacity-70">▶</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
