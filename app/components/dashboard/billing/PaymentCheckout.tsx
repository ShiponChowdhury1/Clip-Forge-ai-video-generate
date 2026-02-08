"use client";

import { useState } from "react";
import { Lock, Sparkles } from "lucide-react";

interface PaymentCheckoutProps {
  selectedPlan: string;
  credits: number;
  currentBalance: number;
  price: string;
  onConfirmPayment: () => void;
  onChangePackage: () => void;
}

export default function PaymentCheckout({
  selectedPlan,
  credits,
  currentBalance,
  price,
  onConfirmPayment,
  onChangePackage,
}: PaymentCheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "stripe">(
    "card"
  );
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  const priceNum = parseFloat(price.replace("$", "")) || 0;
  const newBalance = currentBalance + credits;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Payment Details */}
      <div className="flex-1 bg-[#0D1117] border border-[#1A3155] rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Payment Details</h2>

        {/* Payment Method Toggle */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-white mb-3">
            Payment Method
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                paymentMethod === "card"
                  ? "bg-cyan-500 text-black"
                  : "bg-[#1A1F2E] text-gray-300 border border-[#2A3040] hover:border-gray-600"
              }`}
            >
              Credit Card
            </button>
            <button
              onClick={() => setPaymentMethod("stripe")}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                paymentMethod === "stripe"
                  ? "bg-cyan-500 text-black"
                  : "bg-[#1A1F2E] text-gray-300 border border-[#2A3040] hover:border-gray-600"
              }`}
            >
              Stripe
            </button>
          </div>
        </div>

        {/* Card Number */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-white mb-2">
            Card Number
          </label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full bg-[#0A0E14] border border-[#1A3155] rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        {/* Expiry + CVV Row */}
        <div className="flex gap-4 mb-5">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-white mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              placeholder="MM / YY"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full bg-[#0A0E14] border border-[#1A3155] rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-white mb-2 uppercase">
              CVV
            </label>
            <input
              type="text"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="w-full bg-[#0A0E14] border border-[#1A3155] rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Cardholder Name */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-white mb-2">
            Cardholder Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            className="w-full bg-[#0A0E14] border border-[#1A3155] rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        {/* Secure Transaction Notice */}
        <div className="bg-[#0A1628] border border-cyan-500/20 rounded-lg p-4 flex items-start gap-3">
          <Lock className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-cyan-400 text-sm font-semibold">
              Secure Transaction:
            </p>
            <p className="text-gray-400 text-xs">
              Your payment information is encrypted and secure. We never store
              your card details.
            </p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="w-full lg:w-[360px]">
        <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-5">Order Summary</h3>

          {/* Package Info */}
          <div className="bg-[#0A1628] border border-cyan-500/20 rounded-lg p-4 mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Package</span>
              <span className="text-white text-sm font-semibold">
                {selectedPlan}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Credits</span>
              <span className="text-white text-sm font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                {credits}
              </span>
            </div>
          </div>

          {/* Balance Breakdown */}
          <div className="space-y-3 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Current Balance</span>
              <span className="text-white text-sm font-medium">
                {currentBalance}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Credits to Add</span>
              <span className="text-cyan-400 text-sm font-medium">
                +{credits}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-bold">New Balance</span>
              <span className="text-white text-lg font-bold">{newBalance}</span>
            </div>
          </div>

          <div className="border-t border-[#1A2332] pt-4 space-y-2 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Subtotal</span>
              <span className="text-white text-sm">
                ${priceNum.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Processing Fee</span>
              <span className="text-white text-sm">$0.00</span>
            </div>
          </div>

          <div className="border-t border-[#1A2332] pt-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">Total</span>
              <span className="text-cyan-400 text-2xl font-bold">
                ${priceNum.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <button
            onClick={onConfirmPayment}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-xl transition-colors text-sm mb-3"
          >
            Confirm Payment
          </button>
          <button
            onClick={onChangePackage}
            className="w-full bg-transparent border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 font-medium py-3 rounded-xl transition-colors text-sm"
          >
            Change Package
          </button>
        </div>
      </div>
    </div>
  );
}
