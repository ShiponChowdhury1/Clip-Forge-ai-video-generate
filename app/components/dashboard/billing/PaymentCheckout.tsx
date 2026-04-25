"use client";

import { Lock, Sparkles, Loader2 } from "lucide-react";

interface PaymentCheckoutProps {
  selectedPlan: string;
  credits: number;
  currentBalance: number;
  price: string;
  onConfirmPayment: () => void;
  onChangePackage: () => void;
  isLoading?: boolean;
}

export default function PaymentCheckout({
  selectedPlan,
  credits,
  currentBalance,
  price,
  onConfirmPayment,
  onChangePackage,
  isLoading = false,
}: PaymentCheckoutProps) {
  const priceNum = parseFloat(price.replace("$", "")) || 0;
  const newBalance = currentBalance + credits;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Payment Info */}
      <div className="flex-1 bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Payment Details</h2>

        {/* Stripe Info Notice */}
        <div className="bg-gray-50 dark:bg-[#0A1628] border border-cyan-500/20 rounded-lg p-5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#635BFF]/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.918 3.757 7.11c0 4.46 2.72 6.467 7.177 8.292 2.86 1.152 3.854 1.95 3.854 3.147 0 1.032-.89 1.63-2.462 1.63-2.1 0-4.934-.89-7.033-2.127L4.38 23.64C5.947 24.55 8.85 25 11.497 25c2.584 0 4.727-.653 6.253-1.832 1.675-1.305 2.525-3.236 2.525-5.73 0-4.58-2.768-6.556-6.3-8.288z" fill="#635BFF"/>
              </svg>
            </div>
            <div>
              <p className="text-gray-900 dark:text-white text-sm font-semibold">Powered by Stripe</p>
              <p className="text-gray-500 text-xs">Secure checkout via Stripe</p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            After confirming, you will be redirected to Stripe&apos;s secure payment page to complete your transaction.
            Once payment is successful, you will be redirected back automatically.
          </p>
        </div>

        {/* Secure Transaction Notice */}
        <div className="bg-gray-50 dark:bg-[#0A1628] border border-cyan-500/20 rounded-lg p-4 flex items-start gap-3">
          <Lock className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-cyan-400 text-sm font-semibold">
              Secure Transaction:
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              Your payment information is encrypted and secure. We never store
              your card details. All payments are processed by Stripe.
            </p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="w-full lg:w-[360px]">
        <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Order Summary</h3>

          {/* Package Info */}
          <div className="bg-gray-50 dark:bg-[#0A1628] border border-cyan-500/20 rounded-lg p-4 mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Package</span>
              <span className="text-gray-900 dark:text-white text-sm font-semibold">
                {selectedPlan}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Credits</span>
              <span className="text-gray-900 dark:text-white text-sm font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                {credits}
              </span>
            </div>
          </div>

          {/* Balance Breakdown */}
          <div className="space-y-3 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Current Balance</span>
              <span className="text-gray-900 dark:text-white text-sm font-medium">
                {currentBalance}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Credits to Add</span>
              <span className="text-cyan-400 text-sm font-medium">
                +{credits}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white text-sm font-bold">New Balance</span>
              <span className="text-gray-900 dark:text-white text-lg font-bold">{newBalance}</span>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-[#1A2332] pt-4 space-y-2 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Subtotal</span>
              <span className="text-gray-900 dark:text-white text-sm">
                ${priceNum.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Processing Fee</span>
              <span className="text-gray-900 dark:text-white text-sm">$0.00</span>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-[#1A2332] pt-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white font-bold">Total</span>
              <span className="text-cyan-400 text-2xl font-bold">
                ${priceNum.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <button
            onClick={onConfirmPayment}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-colors text-sm mb-3 ${
              isLoading
                ? "bg-cyan-500/50 cursor-not-allowed text-white/70"
                : "bg-cyan-500 hover:bg-cyan-400 text-white"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirecting to Stripe...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </button>
          <button
            onClick={onChangePackage}
            disabled={isLoading}
            className="w-full bg-transparent border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 font-medium py-3 rounded-xl transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Change Package
          </button>
        </div>
      </div>
    </div>
  );
}
