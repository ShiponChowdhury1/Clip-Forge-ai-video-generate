"use client";

import { useMemo, useState } from "react";
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
import { useGetSubscriptionsQuery } from "@/lib/redux/features/admin/adminApi";

// Sample billing history data
const sampleInvoices: Invoice[] = [
  { id: "INV-001", date: "Jan 15, 2024", amount: "49.00", status: "PAID" },
  { id: "INV-001", date: "Jan 15, 2024", amount: "49.00", status: "PAID" },
  { id: "INV-001", date: "Jan 15, 2024", amount: "49.00", status: "PAID" },
  { id: "INV-001", date: "Jan 15, 2024", amount: "49.00", status: "PAID" },
  { id: "INV-001", date: "Jan 15, 2024", amount: "49.00", status: "PAID" },
];

type BillingView = "main" | "pricing" | "checkout" | "processing" | "success";
type BillingModalType = "change" | "buy";

export default function BillingPage() {
  const { data: subscriptions, isLoading: subscriptionsLoading } = useGetSubscriptionsQuery();

  const activePlans = useMemo(
    () => (subscriptions ?? []).filter((plan) => plan.plan_status?.toLowerCase() === "active"),
    [subscriptions]
  );

  const [view, setView] = useState<BillingView>("main");
  const [billingModalType, setBillingModalType] = useState<BillingModalType>("buy");
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [currentCredits] = useState(127);

  const selectedPlan = useMemo(() => {
    if (!activePlans.length) return null;
    if (selectedPlanId !== null) {
      return activePlans.find((plan) => plan.id === selectedPlanId) ?? activePlans[0];
    }
    return activePlans[0];
  }, [activePlans, selectedPlanId]);

  const selectedPlanName = selectedPlan?.name ?? "Plan";
  const selectedCredits = selectedPlan?.monthly_credits ?? 0;
  const selectedPrice = `$${(selectedPlan?.monthly_price ?? 0).toFixed(2)}`;

  const handleSelectPlan = (planId: number) => {
    setSelectedPlanId(planId);
    setShowPricingModal(false);
    setView("checkout");
  };

  const handleBuyCredits = () => {
    setBillingModalType("buy");
    setShowPricingModal(true);
  };

  const handleChangePlan = () => {
    setBillingModalType("change");
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
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm mb-4 transition-colors"
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
            onChangePlan={handleChangePlan}
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
          selectedPlan={selectedPlanName}
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
          modalType={billingModalType}
          plans={activePlans}
          isLoading={subscriptionsLoading}
          onSelectPlan={handleSelectPlan}
          onClose={() => setShowPricingModal(false)}
        />
      )}
    </div>
  );
}
