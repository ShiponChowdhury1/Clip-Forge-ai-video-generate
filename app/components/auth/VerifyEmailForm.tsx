"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard, AuthButton, OtpInput } from "@/app/components/auth";
import { useVerifyOtpMutation, useForgotPasswordMutation } from "@/lib/redux/features/auth/authApi";
import { setOtpVerified } from "@/lib/redux/features/auth/authSlice";
import { formatApiDetail } from "@/lib/utils/formatApiError";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

export default function VerifyEmailForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const resetEmail = useAppSelector((state) => state.auth.resetEmail);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendCooldown, setResendCooldown] = useState(60);

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [forgotPassword, { isLoading: isResending }] = useForgotPasswordMutation();

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!resetEmail) {
      setError("No email found. Please start from forgot password.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      await verifyOtp({ email: resetEmail, otp }).unwrap();
      dispatch(setOtpVerified(true));
      router.push("/reset-password");
    } catch (err: unknown) {
      const apiError = err as { data?: { detail?: unknown } };
      const detail = formatApiDetail(apiError.data?.detail);
      setError(detail || "Invalid OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    if (!resetEmail || resendCooldown > 0) return;
    setError("");
    setSuccess("");

    try {
      const result = await forgotPassword({ email: resetEmail }).unwrap();
      setSuccess(result.message);
      setResendCooldown(60);
    } catch {
      setError("Failed to resend OTP.");
    }
  };

  return (
    <AuthCard
      title="Verify Email"
      subtitle="Enter the 6-digit verification code sent to your email."
      variant="small"
    >
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 text-sm">
            {success}
          </div>
        )}

        <OtpInput length={6} onChange={setOtp} />

        <AuthButton text="Verify" loading={isLoading} />

        <p className="text-gray-600 dark:text-gray-400 text-sm text-center mt-1">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || resendCooldown > 0}
            className="text-[#00A6F4] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? "Sending..." : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
          </button>
        </p>
      </form>
    </AuthCard>
  );
}
