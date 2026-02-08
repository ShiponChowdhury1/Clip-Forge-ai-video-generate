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
  CheckCircle,
} from "lucide-react";

interface Transaction {
  date: string;
  action: string;
  type: "Usage" | "Purchase" | "Refund";
  credits: number;
  status: "COMPLETED";
}

const transactions: Transaction[] = [
  {
    date: "Feb 4, 2026",
    action: "Video Generation",
    type: "Usage",
    credits: -25,
    status: "COMPLETED",
  },
  {
    date: "Feb 3, 2026",
    action: "Pro Package Purchase",
    type: "Purchase",
    credits: 500,
    status: "COMPLETED",
  },
  {
    date: "Feb 2, 2026",
    action: "Video Generation",
    type: "Usage",
    credits: -10,
    status: "COMPLETED",
  },
  {
    date: "Feb 1, 2026",
    action: "Failed Generation Refund",
    type: "Refund",
    credits: 10,
    status: "COMPLETED",
  },
  {
    date: "Jan 30, 2026",
    action: "Video Generation",
    type: "Usage",
    credits: -15,
    status: "COMPLETED",
  },
  {
    date: "Jan 28, 2026",
    action: "Starter Package Purchase",
    type: "Purchase",
    credits: 100,
    status: "COMPLETED",
  },
  {
    date: "Jan 25, 2026",
    action: "Video Generation",
    type: "Usage",
    credits: -20,
    status: "COMPLETED",
  },
];

interface CreditWalletDetailProps {
  onBack: () => void;
  onBuyCredits: () => void;
}

export default function CreditWalletDetail({
  onBack,
  onBuyCredits,
}: CreditWalletDetailProps) {
  const getActionIcon = (type: Transaction["type"]) => {
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
    }
  };

  return (
    <div>
      {/* Back Link */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Profile
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Credit Wallet</h1>
          <p className="text-gray-400 text-sm mt-1">
            Track your credits, purchases, and usage
          </p>
        </div>
        <button
          onClick={onBuyCredits}
          className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
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
          <p className="text-blue-200 text-xs mb-1">for John Doe</p>
          <p className="text-4xl font-bold text-white mb-3">150</p>
          <p className="text-blue-200 text-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Approximately 15 standard videos
          </p>
        </div>

        {/* Purchased */}
        <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 bg-green-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Purchased
          </p>
          <p className="text-3xl font-bold text-white mb-1">600</p>
          <p className="text-green-400 text-xs">All time</p>
        </div>

        {/* Used */}
        <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-yellow-400" />
            </div>
            <TrendingDown className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Used
          </p>
          <p className="text-3xl font-bold text-white mb-1">70</p>
          <p className="text-yellow-400 text-xs">All time</p>
        </div>

        {/* Remaining */}
        <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-blue-400" />
            </div>
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Remaining
          </p>
          <p className="text-3xl font-bold text-white mb-1">150</p>
          <p className="text-blue-400 text-xs">Current balance</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-white">Transaction History</h3>
          <span className="text-gray-500 text-sm">
            {transactions.length} transactions
          </span>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[120px_1fr_100px_100px] gap-4 pb-3 border-b border-[#1A2332] mb-1">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
            Date
          </span>
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
            Action
          </span>
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider text-right">
            Credits
          </span>
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider text-right">
            Status
          </span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#1A2332]">
          {transactions.map((tx, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[120px_1fr_100px_100px] gap-4 py-4 items-center"
            >
              <span className="text-gray-400 text-sm">{tx.date}</span>
              <div className="flex items-center gap-3">
                {getActionIcon(tx.type)}
                <div>
                  <p className="text-white text-sm font-medium">{tx.action}</p>
                  <p className="text-gray-500 text-xs">{tx.type}</p>
                </div>
              </div>
              <span
                className={`text-sm font-semibold text-right ${
                  tx.credits > 0 ? "text-green-400" : "text-white"
                }`}
              >
                {tx.credits > 0 ? `+${tx.credits}` : tx.credits}
              </span>
              <div className="flex justify-end">
                <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  COMPLETED
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onBuyCredits}
          className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Buy Credits
        </button>
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-[#1A1F2E] hover:bg-[#252B3B] border border-[#2A3040] text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </button>
      </div>
    </div>
  );
}
