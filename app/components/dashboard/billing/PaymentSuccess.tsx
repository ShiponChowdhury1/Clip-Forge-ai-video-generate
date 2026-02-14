"use client";

import { CheckCircle, LayoutDashboard, FileText, Wallet } from "lucide-react";
import Link from "next/link";

interface PaymentSuccessProps {
  creditsAdded: number;
  updatedBalance: number;
  onViewInvoice: () => void;
}

export default function PaymentSuccess({
  creditsAdded,
  updatedBalance,
  onViewInvoice,
}: PaymentSuccessProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          <span className="text-cyan-400 font-semibold">{creditsAdded} credits</span>{" "}
          have been added to your account
        </p>

        {/* Updated Balance Card */}
        <div className="bg-[#0D1117] border border-cyan-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-cyan-400" />
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Updated Balance
            </span>
          </div>
          <p className="text-5xl font-bold text-white mb-2">
            {updatedBalance.toLocaleString()}
          </p>
          <p className="text-cyan-400 text-sm">+{creditsAdded} credits added</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/dashboard/create"
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
            Start Creating
          </Link>
          <button
            onClick={onViewInvoice}
            className="flex items-center gap-2 bg-transparent border border-[#1A3155] text-cyan-400 hover:bg-[#1A2332] font-medium px-6 py-3 rounded-xl transition-colors text-sm"
          >
            <FileText className="w-4 h-4" />
            View Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
