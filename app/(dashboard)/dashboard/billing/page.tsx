"use client";

import { useState } from "react";
import { CreditCard, ArrowLeft } from "lucide-react";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import {
  CreditWallet,
  PaymentMethod,
  BillingHistory,
  PricingPlans,
  PaymentCheckout,
  ProcessingPayment,
  PaymentSuccess,
} from "@/app/components/dashboard/billing";
import type { Invoice } from "@/app/components/dashboard/billing";

// Sample billing history data
const sampleInvoices: Invoice[] = [
  { id: "INV-001", date: "Jan 15, 2024", amount: "49.00", status: "PAID" },
  { id: "INV-001", date: "Jan 15, 2024", amount: "49.00", status: "PAID" },
  { id: "INV-001", date: "Jan 15, 2024", amount: "49.00", status: "PAID" },
  { id: "INV-001", date: "Jan 15, 2024", amount: "49.00", status: "PAID" },
  { id: "INV-001", date: "Jan 15, 2024", amount: "49.00", status: "PAID" },
];

// Plan-to-credits mapping
const planCreditsMap: Record<string, { credits: number; price: string }> = {
  Starter: { credits: 50, price: "$0" },
  Growth: { credits: 200, price: "$10" },
  Pro: { credits: 600, price: "$25" },
};

type BillingView = "main" | "pricing" | "checkout" | "processing" | "success";

export default function BillingPage() {
  const [view, setView] = useState<BillingView>("main");
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Pro");
  const [currentCredits] = useState(127);

  const selectedCredits = planCreditsMap[selectedPlan]?.credits ?? 500;
  const selectedPrice = planCreditsMap[selectedPlan]?.price ?? "$25";

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    setShowPricingModal(false);
    setView("checkout");
  };

  const handleBuyCredits = () => {
    setShowPricingModal(true);
  };

  const handleConfirmPayment = () => {
    setView("processing");
    // Simulate payment processing
    setTimeout(() => {
      setView("success");
    }, 3000);
  };

  const handleBackToMain = () => {
    setView("main");
    setShowPricingModal(false);
  };

  return (
    <div>
      {/* Header */}
      <DashboardHeader
        icon={
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
        }
        title="Billing"
        description="Manage your subscription and payments"
        showCreateButton={false}
      />

      {/* Back button when in checkout/processing/success */}
      {view !== "main" && (
        <button
          onClick={handleBackToMain}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Billing
        </button>
      )}

      {/* Main Billing View */}
      {view === "main" && (
        <>
          <CreditWallet
            credits={currentCredits}
            onChangePlan={() => setShowPricingModal(true)}
            onBuyCredits={handleBuyCredits}
          />

          <PaymentMethod
            cardLast4="4242"
            expiry="12/25"
            onUpdate={() => {}}
          />

          <BillingHistory invoices={sampleInvoices} />
        </>
      )}

      {/* Checkout View */}
      {view === "checkout" && (
        <PaymentCheckout
          selectedPlan={selectedPlan}
          credits={selectedCredits}
          currentBalance={currentCredits}
          price={selectedPrice}
          onConfirmPayment={handleConfirmPayment}
          onChangePackage={() => setShowPricingModal(true)}
        />
      )}

      {/* Processing View */}
      {view === "processing" && <ProcessingPayment />}

      {/* Success View */}
      {view === "success" && (
        <PaymentSuccess
          creditsAdded={selectedCredits}
          updatedBalance={currentCredits + selectedCredits}
          onViewInvoice={handleBackToMain}
        />
      )}

      {/* Pricing Plans Modal */}
      {showPricingModal && (
        <PricingPlans
          onSelectPlan={handleSelectPlan}
          onClose={() => setShowPricingModal(false)}
        />
      )}
    </div>
  );
}
