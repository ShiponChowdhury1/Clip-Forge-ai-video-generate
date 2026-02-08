"use client";

import { Wallet, Plus } from "lucide-react";

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
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Credit Wallet</h2>
          <p className="text-gray-400 text-sm mb-5">
            Track your credits, purchases, and usage
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onChangePlan}
              className="bg-[#1A1F2E] hover:bg-[#252B3B] text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm border border-[#2A3040]"
            >
              Change Plan
            </button>
            <button
              onClick={onBuyCredits}
              className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Buy Credits
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-sm mb-1">Credits remaining</p>
          <p className="text-4xl font-bold text-white">{credits}</p>
        </div>
      </div>
    </div>
  );
}
