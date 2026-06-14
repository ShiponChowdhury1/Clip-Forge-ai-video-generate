"use client";

import { useState } from "react";
import { Calendar, DollarSign, Sparkles, AlertTriangle, ShieldCheck, CreditCard, Trash2 } from "lucide-react";
import type { MySubscriptionResponse } from "@/types/auth";

interface ActiveSubscriptionCardProps {
  subscription: MySubscriptionResponse | null | undefined;
  isLoading: boolean;
  onCancelSubscription: () => Promise<void>;
  onCancelCredit: () => Promise<void>;
  isCancellingSubscription: boolean;
  isCancellingCredit: boolean;
}

export default function ActiveSubscriptionCard({
  subscription,
  isLoading,
  onCancelSubscription,
  onCancelCredit,
  isCancellingSubscription,
  isCancellingCredit,
}: ActiveSubscriptionCardProps) {
  const [showSubModal, setShowSubModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);

  const isActive = subscription?.status === "active";
  const planName = subscription?.plan?.name || "Free Plan";
  const price = subscription?.plan?.monthly_price ?? 0;
  
  // Format dates nicely
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const nextBillingDate = formatDate(subscription?.renewal_date || subscription?.end_date);

  const confirmCancelSub = async () => {
    await onCancelSubscription();
    setShowSubModal(false);
  };

  const confirmCancelCredit = async () => {
    await onCancelCredit();
    setShowCreditModal(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6 mb-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Subscription</h3>
          <p className="text-gray-600 dark:text-gray-400 text-xs">Manage your plan renewals and payments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Subscription Plan Details */}
        <div className="flex flex-col justify-between p-5 bg-gray-50 dark:bg-[#0A1628]/80 border border-gray-200 dark:border-[#1A3155] rounded-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Subscription Plan
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  isActive
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-gray-500/10 border-gray-500/30 text-gray-400"
                }`}
              >
                {isActive ? "Active" : "No Active Subscription"}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <p className="text-xl font-bold text-gray-900 dark:text-white capitalize">{planName}</p>
            </div>

            {isActive && (
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-cyan-400" />
                  <span>
                    Price: <strong className="text-gray-900 dark:text-white">${price.toFixed(2)}/month</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>
                    Next Renewal: <strong className="text-gray-900 dark:text-white">{nextBillingDate}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          {isActive && (
            <div className="mt-6">
              <button
                onClick={() => setShowSubModal(true)}
                disabled={isCancellingSubscription}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {isCancellingSubscription ? "Cancelling..." : "Cancel Subscription"}
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Credit & Package Management */}
        <div className="flex flex-col justify-between p-5 bg-gray-50 dark:bg-[#0A1628]/80 border border-gray-200 dark:border-[#1A3155] rounded-xl">
          <div>
            <span className="text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-4">
              Credit Package & Subscriptions
            </span>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              <p className="text-base font-semibold text-gray-900 dark:text-white">Recurring Credit Purchases</p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              If you have purchased a recurring credit pack, you can cancel the recurring credit subscription here. This stops future charges immediately.
            </p>
          </div>

          <div>
            <button
              onClick={() => setShowCreditModal(true)}
              disabled={isCancellingCredit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-[#1A1F2E] hover:bg-gray-200 dark:hover:bg-[#252B3B] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-[#2A3040] px-4 py-2.5 rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              {isCancellingCredit ? "Cancelling..." : "Cancel Credit Plan"}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Subscription */}
      {showSubModal && (
        <div className="fixed inset-0 z-90 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Cancel Subscription?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Are you sure you want to cancel your <strong className="capitalize">{planName}</strong> subscription? 
                  You will keep your premium features until the end of your billing cycle on <strong className="text-gray-900 dark:text-white">{nextBillingDate}</strong>.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowSubModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#1A1F2E] hover:bg-gray-200 dark:hover:bg-[#252B3B] text-gray-900 dark:text-white font-medium text-sm transition-colors border border-gray-300 dark:border-[#2A3040]"
              >
                No, Keep It
              </button>
              <button
                onClick={confirmCancelSub}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors"
              >
                Yes, Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Credit */}
      {showCreditModal && (
        <div className="fixed inset-0 z-90 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Cancel Credit Plan?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Are you sure you want to cancel your recurring credit package subscription? 
                  This will prevent any future automatic credit purchases, but you will keep your remaining credits.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreditModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#1A1F2E] hover:bg-gray-200 dark:hover:bg-[#252B3B] text-gray-900 dark:text-white font-medium text-sm transition-colors border border-gray-300 dark:border-[#2A3040]"
              >
                No, Keep It
              </button>
              <button
                onClick={confirmCancelCredit}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors"
              >
                Yes, Cancel Credit Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
