"use client";

import { useState } from "react";
import { Search, Filter, Trash2 } from "lucide-react";
import { AdminHeader } from "@/app/components/admin";

interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  plan: "Pro" | "Enterprise" | "Starter" | "Free";
  payment: number;
  paymentDate: string;
  creditsUsed: number;
  creditsLeft: number;
  videos: number;
  status: "Active" | "Suspended";
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    initials: "AJ",
    plan: "Pro",
    payment: 49.0,
    paymentDate: "FEB 1, 2026",
    creditsUsed: 450,
    creditsLeft: 550,
    videos: 24,
    status: "Active",
  },
  {
    id: "2",
    name: "Sarah Miller",
    email: "sarah.m@design.io",
    initials: "SM",
    plan: "Enterprise",
    payment: 299.0,
    paymentDate: "JAN 28, 2026",
    creditsUsed: 1200,
    creditsLeft: 3800,
    videos: 82,
    status: "Active",
  },
  {
    id: "3",
    name: "David Chen",
    email: "dchen@tech.com",
    initials: "DC",
    plan: "Starter",
    payment: 19.0,
    paymentDate: "FEB 2, 2026",
    creditsUsed: 80,
    creditsLeft: 120,
    videos: 5,
    status: "Suspended",
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma.w@gmail.com",
    initials: "EW",
    plan: "Free",
    payment: 0.0,
    paymentDate: "JAN 15, 2026",
    creditsUsed: 45,
    creditsLeft: 5,
    videos: 3,
    status: "Active",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "mbrown@creative.co",
    initials: "MB",
    plan: "Pro",
    payment: 49.0,
    paymentDate: "FEB 1, 2026",
    creditsUsed: 310,
    creditsLeft: 690,
    videos: 18,
    status: "Active",
  },
  {
    id: "6",
    name: "Sophia Garcia",
    email: "sophia@studio.net",
    initials: "SG",
    plan: "Pro",
    payment: 49.0,
    paymentDate: "JAN 20, 2026",
    creditsUsed: 600,
    creditsLeft: 400,
    videos: 31,
    status: "Active",
  },
];

const planStyles: Record<string, { bg: string; text: string; border: string }> = {
  Pro: { bg: "bg-transparent", text: "text-cyan-400", border: "border-cyan-400" },
  Enterprise: { bg: "bg-transparent", text: "text-pink-400", border: "border-pink-400" },
  Starter: { bg: "bg-transparent", text: "text-emerald-400", border: "border-emerald-400" },
  Free: { bg: "bg-transparent", text: "text-gray-400", border: "border-gray-500" },
};

const statusStyles: Record<string, { dot: string; text: string }> = {
  Active: { dot: "bg-[#00D492]", text: "text-[#00D492]" },
  Suspended: { dot: "bg-[#FF3C3C]", text: "text-[#FF3C3C]" },
};

const avatarColors = [
  "bg-blue-600",
  "bg-purple-600",
  "bg-cyan-600",
  "bg-pink-600",
  "bg-indigo-600",
  "bg-teal-600",
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;
  const totalUsers = 1284;

  const filtered = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <AdminHeader />

      {/* Description and Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <p className="text-gray-400 text-sm">
          Manage user accounts, credits, and platform access
        </p>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full bg-[#0D1117] border border-[#1A3155] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB] transition-colors sm:w-[240px]"
            />
          </div>
          <button className="flex items-center gap-2 bg-[#0D1117] border border-[#1A3155] rounded-lg px-4 py-2.5 text-sm text-gray-300 hover:border-[#2563EB] transition-colors shrink-0">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-[#1A3155]">
                <th className="text-left py-4 px-5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left py-4 px-5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="text-left py-4 px-5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="text-left py-4 px-5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="text-left py-4 px-5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Videos
                </th>
                <th className="text-left py-4 px-5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, index) => {
                const totalCredits = user.creditsUsed + user.creditsLeft;
                const usedPercentage = (user.creditsUsed / totalCredits) * 100;
                const avatarColor = avatarColors[index % avatarColors.length];

                return (
                  <tr
                    key={user.id}
                    className="border-b border-[#1A3155]/50 hover:bg-[#1A2332]/40 transition-colors"
                  >
                    {/* User */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-semibold`}
                        >
                          {user.initials}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-500 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${planStyles[user.plan].bg} ${planStyles[user.plan].text} ${planStyles[user.plan].border}`}
                      >
                        {user.plan}
                      </span>
                    </td>

                    {/* Payment */}
                    <td className="py-4 px-5">
                      <p className="text-white font-medium">
                        ${user.payment.toFixed(2)}
                      </p>
                      <p className="text-gray-500 text-xs">{user.paymentDate}</p>
                    </td>

                    {/* Credits */}
                    <td className="py-4 px-5">
                      <div className="w-32">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-gray-400">
                            {user.creditsUsed} used
                          </span>
                          <span className="text-gray-500">
                            {user.creditsLeft} left
                          </span>
                        </div>
                        <div className="h-1.5 bg-[#1A2332] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-500 rounded-full transition-all"
                            style={{ width: `${usedPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Videos */}
                    <td className="py-4 px-5">
                      <span className="text-white font-medium">{user.videos}</span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${statusStyles[user.status].dot}`}
                        />
                        <span className={statusStyles[user.status].text}>
                          {user.status}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5">
                      <button className="text-[#FF3C3C] hover:text-[#FF3C3C]/80 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-5 py-3 sm:py-4 border-t border-[#1A3155]">
          <p className="text-xs sm:text-sm text-gray-500">
            Showing {filtered.length} of {totalUsers.toLocaleString()} users
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-2 rounded-lg bg-[#1A2332] border border-[#1A3155] text-xs sm:text-sm text-gray-400 hover:text-white hover:border-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 sm:px-4 py-2 rounded-lg bg-cyan-500 text-xs sm:text-sm text-white font-medium hover:bg-cyan-600 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
