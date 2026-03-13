"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, ChevronDown, CheckCircle, XCircle, Clock, CalendarDays } from "lucide-react";
import { AdminHeader } from "@/app/components/admin";
import { useGetAdminBillingQuery } from "@/lib/redux/features/admin/adminApi";

const LIMIT = 10;

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string }> = {
  completed: { icon: CheckCircle, color: "text-green-400 bg-green-400/10" },
  pending:   { icon: Clock,        color: "text-yellow-400 bg-yellow-400/10" },
  failed:    { icon: XCircle,      color: "text-red-400 bg-red-400/10" },
};

function formatAmount(n: number) {
  return `$${(n / 100).toFixed(2)}`;
}

export default function AdminBillingRefundsPage() {
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(0);
  const [timeFilter, setTimeFilter] = useState<"all" | "7d" | "30d" | "90d">("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const timeRanges: { label: string; value: "all" | "7d" | "30d" | "90d" }[] = [
    { label: "All Time", value: "all" },
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 30 Days", value: "30d" },
    { label: "Last 90 Days", value: "90d" },
  ];

  const { data, isLoading } = useGetAdminBillingQuery({
    skip: page * LIMIT,
    limit: LIMIT,
    time_filter: timeFilter,
  });

  const records = data?.records ?? [];
  const filtered = records.filter(
    (t) =>
      t.user.toLowerCase().includes(search.toLowerCase()) ||
      t.payment_type.toLowerCase().includes(search.toLowerCase()) ||
      t.transaction_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <AdminHeader />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Billing / Refunds</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage billing information and process refunds
          </p>
        </div>
      
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-xl p-4 sm:p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Revenue</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {isLoading ? "—" : formatAmount(data?.total_revenue ?? 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-xl p-4 sm:p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Refunds Issued</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {isLoading ? "—" : formatAmount(data?.refund_amount ?? 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-xl p-4 sm:p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Net Revenue</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {isLoading ? "—" : formatAmount(data?.net_revenue ?? 0)}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-6">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search transactions..."
            className="w-full bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-lg px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:border-[#2563EB] transition-colors whitespace-nowrap"
          >
            <CalendarDays className="w-4 h-4 text-gray-400" />
            {timeRanges.find((r) => r.value === timeFilter)?.label}
            <ChevronDown className="w-4 h-4" />
          </button>
          {showFilterDropdown && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-lg py-1 z-50 min-w-40">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => {
                    setTimeFilter(range.value);
                    setPage(0);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#1A2332] transition-colors ${
                    timeFilter === range.value ? "text-cyan-400" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#1A3155]">
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Transaction ID</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">User</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Type</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Credits</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-[#1A3155] border-t-cyan-500 rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 text-sm">No transactions found.</td>
                </tr>
              ) : (
                filtered.map((txn) => {
                  const cfg = statusConfig[txn.status] ?? statusConfig.pending;
                  const StatusIcon = cfg.icon;
                  const date = new Date(txn.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
                  return (
                    <tr key={txn.id} className="border-b border-gray-100 dark:border-[#1A3155]/50 hover:bg-gray-50 dark:hover:bg-[#1A2332]/40 transition-colors">
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400 font-mono text-xs">{txn.transaction_id}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{txn.user}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-medium capitalize ${txn.payment_type === "refund" ? "text-red-400" : "text-green-400"}`}>
                          {txn.payment_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{formatAmount(txn.amount)}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        {txn.payment_type === "refund" ? "-" : "+"}{txn.credits.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${cfg.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {txn.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs">{date}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 sm:px-4 py-3 border-t border-gray-200 dark:border-[#1A3155]">
          <p className="text-xs text-gray-500">
            Showing {filtered.length} records
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1A2332] border border-gray-300 dark:border-[#1A3155] flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#2563EB] text-white text-xs font-medium flex items-center justify-center">
              {page + 1}
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={records.length < LIMIT}
              className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1A2332] border border-gray-300 dark:border-[#1A3155] flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


