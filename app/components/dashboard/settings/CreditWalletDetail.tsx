"use client";

import {
  ArrowLeft,
  Plus,
  Wallet,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Video,
  ShoppingCart,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { useGetCreditWalletQuery } from "@/lib/redux/features/auth/authApi";

type UiTransaction = {
  id: number;
  date: string;
  action: string;
  rawType: string;
  type: "Usage" | "Purchase" | "Refund" | "Grant";
  credits: number;
  referenceId?: string | null;
};

interface CreditWalletDetailProps {
  onBack: () => void;
  onBuyCredits: () => void;
}

export default function CreditWalletDetail({
  onBack,
  onBuyCredits,
}: CreditWalletDetailProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const user = useAppSelector((state) => state.auth.user);
  const { data: walletData, isLoading, isFetching, isError } = useGetCreditWalletQuery({
    page,
    page_size: pageSize,
  });
  const credits = walletData?.user_credits ?? user?.credits ?? 0;
  const userName = user?.name || "User";
  const totalPages = walletData?.total_pages ?? 1;
  const activePage = walletData?.page ?? page;
  const safeTotalPages = Math.max(1, totalPages);
  const maxVisiblePages = 3;
  const tentativeStart = Math.max(1, activePage - 1);
  const startPage = Math.min(
    tentativeStart,
    Math.max(1, safeTotalPages - maxVisiblePages + 1)
  );
  const endPage = Math.min(safeTotalPages, startPage + maxVisiblePages - 1);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const transactions: UiTransaction[] = (walletData?.transaction_history || []).map((tx) => {
    const createdAt = new Date(tx.created_at);
    const date = createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (tx.type === "spend") {
      return {
        id: tx.id,
        date,
        action: "Video Generation",
        rawType: tx.type,
        type: "Usage",
        credits: -Math.abs(tx.amount),
        referenceId: tx.reference_id,
      };
    }

    if (tx.type === "subscription") {
      return {
        id: tx.id,
        date,
        action: "Subscription Purchase",
        rawType: tx.type,
        type: "Purchase",
        credits: Math.abs(tx.amount),
        referenceId: tx.reference_id,
      };
    }

    if (tx.type === "purchase") {
      return {
        id: tx.id,
        date,
        action: "Credit Package Purchase",
        rawType: tx.type,
        type: "Purchase",
        credits: Math.abs(tx.amount),
        referenceId: tx.reference_id,
      };
    }

    if (tx.type === "admin_grant") {
      return {
        id: tx.id,
        date,
        action: "Admin Credit Grant",
        rawType: tx.type,
        type: "Grant",
        credits: Math.abs(tx.amount),
        referenceId: tx.reference_id,
      };
    }

    return {
      id: tx.id,
      date,
      action: "Credit Refund",
      rawType: tx.type,
      type: "Refund",
      credits: Math.abs(tx.amount),
      referenceId: tx.reference_id,
    };
  });

  const getActionIcon = (type: UiTransaction["type"]) => {
    switch (type) {
      case "Usage":
        return (
          <div className="w-9 h-9 bg-orange-500/10 rounded-lg flex items-center justify-center">
            <Video className="w-4 h-4 text-orange-400" />
          </div>
        );
      case "Purchase":
        return (
          <div className="w-9 h-9 bg-green-500/10 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-green-400" />
          </div>
        );
      case "Refund":
        return (
          <div className="w-9 h-9 bg-cyan-500/10 rounded-lg flex items-center justify-center">
            <RotateCcw className="w-4 h-4 text-cyan-400" />
          </div>
        );
      case "Grant":
        return (
          <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
        );
    }
  };

  return (
    <div>
      {/* Back Link */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Profile
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Credit Wallet</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Track your credits, purchases, and usage
          </p>
        </div>
        <button
          onClick={onBuyCredits}
          className="flex items-center justify-center sm:justify-start gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 sm:px-5 py-2.5 rounded-lg font-medium transition-colors text-sm whitespace-nowrap w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Buy Credits
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Available Credits */}
        <div className="bg-[#2563EB] rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-200" />
              <span className="text-blue-100 text-xs font-semibold uppercase tracking-wider">
                Available Credits
              </span>
            </div>
          </div>
          <p className="text-blue-200 text-xs mb-1">for {userName}</p>
          <p className="text-4xl font-bold text-white mb-3">{credits}</p>
          <p className="text-blue-200 text-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Approximately {Math.floor(credits / 10)} standard videos
          </p>
        </div>

        {/* Purchased */}
        <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 bg-green-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Purchased
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{walletData?.purchased ?? 0}</p>
          <p className="text-green-400 text-xs">All time</p>
        </div>

        {/* Used */}
        <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-yellow-400" />
            </div>
            <TrendingDown className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Used
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{walletData?.used ?? 0}</p>
          <p className="text-yellow-400 text-xs">All time</p>
        </div>

        {/* Remaining */}
        <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-blue-400" />
            </div>
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Remaining
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{walletData?.remaining ?? credits}</p>
          <p className="text-blue-400 text-xs">Current balance</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-5">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Transaction History</h3>
          <span className="text-gray-500 text-xs sm:text-sm">
            {walletData?.total_transactions ?? transactions.length} transactions
          </span>
        </div>

        {/* Desktop Table Header */}
        <div className="hidden sm:grid grid-cols-[120px_1.2fr_110px_1.6fr_100px] gap-4 pb-3 border-b border-gray-200 dark:border-[#1A2332] mb-1">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Date</span>
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Action</span>
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Type</span>
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Reference ID</span>
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider text-right">Credits</span>
        </div>

        {/* Transactions Container */}
        <div className="space-y-3 sm:space-y-0 sm:divide-y sm:divide-gray-200 dark:sm:divide-[#1A2332]">
          {(isLoading || isFetching) && (
            <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">Loading transactions...</div>
          )}

          {isError && !isLoading && !isFetching && (
            <div className="py-6 text-center text-sm text-red-500">Failed to load credit wallet data.</div>
          )}

          {!isLoading && !isFetching && !isError && transactions.length === 0 && (
            <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">No transactions found.</div>
          )}

          {!isLoading &&
            !isFetching &&
            !isError &&
            transactions.map((tx) => (
              <div key={tx.id} className="hidden sm:grid sm:grid-cols-[120px_1.2fr_110px_1.6fr_100px] gap-4 py-4 items-center">
                <span className="text-gray-600 dark:text-gray-400 text-sm">{tx.date}</span>
                <div className="flex items-center gap-3">
                  {getActionIcon(tx.type)}
                  <div>
                    <p className="text-gray-900 dark:text-white text-sm font-medium">{tx.action}</p>
                  </div>
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-sm capitalize">{tx.rawType}</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm break-all">{tx.referenceId || "—"}</span>
                <span className={`text-sm font-semibold text-right ${tx.credits > 0 ? "text-green-400" : "text-gray-900 dark:text-white"}`}>
                  {tx.credits > 0 ? `+${tx.credits}` : tx.credits}
                </span>
              </div>
            ))}

          {/* Mobile Card View */}
          {!isLoading &&
            !isFetching &&
            !isError &&
            transactions.map((tx) => (
              <div key={tx.id} className="sm:hidden bg-gray-50 dark:bg-[#161D28] border border-gray-200 dark:border-[#2A3655] rounded-lg p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    {getActionIcon(tx.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 dark:text-white text-sm font-semibold truncate">{tx.action}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold whitespace-nowrap ${tx.credits > 0 ? "text-green-400" : "text-gray-900 dark:text-white"}`}>
                    {tx.credits > 0 ? `+${tx.credits}` : tx.credits}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Type:</span>
                    <span className="text-gray-900 dark:text-white font-medium capitalize">{tx.rawType}</span>
                  </div>
                  {tx.referenceId && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Txn ID:</span>
                      <span className="text-gray-600 dark:text-gray-400 font-mono truncate">{tx.referenceId}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 mt-4 border-t border-gray-200 dark:border-[#1A3155]">
          <p className="text-xs sm:text-sm text-gray-500">
            Page {activePage} of {safeTotalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={activePage === 1 || isFetching}
              className="px-3 sm:px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#1A2332] border border-gray-300 dark:border-[#1A3155] text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                disabled={isFetching}
                className={`min-w-9 px-2.5 py-2 rounded-lg border text-xs sm:text-sm transition-colors ${
                  activePage === pageNumber
                    ? "bg-cyan-500 border-cyan-500 text-white"
                    : "bg-gray-100 dark:bg-[#1A2332] border-gray-300 dark:border-[#1A3155] text-gray-700 dark:text-gray-300 hover:border-[#2563EB]"
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              onClick={() => setPage((prev) => Math.min(safeTotalPages, prev + 1))}
              disabled={activePage === safeTotalPages || isFetching}
              className="px-3 sm:px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-center gap-3 sm:gap-4">
        <button
          onClick={onBuyCredits}
          className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 sm:px-6 py-3 rounded-xl font-medium transition-colors text-sm whitespace-nowrap order-2 sm:order-1"
        >
          <Plus className="w-4 h-4" />
          Buy Credits
        </button>
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-[#1A1F2E] hover:bg-gray-200 dark:hover:bg-[#252B3B] border border-gray-300 dark:border-[#2A3040] text-gray-900 dark:text-white px-4 sm:px-6 py-3 rounded-xl font-medium transition-colors text-sm whitespace-nowrap order-1 sm:order-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </button>
      </div>
    </div>
  );
}
