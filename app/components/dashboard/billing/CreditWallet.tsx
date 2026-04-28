"use client";

import { Plus } from "lucide-react";

interface CreditWalletProps {
  credits: number;
  onChangePlan: () => void;
  onBuyCredits: () => void;
}

export default function CreditWallet({
  credits,
  onChangePlan,
  onBuyCredits,
}: CreditWalletProps) {
  return (
    <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        {/* Left: Title, Description, Buttons */}
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">Credit Wallet</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 sm:mb-5">
            Track your credits, purchases, and usage
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onChangePlan}
              className="bg-gray-100 dark:bg-[#1A1F2E] hover:bg-gray-200 dark:hover:bg-[#252B3B] text-gray-900 dark:text-white px-4 sm:px-5 py-2.5 rounded-lg font-medium transition-colors text-sm border border-gray-300 dark:border-[#2A3040] whitespace-nowrap"
            >
              Change Plan
            </button>
            <button
              onClick={onBuyCredits}
              className="flex items-center justify-center sm:justify-start gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 sm:px-5 py-2.5 rounded-lg font-medium transition-colors text-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Buy Credits
            </button>
          </div>
        </div>

        {/* Right: Credits Remaining */}
        <div className="text-center sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-[#1A3155] sm:pl-6">
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2">Credits remaining</p>
          <p className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">{credits.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
