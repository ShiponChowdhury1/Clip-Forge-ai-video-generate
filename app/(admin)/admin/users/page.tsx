"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MoreVertical, UserX, UserCheck } from "lucide-react";
import { AdminHeader } from "@/app/components/admin";
import {
  useGetAdminUsersQuery,
  useUpdateUserStatusMutation,
} from "@/lib/redux/features/admin/adminApi";
import type { AdminUser } from "@/lib/redux/features/admin/adminApi";

const planStyles: Record<string, { bg: string; text: string; border: string }> = {
  pro: { bg: "bg-transparent", text: "text-cyan-400", border: "border-cyan-400" },
  enterprise: { bg: "bg-transparent", text: "text-pink-400", border: "border-pink-400" },
  starter: { bg: "bg-transparent", text: "text-emerald-400", border: "border-emerald-400" },
  free: { bg: "bg-transparent", text: "text-gray-400", border: "border-gray-500" },
};

const statusStyles: Record<string, { dot: string; text: string }> = {
  active: { dot: "bg-[#00D492]", text: "text-[#00D492]" },
  suspended: { dot: "bg-[#FF3C3C]", text: "text-[#FF3C3C]" },
};

const avatarColors = [
  "bg-blue-600",
  "bg-purple-600",
  "bg-cyan-600",
  "bg-pink-600",
  "bg-indigo-600",
  "bg-teal-600",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

const perPage = 10;

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [optimisticStatuses, setOptimisticStatuses] = useState<Record<number, "active" | "suspended">>({});
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const skip = (currentPage - 1) * perPage;
  const { data: users, isLoading, isFetching } = useGetAdminUsersQuery({
    skip,
    limit: perPage,
    time_filter: "all",
    search: search || undefined,
  });

  const [updateUserStatus] = useUpdateUserStatusMutation();

  const handleToggleStatus = async (user: AdminUser) => {
    const currentStatus = optimisticStatuses[user.id] ?? user.status;
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    setOptimisticStatuses((prev) => ({ ...prev, [user.id]: newStatus }));
    try {
      await updateUserStatus({ userId: user.id, status: newStatus }).unwrap();
    } catch {
      // Roll back optimistic update on error
      setOptimisticStatuses((prev) => ({ ...prev, [user.id]: currentStatus }));
    }
  };

  const hasNextPage = (users?.length ?? 0) >= perPage;

  return (
    <div>
      <AdminHeader />

      {/* Description and Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
         <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage user accounts, credits, and platform access
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search users..."
              className="w-full bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#2563EB] transition-colors sm:w-80"
            />
          </div>
        
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-225">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#1A3155]">
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
              {isLoading || isFetching ? (
                Array.from({ length: perPage }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-[#1A3155]/50">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="py-4 px-5">
                        <div className="h-4 bg-gray-200 dark:bg-[#1A2332] rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : !users?.length ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => {
                  const totalCredits = user.credits_used + user.credits_left;
                  const usedPercentage = totalCredits > 0
                    ? Math.round((user.credits_used / totalCredits) * 100)
                    : 0;
                  const avatarColor = avatarColors[index % avatarColors.length];
                  const plan = (user.subscription_plan || "free").toLowerCase();
                  const planStyle = planStyles[plan] ?? planStyles.free;
                  const effectiveStatus = optimisticStatuses[user.id] ?? user.status;
                  const statusStyle = statusStyles[effectiveStatus] ?? statusStyles.active;

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 dark:border-[#1A3155]/50 hover:bg-gray-50 dark:hover:bg-[#1A2332]/40 transition-colors"
                    >
                      {/* User */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-semibold shrink-0`}
                          >
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">{user.name}</p>
                            <p className="text-gray-500 text-xs">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${planStyle.bg} ${planStyle.text} ${planStyle.border}`}
                        >
                          {plan.charAt(0).toUpperCase() + plan.slice(1)}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-5">
                        <p className="text-gray-900 dark:text-white font-medium">
                          ${user.total_payment_made.toFixed(2)}
                        </p>
                      </td>

                      {/* Credits */}
                      <td className="py-4 px-5">
                        <div className="w-32">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-gray-400">{user.credits_used} used</span>
                            <span className="text-gray-500">{user.credits_left} left</span>
                          </div>
                          <div className="h-1.5 bg-gray-200 dark:bg-[#1A2332] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cyan-500 rounded-full transition-all"
                              style={{ width: `${usedPercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Videos */}
                      <td className="py-4 px-5">
                        <span className="text-gray-900 dark:text-white font-medium">{user.total_videos_generated}</span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                          <span className={statusStyle.text}>
                            {effectiveStatus.charAt(0).toUpperCase() + effectiveStatus.slice(1)}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5">
                        <div className="relative" ref={openMenuId === user.id ? menuRef : null}>
                          <button
                            onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                            className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A2332]"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {openMenuId === user.id && (
                            <div className="absolute right-0 top-8 z-50 w-44 bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-xl shadow-xl overflow-hidden">
                              {effectiveStatus === "active" ? (
                                <button
                                  onClick={() => { handleToggleStatus(user); setOpenMenuId(null); }}
                                  className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-[#FF3C3C] hover:bg-gray-100 dark:hover:bg-[#1A2332] transition-colors"
                                >
                                  <UserX className="w-4 h-4" />
                                  Suspend User
                                </button>
                              ) : (
                                <button
                                  onClick={() => { handleToggleStatus(user); setOpenMenuId(null); }}
                                  className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-[#00D492] hover:bg-gray-100 dark:hover:bg-[#1A2332] transition-colors"
                                >
                                  <UserCheck className="w-4 h-4" />
                                  Activate User
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-200 dark:border-[#1A3155]">
          <p className="text-xs sm:text-sm text-gray-500">
            Page {currentPage}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#1A2332] border border-gray-300 dark:border-[#1A3155] text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={!hasNextPage}
              className="px-3 sm:px-4 py-2 rounded-lg bg-cyan-500 text-xs sm:text-sm text-white font-medium hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

