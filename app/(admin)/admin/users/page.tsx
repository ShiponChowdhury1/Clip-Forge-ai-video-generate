"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MoreVertical, UserX, UserCheck } from "lucide-react";
import { Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import { AdminHeader } from "@/app/components/admin";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  useGetAdminUsersQuery,
  useGiveUserCreditsMutation,
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
  const token = useAppSelector((state) => state.auth.token);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [optimisticStatuses, setOptimisticStatuses] = useState<Record<number, "active" | "suspended">>({});
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [creditModalUser, setCreditModalUser] = useState<AdminUser | null>(null);
  const [creditAmount, setCreditAmount] = useState("");
  const [creditError, setCreditError] = useState("");
  const [creditSuccess, setCreditSuccess] = useState<{
    userName: string;
    creditsGranted: number;
    newBalance: number;
    transactionId: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Debounce search — wait 400ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch ALL users in one batch (backend max limit is 100)
  const { data: allUsers, isLoading, isFetching, refetch } = useGetAdminUsersQuery({
    skip: 0,
    limit: 100,
    time_filter: "all",
  }, { skip: !token });

  // Client-side filtering by name AND email
  const filteredUsers = (allUsers ?? []).filter((user) => {
    if (!debouncedSearch) return true;
    const q = debouncedSearch.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    );
  });

  // Client-side pagination on filtered results
  const totalFiltered = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / perPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const skip = (safeCurrentPage - 1) * perPage;
  const users = filteredUsers.slice(skip, skip + perPage);

  const [giveUserCredits, { isLoading: isGrantingCredits }] = useGiveUserCreditsMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();

  const openCreditModal = (user: AdminUser) => {
    setOpenMenuId(null);
    setCreditModalUser(user);
    setCreditAmount("");
    setCreditError("");
    setCreditSuccess(null);
  };

  const closeCreditModal = () => {
    setCreditModalUser(null);
    setCreditAmount("");
    setCreditError("");
  };

  const handleGrantCredits = async () => {
    if (!creditModalUser) return;

    const parsedAmount = Number(creditAmount);
    if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
      setCreditError("Please enter a valid positive amount.");
      return;
    }

    setCreditError("");

    try {
      const result = await giveUserCredits({ userId: creditModalUser.id, amount: parsedAmount }).unwrap();
      setCreditSuccess({
        userName: creditModalUser.name,
        creditsGranted: result.credits_granted,
        newBalance: result.new_balance,
        transactionId: result.transaction_id,
      });
      await refetch();
      toast.success(result.message || "Credits added successfully.");
      closeCreditModal();
    } catch (error) {
      const typedError = error as {
        status?: number | string;
        data?: { detail?: string; message?: string; error?: string } | string;
        error?: string;
      };
      const message =
        (typeof typedError.data === "string" ? typedError.data : typedError.data?.detail) ||
        (typeof typedError.data === "object" ? typedError.data?.message : undefined) ||
        typedError.error ||
        (typedError.status ? `Request failed with status ${typedError.status}.` : "Failed to add credits.");
      console.error("giveUserCredits failed:", error);
      setCreditError(message);
      toast.error(message);
    }
  };

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

  const hasNextPage = safeCurrentPage < totalPages;
  const maxVisiblePages = 3;
  const tentativeStart = Math.max(1, safeCurrentPage - 1);
  const startPage = Math.min(
    tentativeStart,
    Math.max(1, totalPages - maxVisiblePages + 1)
  );
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

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
              onChange={(e) => setSearch(e.target.value)}
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
            <tbody className={isFetching && !isLoading ? "opacity-50 transition-opacity" : "transition-opacity"}>
              {isLoading ? (
                Array.from({ length: perPage }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-[#1A3155]/50">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="py-4 px-5">
                        <div className="h-4 bg-gray-200 dark:bg-[#1A2332] rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : !users.length ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    {debouncedSearch ? `No users found matching "${debouncedSearch}"` : "No users found."}
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
                        <div className="w-full max-w-55">
                          <div className="flex items-center gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 text-xs whitespace-nowrap">
                                <span className="text-gray-400">{user.credits_used} used</span>
                                <span className="text-gray-500">{user.credits_left} left</span>
                              </div>
                            </div>
                            <div className="relative inline-flex group shrink-0">
                              <button
                                onClick={() => openCreditModal(user)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-colors"
                                aria-label="Add credits"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-black">
                                Add credits
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 h-1.5 bg-gray-200 dark:bg-[#1A2332] rounded-full overflow-hidden">
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
            {debouncedSearch
              ? `Showing ${totalFiltered} result${totalFiltered !== 1 ? "s" : ""} — Page ${safeCurrentPage} of ${totalPages}`
              : `Page ${safeCurrentPage} of ${totalPages}`}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
              className="px-3 sm:px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#1A2332] border border-gray-300 dark:border-[#1A3155] text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`min-w-8 px-2.5 py-2 rounded-lg border text-xs sm:text-sm transition-colors ${safeCurrentPage === page
                    ? "bg-cyan-500 border-cyan-500 text-white"
                    : "bg-gray-100 dark:bg-[#1A2332] border-gray-300 dark:border-[#1A3155] text-gray-700 dark:text-gray-300 hover:border-[#2563EB]"
                  }`}
              >
                {page}
              </button>
            ))}
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

      {creditModalUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeCreditModal}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-gray-300 dark:border-[#1A3155] bg-white dark:bg-[#0D1117]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#1A3155]">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add Credits</h3>
                <p className="text-xs text-gray-500 mt-1">{creditModalUser.name} - {creditModalUser.email}</p>
              </div>
              <button
                onClick={closeCreditModal}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
                <p className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">Current Balance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{creditModalUser.credits_left} credits</p>
              </div>

              {creditError && (
                <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                  {creditError}
                </p>
              )}

              <div>
                <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                  Amount
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  placeholder="500"
                  className="w-full bg-gray-100 dark:bg-[#0A0F18] border border-gray-300 dark:border-[#1A3155] rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Quick Amounts
                </p>
                <div className="flex flex-wrap gap-2">
                  {[100, 500, 1000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCreditAmount(String(preset))}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-[#1A3155] bg-gray-50 dark:bg-[#0A0F18] text-xs font-medium text-gray-700 dark:text-gray-300 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-[#1A3155]">
              <button
                onClick={closeCreditModal}
                className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#1A3155] text-gray-700 dark:text-gray-300 text-sm font-medium hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGrantCredits}
                disabled={isGrantingCredits}
                className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
              >
                {isGrantingCredits ? "Adding..." : "Add Credits"}
              </button>
            </div>
          </div>
        </div>
      )}

      {creditSuccess && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-300 dark:border-[#1A3155] bg-white dark:bg-[#0D1117] shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-[#1A3155]">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Credits added successfully</h3>
              <p className="text-xs text-gray-500 mt-1">{creditSuccess.userName}</p>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 dark:border-[#1A3155] bg-gray-50 dark:bg-[#0A0F18] px-4 py-3">
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Credits Added</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{creditSuccess.creditsGranted}</p>
                </div>
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
                  <p className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">New Balance</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{creditSuccess.newBalance}</p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 dark:border-[#1A3155] bg-gray-50 dark:bg-[#0A0F18] px-4 py-3">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</p>
                <p className="text-sm font-mono text-gray-700 dark:text-gray-300 mt-1">#{creditSuccess.transactionId}</p>
              </div>
            </div>

            <div className="flex justify-end px-6 py-4 border-t border-gray-200 dark:border-[#1A3155]">
              <button
                onClick={() => setCreditSuccess(null)}
                className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

