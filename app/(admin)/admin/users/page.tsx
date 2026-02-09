"use client";

import { useState } from "react";
import { Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminHeader } from "@/app/components/admin";

const mockUsers = [
  { id: "USR-001", name: "Alice Johnson", email: "alice@example.com", plan: "Pro", credits: 1200, status: "Active", joined: "2025-12-15" },
  { id: "USR-002", name: "Bob Smith", email: "bob@example.com", plan: "Starter", credits: 340, status: "Active", joined: "2025-11-20" },
  { id: "USR-003", name: "Carol Davis", email: "carol@example.com", plan: "Free", credits: 12, status: "Inactive", joined: "2025-10-05" },
  { id: "USR-004", name: "Dan Wilson", email: "dan@example.com", plan: "Enterprise", credits: 8500, status: "Active", joined: "2025-09-01" },
  { id: "USR-005", name: "Eve Martinez", email: "eve@example.com", plan: "Pro", credits: 780, status: "Active", joined: "2025-08-18" },
  { id: "USR-006", name: "Frank Lee", email: "frank@example.com", plan: "Free", credits: 0, status: "Suspended", joined: "2025-07-22" },
  { id: "USR-007", name: "Grace Chen", email: "grace@example.com", plan: "Starter", credits: 150, status: "Active", joined: "2026-01-03" },
  { id: "USR-008", name: "Henry Patel", email: "henry@example.com", plan: "Pro", credits: 2100, status: "Active", joined: "2026-01-12" },
];

const statusColor: Record<string, string> = {
  Active: "text-green-400 bg-green-400/10",
  Inactive: "text-yellow-400 bg-yellow-400/10",
  Suspended: "text-red-400 bg-red-400/10",
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const filtered = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <AdminHeader />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Users</h1>
          <p className="text-sm text-gray-400 mt-1">Manage platform users and accounts</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
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
              <th className="text-left py-3 px-4 text-gray-500 font-medium">User</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Plan</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Credits</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Joined</th>
              <th className="text-right py-3 px-4 text-gray-500 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr
                key={user.id}
                className="border-b border-[#1A3155]/50 hover:bg-[#1A2332]/40 transition-colors"
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-gray-500 text-xs">{user.email}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-300">{user.plan}</td>
                <td className="py-3 px-4 text-gray-300">{user.credits.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[user.status]}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-400">{user.joined}</td>
                <td className="py-3 px-4 text-right">
                  <button className="text-gray-500 hover:text-white transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#1A3155]">
          <p className="text-xs text-gray-500">
            Showing {filtered.length} of {mockUsers.length} users
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
