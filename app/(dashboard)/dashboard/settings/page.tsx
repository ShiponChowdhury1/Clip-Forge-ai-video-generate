"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  ProfileSection,
  CreditWalletDetail,
  ChangePassword,
  NotificationSettings,
} from "@/app/components/dashboard/settings";
import { useGetUserCreditBalanceQuery } from "@/lib/redux/features/auth/authApi";
import { setUser } from "@/lib/redux/features/auth/authSlice";
import type { AuthUser } from "@/types/auth";
import { CheckCircle, X } from "lucide-react";

type SettingsView = "profile" | "wallet" | "notifications";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<SettingsView>("profile");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [paymentSuccessBanner, setPaymentSuccessBanner] = useState(false);

  const authUser = useSelector(
    (state: { auth: { user: AuthUser | null } }) => state.auth.user
  );
  const userId = authUser?.id ?? null;

  // Refetch credit balance (will update on payment success redirect)
  const { data: creditBalance, refetch: refetchCredits } =
    useGetUserCreditBalanceQuery(userId ?? skipToken, {
      refetchOnMountOrArgChange: true,
    });

  // Handle Stripe payment success redirect
  // Stripe redirects back to /dashboard/settings?session_id=xxx
  const handlePaymentSuccess = useCallback(() => {
    // Show success banner
    setPaymentSuccessBanner(true);

    // Refetch credit balance to get updated credits
    if (userId) {
      refetchCredits();
    }

    // Update user in localStorage and Redux state with refreshed data
    // Credit balance will auto-update via the query refetch
    // Clean the URL by removing query params
    router.replace("/dashboard/settings", { scroll: false });

    // Auto-hide banner after 8 seconds
    setTimeout(() => {
      setPaymentSuccessBanner(false);
    }, 8000);
  }, [userId, refetchCredits, router]);

  useEffect(() => {
    // Detect Stripe redirect — Stripe adds session_id to the URL
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      handlePaymentSuccess();
    }
  }, [searchParams, handlePaymentSuccess]);

  // Sync credit balance from API back to Redux user state
  useEffect(() => {
    if (typeof creditBalance === "number" && authUser && creditBalance !== authUser.credits) {
      const updatedUser: AuthUser = {
        ...authUser,
        credits: creditBalance,
      };
      dispatch(setUser(updatedUser));
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    }
  }, [creditBalance, authUser, dispatch]);

  return (
    <div>
      {/* Payment Success Banner */}
      {paymentSuccessBanner && (
        <div className="mb-6 relative overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5">
            <button
              onClick={() => setPaymentSuccessBanner(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Payment Successful! 🎉
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Your subscription has been updated and credits have been added to your account.
                  Your plan and balance are now refreshed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "profile" && (
        <ProfileSection
          onNavigate={(v) => {
            if (v === "password") {
              setShowChangePassword(true);
            } else {
              setView(v);
            }
          }}
        />
      )}

      {view === "wallet" && (
        <CreditWalletDetail
          onBack={() => setView("profile")}
          onBuyCredits={() => {}}
        />
      )}

      {view === "notifications" && (
        <NotificationSettings onBack={() => setView("profile")} />
      )}

      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  );
}
