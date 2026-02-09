"use client";

import { useState } from "react";
import { Users, Zap, Video, DollarSign, RotateCcw, ChevronDown, Activity } from "lucide-react";
import {
  AdminHeader,
  StatCard,
  CreditsChart,
  VideosChart,
  PlanDistribution,
  QuickActions,
} from "@/app/components/admin";

const stats = [
  { icon: Users, label: "Total Users", value: "12,842", change: "+12%", positive: true },
  { icon: Activity, label: "Active Users", value: "3,241", change: "+8%", positive: true },
  { icon: Zap, label: "Credits Consumed", value: "1.2M", change: "+24%", positive: true },
  { icon: Video, label: "Videos Generated", value: "45,203", change: "+18%", positive: true },
  { icon: DollarSign, label: "Revenue", value: "$42,850", change: "+15%", positive: true },
  { icon: RotateCcw, label: "Refunds Issued", value: "12", change: "-2%", positive: false },
];

const timeRanges = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "All Time"];

export default function AdminOverview() {
  const [overviewRange, setOverviewRange] = useState("Last 7 Days");
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);

  return (
    <div>
      <AdminHeader />

      {/* Page Title + Dropdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Platform Overview</h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time performance metrics for VidFlow
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowRangeDropdown(!showRangeDropdown)}
            className="flex items-center gap-2 bg-[#0D1117] border border-[#1A3155] rounded-lg px-4 py-2 text-sm text-gray-300 hover:border-[#2563EB] transition-colors"
          >
            {overviewRange}
            <ChevronDown className="w-4 h-4" />
          </button>
          {showRangeDropdown && (
            <div className="absolute right-0 top-full mt-1 bg-[#0D1117] border border-[#1A3155] rounded-lg py-1 z-50 min-w-[160px]">
              {timeRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setOverviewRange(range);
                    setShowRangeDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-[#1A2332] transition-colors ${
                    overviewRange === range ? "text-cyan-400" : "text-gray-300"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <CreditsChart />
        <VideosChart />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <PlanDistribution />
        <QuickActions />
      </div>
    </div>
  );
}
