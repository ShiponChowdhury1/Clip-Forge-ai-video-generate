"use client";

import { useState } from "react";
import { Search, Filter, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminHeader } from "@/app/components/admin";

const mockHistory = [
  { id: "LOG-001", user: "Alice Johnson", action: "Generated Video", credits: -25, timestamp: "2026-02-09 14:32", details: "AI Shorts - 2min" },
  { id: "LOG-002", user: "Bob Smith", action: "Purchased Credits", credits: 500, timestamp: "2026-02-09 13:15", details: "Starter Plan" },
  { id: "LOG-003", user: "Carol Davis", action: "Generated Video", credits: -40, timestamp: "2026-02-09 12:45", details: "Product Ad - 3min" },
  { id: "LOG-004", user: "Dan Wilson", action: "Refund Issued", credits: 100, timestamp: "2026-02-09 11:20", details: "Failed generation" },
  { id: "LOG-005", user: "Eve Martinez", action: "Generated Video", credits: -15, timestamp: "2026-02-08 22:10", details: "Social Reel - 1min" },
  { id: "LOG-006", user: "Frank Lee", action: "Admin Grant", credits: 200, timestamp: "2026-02-08 18:35", details: "Bonus credits" },
  { id: "LOG-007", user: "Grace Chen", action: "Generated Video", credits: -30, timestamp: "2026-02-08 16:50", details: "Tutorial - 2min" },
  { id: "LOG-008", user: "Henry Patel", action: "Purchased Credits", credits: 3000, timestamp: "2026-02-08 14:22", details: "Growth Plan" },
];

export default function AdminUsageHistoryPage() {
  const [search, setSearch] = useState("");
  const filtered = mockHistory.filter(
    (h) =>
      h.user.toLowerCase().includes(search.toLowerCase()) ||
      h.action.toLowerCase().includes(search.toLowerCase()) ||
      h.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <AdminHeader />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Usage History</h1>
          <p className="text-sm text-gray-400 mt-1">Track all platform activity and credit usage</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0D1117] border border-[#1A3155] rounded-lg px-4 py-2.5 text-sm text-gray-300 hover:border-[#2563EB] transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs..."
            className="w-full bg-[#0D1117] border border-[#1A3155] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 bg-[#0D1117] border border-[#1A3155] rounded-lg px-4 py-2.5 text-sm text-gray-300 hover:border-[#2563EB] transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-[#1A3155]">
              <th className="text-left py-3 px-4 text-gray-500 font-medium">ID</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">User</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Action</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Credits</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Details</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr
                key={log.id}
                className="border-b border-[#1A3155]/50 hover:bg-[#1A2332]/40 transition-colors"
              >
                <td className="py-3 px-4 text-gray-400 font-mono text-xs">{log.id}</td>
                <td className="py-3 px-4 text-white">{log.user}</td>
                <td className="py-3 px-4 text-gray-300">{log.action}</td>
                <td className="py-3 px-4">
                  <span
                    className={`font-medium ${
                      log.credits > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {log.credits > 0 ? "+" : ""}
                    {log.credits}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-400">{log.details}</td>
                <td className="py-3 px-4 text-gray-500 text-xs">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#1A3155]">
          <p className="text-xs text-gray-500">
            Showing {filtered.length} of {mockHistory.length} records
          </p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg bg-[#1A2332] border border-[#1A3155] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#2563EB] text-white text-xs font-medium flex items-center justify-center">
              1
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#1A2332] border border-[#1A3155] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
