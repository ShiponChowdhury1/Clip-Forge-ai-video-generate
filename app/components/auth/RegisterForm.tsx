"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { AuthCard, AuthInput, AuthButton, SocialButtons, OtpInput } from "@/app/components/auth";
import { getLowercaseEmailError } from "@/app/components/auth/emailValidation";
import { useRegisterMutation, useVerifyRegisterOtpMutation, useResendOtpMutation } from "@/lib/redux/features/auth/authApi";
import { formatApiDetail } from "@/lib/utils/formatApiError";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  // OTP modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");

  const [register, { isLoading }] = useRegisterMutation();
  const [verifyRegisterOtp, { isLoading: isVerifying }] = useVerifyRegisterOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const emailError = getLowercaseEmailError(trimmedEmail);
    if (emailError) {
      setError(emailError);
      return;
    }

    if (!agreed) {
      setError("Please agree to the Terms and Conditions.");
      return;
    }

    try {
      await register({ name, email: trimmedEmail, password }).unwrap();
      // Registration successful, show OTP modal
      setShowOtpModal(true);
    } catch (err: unknown) {
      const apiError = err as { data?: { detail?: unknown } };
      const detail = formatApiDetail(apiError.data?.detail) || "";
      // If user exists but might be unverified, resend OTP and show modal
      if (detail.toLowerCase().includes("already exists")) {
        try {
          await resendOtp({ email: trimmedEmail }).unwrap();
          setShowOtpModal(true);
          setOtpSuccess("A verification code has been sent to your email.");
        } catch {
          setError("Failed to send verification code. Please try again.");
        }
        return;
      }

      setError(detail || "Registration failed. Please try again.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");

    if (otp.length !== 6) {
      setOtpError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      await verifyRegisterOtp({ email: email.trim(), otp }).unwrap();
      router.push("/login");
    } catch (err: unknown) {
      const apiError = err as { data?: { detail?: unknown } };
      const detail = formatApiDetail(apiError.data?.detail);
      setOtpError(detail || "Invalid OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    setOtpError("");
    setOtpSuccess("");

    try {
      const result = await resendOtp({ email: email.trim() }).unwrap();
      setOtpSuccess(result.message || "A new OTP has been sent to your email.");
    } catch {
      setOtpError("Failed to resend OTP.");
    }
  };

  return (
    <>
      <AuthCard title="Create your account" variant="register">
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4" autoComplete="off">
          {/* Dummy hidden inputs to prevent browser autofill */}
          <input type="text" name="chrome-email-dummy" style={{ display: "none" }} tabIndex={-1} autoComplete="new-password" />
          <input type="password" name="chrome-password-dummy" style={{ display: "none" }} tabIndex={-1} autoComplete="new-password" />

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <AuthInput
            label="Full Name"
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={setName}
            autoComplete="new-password"
          />
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={setEmail}
            autoComplete="new-password"
          />
          <AuthInput
            label="Password"
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />
       <div className="flex items-start gap-3">
             <input
               type="checkbox"
               id="terms"
               checked={agreed}
               onChange={(e) => setAgreed(e.target.checked)}
               className="w-5 h-5 mt-0.5 rounded border border-gray-300 dark:border-[#1F1F1F] bg-gray-50 dark:bg-[#0A0A0A] cursor-pointer accent-[#00A6F4]"
             />
            <label htmlFor="terms" className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              I&apos;ve read and agree with the{" "}
              <Link href="/terms-of-service" className="text-[#00A6F4] font-semibold hover:underline">
                Terms and Conditions
              </Link>{" "}
              and the{" "}
              <Link href="/privacy-policy" className="text-[#00A6F4] font-semibold hover:underline">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          <AuthButton text="Create Account" loading={isLoading} />

   
          
          <SocialButtons />

          <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-[#00A6F4] font-bold hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </AuthCard>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1F1F1F] rounded-2xl w-full max-w-md p-6 sm:p-8 relative">
            {/* Close button */}
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-[#00A6F4]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#00A6F4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Verify Your Email</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                Enter the 6-digit verification code sent to{" "}
                <span className="text-[#00A6F4] font-medium">{email}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
              {otpError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {otpError}
                </div>
              )}
              {otpSuccess && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 text-sm">
                  {otpSuccess}
                </div>
              )}

              <OtpInput length={6} onChange={setOtp} />

              <AuthButton text="Verify" loading={isVerifying} />

              <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-[#00A6F4] font-bold hover:underline disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resend"}
                </button>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
