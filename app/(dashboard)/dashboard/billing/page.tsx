"use client";

import { useEffect, useMemo, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { CreditCard, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/lib/redux/features/auth/authSlice";
import type { AuthUser } from "@/types/auth";
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
import { useGetUserCreditBalanceQuery } from "@/lib/redux/features/auth/authApi";
import {
  useSubscriptionCheckoutMutation,
  useCreditCheckoutMutation,
} from "@/lib/redux/features/billing/billingApi";

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
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const authUser = useSelector((state: { auth: { user: AuthUser | null } }) => state.auth.user);
  const userId = authUser?.id ?? null;
  const { data: creditBalance, refetch: refetchCredits } = useGetUserCreditBalanceQuery(userId ?? skipToken, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 30000,
    skipPollingIfUnfocused: true,
  });
  const { data: subscriptions, isLoading: subscriptionsLoading } = useGetSubscriptionsQuery();
  const { data: creditPackages = [], isLoading: creditPackagesLoading } = useGetCreditPackagesQuery();

  const [subscriptionCheckout, { isLoading: isCheckoutLoading }] = useSubscriptionCheckoutMutation();
  const [creditCheckout, { isLoading: isCreditCheckoutLoading }] = useCreditCheckoutMutation();

  // Detect Stripe redirect: ?payment_success=true (also handles malformed ?payment_success=true?session_id=xxx)
  const isPaymentSuccess = (searchParams.get("payment_success") ?? "").startsWith("true");

  // On payment success redirect, refetch credits and sync to Redux
  useEffect(() => {
    if (isPaymentSuccess && userId) {
      refetchCredits();
    }
  }, [isPaymentSuccess, userId, refetchCredits]);

  // Sync updated credit balance back to Redux user state
  useEffect(() => {
    if (typeof creditBalance === "number" && authUser && creditBalance !== authUser.credits) {
      const updatedUser: AuthUser = { ...authUser, credits: creditBalance };
      dispatch(setUser(updatedUser));
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    }
  }, [creditBalance, authUser, dispatch]);

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

  const [view, setView] = useState<BillingView>(isPaymentSuccess ? "success" : "main");
  const [billingModalType, setBillingModalType] = useState<BillingModalType>("buy");
  const [checkoutSource, setCheckoutSource] = useState<CheckoutSource>(
    searchParams.get("package") ? "package" : "plan"
  );
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const currentCredits = typeof creditBalance === "number" ? creditBalance : (authUser?.credits ?? 0);

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

  // Determine the effective plan/package ID for checkout
  const effectivePlanId = effectivePlan?.id ?? null;
  const effectiveCheckoutSource = isForcedCheckout ? forcedCheckoutSource : checkoutSource;

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
    setCheckoutError(null);
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

  // Real Stripe checkout — calls the API and redirects to Stripe
  const handleConfirmPayment = async () => {
    if (!effectivePlanId) {
      setCheckoutError("No plan or package selected.");
      return;
    }

    setCheckoutError(null);
    setView("processing");

    try {
      let checkoutUrl: string;

      if (effectiveCheckoutSource === "plan") {
        // Subscription plan checkout
        const result = await subscriptionCheckout({ plan_id: effectivePlanId }).unwrap();
        checkoutUrl = result.checkout_url;
      } else {
        // Credit package checkout
        const result = await creditCheckout({ package_id: effectivePlanId }).unwrap();
        checkoutUrl = result.checkout_url;
      }

      // Redirect to Stripe checkout page
      window.location.href = checkoutUrl;
    } catch (err: unknown) {
      console.error("Checkout failed:", err);
      const errorMessage =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { detail?: string } }).data?.detail || "Payment checkout failed. Please try again."
          : "Payment checkout failed. Please try again.";
      setCheckoutError(errorMessage);
      setView("checkout");
    }
  };

  const handleBackToMain = () => {
    if (isForcedCheckout) {
      router.replace("/dashboard/billing");
      return;
    }
    setView("main");
    setShowPricingModal(false);
    setCheckoutError(null);
  };

  return (
    <div>
      {/* Header */}
      <DashboardHeader
        icon={
          <div className="w-12 h-12 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
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

      {/* Checkout Error Banner */}
      {checkoutError && effectiveView === "checkout" && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {checkoutError}
        </div>
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
          isLoading={isCheckoutLoading || isCreditCheckoutLoading}
          onChangePackage={() => {
            setBillingModalType(checkoutSource === "package" ? "buy" : "change");
            setShowPricingModal(true);
          }}
        />
      )}

      {/* Processing View */}
      {effectiveView === "processing" && <ProcessingPayment />}

      {/* Success View — shown after Stripe payment redirect */}
      {effectiveView === "success" && <PaymentSuccess />}

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
