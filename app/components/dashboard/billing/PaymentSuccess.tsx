"use client";

import { CheckCircle, Settings, Sparkles } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md w-full">
        {/* Success Icon with animation */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/30 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Successful! 🎉
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-8">
          Your plan has been updated and credits have been added to your account.
          
        </p>

        {/* Info Card */}
        <div className="bg-white dark:bg-[#0D1117] border border-cyan-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Subscription Updated
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Your profile, plan, and credit balance have been refreshed.
            Head to your settings to view the updated details.
            
          </p>
        </div>

        {/* Go to Settings Button */}
        <div className="flex items-center justify-center">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Settings className="w-4 h-4" />
            Go to Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
