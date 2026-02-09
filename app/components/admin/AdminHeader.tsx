"use client";

import { Search, Download, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";

interface AdminHeaderProps {
  onExport?: () => void;
}

const timeRanges = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "All Time"];

export default function AdminHeader({ onExport }: AdminHeaderProps) {
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6">
      {/* Search */}
      <div className="relative w-full sm:flex-1 sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search users by name, email or userid..."
          className="w-full bg-[#0D1117] border border-[#1A3155] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB] transition-colors"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
        {/* Time range selector */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 bg-[#0D1117] border border-[#1A3155] rounded-lg px-3 sm:px-4 py-2.5 text-sm text-gray-300 hover:border-[#2563EB] transition-colors whitespace-nowrap"
          >
            <span className="hidden sm:inline">📅</span>
            <span className="hidden md:inline">{selectedRange}</span>
            <span className="md:hidden">📅</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 bg-[#0D1117] border border-[#1A3155] rounded-lg py-1 z-50 min-w-[160px]">
              {timeRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setSelectedRange(range);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-[#1A2332] transition-colors ${
                    selectedRange === range ? "text-cyan-400" : "text-gray-300"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Export button */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-medium px-3 sm:px-4 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export Data</span>
        </button>

        {/* Notification bell */}
        <button className="w-10 h-10 rounded-lg bg-[#0D1117] border border-[#1A3155] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#2563EB] transition-colors relative">
          <Bell className="w-5 h-5" />
        </button>

        {/* User avatar */}
        <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-semibold text-sm cursor-pointer">
          AU
        </div>
      </div>
    </header>
  );
}
