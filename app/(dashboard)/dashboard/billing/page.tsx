"use client";

import { useMemo, useState } from "react";
import { CreditCard, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  useGetCreditPackagesQuery,
  useGetSubscriptionsQuery,
} from "@/lib/redux/features/admin/adminApi";

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
type CheckoutSource = "plan" | "package";

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: subscriptions, isLoading: subscriptionsLoading } = useGetSubscriptionsQuery();
  const { data: creditPackages = [], isLoading: creditPackagesLoading } = useGetCreditPackagesQuery();

  const activePlans = useMemo(
    () => (subscriptions ?? []).filter((plan) => plan.plan_status?.toLowerCase() === "active"),
    [subscriptions]
  );

  const activeCreditPackages = useMemo(
    () =>
      (creditPackages ?? [])
        .filter((pkg) => (pkg.status || "active").toLowerCase() === "active")
        .sort((a, b) => a.price - b.price),
    [creditPackages]
  );

  const [view, setView] = useState<BillingView>("main");
  const [billingModalType, setBillingModalType] = useState<BillingModalType>("buy");
  const [checkoutSource, setCheckoutSource] = useState<CheckoutSource>(
    searchParams.get("package") ? "package" : "plan"
  );
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [currentCredits] = useState(127);

  const shouldOpenCheckout = searchParams.get("checkout") === "1";
  const requestedPlanName = searchParams.get("plan")?.trim().toLowerCase();
  const requestedPackageName = searchParams.get("package")?.trim().toLowerCase();
  const forcedCheckoutSource: CheckoutSource = requestedPackageName ? "package" : "plan";

  const querySelectedPlan = useMemo(() => {
    if (!shouldOpenCheckout || !activePlans.length) return null;
    if (!requestedPlanName) return activePlans[0];
    return activePlans.find((plan) => plan.name.trim().toLowerCase() === requestedPlanName) ?? activePlans[0];
  }, [shouldOpenCheckout, requestedPlanName, activePlans]);

  const querySelectedPackage = useMemo(() => {
    if (!shouldOpenCheckout || !activeCreditPackages.length) return null;
    if (!requestedPackageName) return activeCreditPackages[0];
    return (
      activeCreditPackages.find((pkg) => pkg.name.trim().toLowerCase() === requestedPackageName) ??
      activeCreditPackages[0]
    );
  }, [shouldOpenCheckout, requestedPackageName, activeCreditPackages]);

  const selectedPlan = useMemo(() => {
    if (!activePlans.length) return null;
    if (selectedPlanId !== null) {
      return activePlans.find((plan) => plan.id === selectedPlanId) ?? activePlans[0];
    }
    return activePlans[0];
  }, [activePlans, selectedPlanId]);

  const selectedPackage = useMemo(() => {
    if (!activeCreditPackages.length) return null;
    if (selectedPackageId !== null) {
      return activeCreditPackages.find((pkg) => pkg.id === selectedPackageId) ?? activeCreditPackages[0];
    }
    return activeCreditPackages[0];
  }, [activeCreditPackages, selectedPackageId]);

  const selectedPlanName = selectedPlan?.name ?? "Plan";
  const selectedCredits = selectedPlan?.monthly_credits ?? 0;
  const selectedPrice = `$${(selectedPlan?.monthly_price ?? 0).toFixed(2)}`;

  const isForcedCheckout = shouldOpenCheckout && view === "main";
  const effectiveView: BillingView = isForcedCheckout ? "checkout" : view;
  const effectivePlan = isForcedCheckout
    ? forcedCheckoutSource === "package"
      ? querySelectedPackage
      : querySelectedPlan
    : checkoutSource === "package"
      ? selectedPackage
      : selectedPlan;
  const effectivePlanName = effectivePlan?.name ?? selectedPlanName;
  const effectiveCredits = effectivePlan
    ? "monthly_credits" in effectivePlan
      ? effectivePlan.monthly_credits
      : effectivePlan.credits
    : selectedCredits;
  const effectivePrice = effectivePlan
    ? "monthly_price" in effectivePlan
      ? `$${effectivePlan.monthly_price.toFixed(2)}`
      : `$${effectivePlan.price.toFixed(2)}`
    : selectedPrice;

  const handleSelectPlan = (id: number, kind: "plan" | "package") => {
    if (kind === "plan") {
      setSelectedPlanId(id);
      setCheckoutSource("plan");
    } else {
      setSelectedPackageId(id);
      setCheckoutSource("package");
    }
    setShowPricingModal(false);
    setView("checkout");
  };

  const handleBuyCredits = () => {
    setBillingModalType("buy");
    setCheckoutSource("package");
    setShowPricingModal(true);
  };

  const handleChangePlan = () => {
    setBillingModalType("change");
    setCheckoutSource("plan");
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
    if (isForcedCheckout) {
      router.replace("/dashboard/billing");
      return;
    }
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
      {effectiveView !== "main" && (
        <button
          onClick={handleBackToMain}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Billing
        </button>
      )}

      {/* Main Billing View */}
      {effectiveView === "main" && (
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
      {effectiveView === "checkout" && (
        <PaymentCheckout
          selectedPlan={effectivePlanName}
          credits={effectiveCredits}
          currentBalance={currentCredits}
          price={effectivePrice}
          onConfirmPayment={handleConfirmPayment}
          onChangePackage={() => {
            setBillingModalType(checkoutSource === "package" ? "buy" : "change");
            setShowPricingModal(true);
          }}
        />
      )}

      {/* Processing View */}
      {effectiveView === "processing" && <ProcessingPayment />}

      {/* Success View */}
      {effectiveView === "success" && (
        <PaymentSuccess
          creditsAdded={effectiveCredits}
          updatedBalance={currentCredits + effectiveCredits}
          onViewInvoice={handleBackToMain}
        />
      )}

      {/* Pricing Plans Modal */}
      {showPricingModal && (
        <PricingPlans
          modalType={billingModalType}
          plans={activePlans}
          creditPackages={activeCreditPackages}
          isPlansLoading={subscriptionsLoading}
          isCreditPackagesLoading={creditPackagesLoading}
          onSelectPlan={handleSelectPlan}
          onClose={() => setShowPricingModal(false)}
        />
      )}
    </div>
  );
}
