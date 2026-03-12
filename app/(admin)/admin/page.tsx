"use client";

import { useState } from "react";
import { Users, Zap, Video, DollarSign, RotateCcw, ChevronDown, Activity, CalendarDays } from "lucide-react";
import {
  AdminHeader,
  StatCard,
  CreditsChart,
  VideosChart,
  PlanDistribution,
} from "@/app/components/admin";
import { useGetAdminOverviewQuery } from "@/lib/redux/features/admin/adminApi";

const timeRanges = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "All Time", value: "all" },
];

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return n.toLocaleString();
  return String(n);
}

export default function AdminOverview() {
  const [selectedRange, setSelectedRange] = useState(timeRanges[3]);
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);
  const { data: overview, isLoading } = useGetAdminOverviewQuery(selectedRange.value);

  const stats = overview
    ? [
        { icon: Users, label: "Total Users", value: formatNumber(overview.total_users) },
        { icon: Activity, label: "Active Users", value: formatNumber(overview.active_users) },
        { icon: Zap, label: "Credits Consumed", value: formatNumber(overview.credits_consumed) },
        { icon: Video, label: "Videos Generated", value: formatNumber(overview.total_videos_generated) },
        { icon: DollarSign, label: "Revenue", value: `$${formatNumber(overview.total_revenue)}` },
        { icon: RotateCcw, label: "Refunds Issued", value: formatNumber(overview.refunds_issued) },
      ]
    : [];

  return (
    <div>
      <AdminHeader />

      {/* Page Title + Dropdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Platform Overview</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Real-time performance metrics for VidFlow
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowRangeDropdown(!showRangeDropdown)}
            className="flex items-center gap-2 bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:border-[#2563EB] transition-colors"
          >
            <CalendarDays className="w-4 h-4 text-gray-400" />
            {selectedRange.label}
            <ChevronDown className="w-4 h-4" />
          </button>
          {showRangeDropdown && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-lg py-1 z-50 min-w-40">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => {
                    setSelectedRange(range);
                    setShowRangeDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#1A2332] transition-colors ${
                    selectedRange.value === range.value ? "text-cyan-400" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#1A3155] border-t-cyan-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 mb-6">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <CreditsChart data={overview?.credits_used_over_time ?? []} />
            <VideosChart data={overview?.videos_generated_over_time ?? []} />
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <PlanDistribution plans={overview?.plan_distribution ?? []} />
          </div>
        </>
      )}
    </div>
  );
}
