"use client";

import { useState, useEffect, useRef, useCallback, startTransition } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import {
  useRequestChangePasswordOtpMutation,
  useVerifyChangePasswordOtpMutation,
  useChangePasswordMutation,
} from "@/lib/redux/features/auth/authApi";

type Step = "requesting" | "otp" | "password" | "success";

interface ChangePasswordProps {
  onBack: () => void;
}

export default function ChangePassword({ onBack }: ChangePasswordProps) {
  const [step, setStep] = useState<Step>("requesting");
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const [requestOtp, { isLoading: isRequesting }] = useRequestChangePasswordOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyChangePasswordOtpMutation();
  const [changePassword, { isLoading: isChanging }] = useChangePasswordMutation();

  const requirements = [
    { label: "Minimum 8 characters", met: newPassword.length >= 8 },
    { label: "1 uppercase letter", met: /[A-Z]/.test(newPassword) },
    { label: "1 number", met: /\d/.test(newPassword) },
  ];

  // Auto request OTP on mount
  const handleRequestOtp = useCallback(async () => {
    setError("");
    try {
      await requestOtp().unwrap();
      setStep("otp");
      setResendCooldown(60);
    } catch (err) {
      const detail =
        (err as { data?: { detail?: string } })?.data?.detail || "Failed to send OTP";
      setError(detail);
      setStep("otp"); // still show OTP form so user can retry
    }
  }, [requestOtp]);

  useEffect(() => {
    startTransition(() => {
      handleRequestOtp();
    });
  }, [handleRequestOtp]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;
    const newOtp = [...otp];
    pasteData.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    const nextIndex = Math.min(pasteData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    setError("");
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }
    try {
      await verifyOtp({ otp: otpString }).unwrap();
      setStep("password");
    } catch (err) {
      const detail =
        (err as { data?: { detail?: string } })?.data?.detail || "Invalid OTP";
      setError(detail);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!requirements.every((r) => r.met)) {
      setError("Password does not meet requirements");
      return;
    }
    try {
      await changePassword({ new_password: newPassword }).unwrap();
      setStep("success");
    } catch (err) {
      const detail =
        (err as { data?: { detail?: string } })?.data?.detail || "Failed to change password";
      setError(detail);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setOtp(new Array(6).fill(""));
    try {
      await requestOtp().unwrap();
      setResendCooldown(60);
    } catch (err) {
      const detail =
        (err as { data?: { detail?: string } })?.data?.detail || "Failed to resend OTP";
      setError(detail);
    }
  };

  // Step: Requesting OTP (loading)
  if (step === "requesting") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-[#3B82F6] animate-spin mb-4" />
        <p className="text-gray-400 text-sm">Sending verification code to your email...</p>
      </div>
    );
  }

  // Step: Success
  if (step === "success") {
    return (
      <div>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Password Changed!</h1>
          <p className="text-gray-400 text-sm mt-1">
            Your password has been updated successfully
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium py-3 rounded-xl transition-colors text-sm"
          >
            Back to Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Icon + Title */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-[#1A2332] border border-[#1A3155] rounded-2xl flex items-center justify-center">
            {step === "otp" ? (
              <Mail className="w-6 h-6 text-[#2563EB]" />
            ) : (
              <Lock className="w-6 h-6 text-[#2563EB]" />
            )}
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white">
          {step === "otp" ? "Verify Your Identity" : "Set New Password"}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {step === "otp"
            ? "Enter the 6-digit code sent to your email"
            : "Create a strong new password"}
        </p>
      </div>

      {/* OTP Step */}
      {step === "otp" && (
        <div className="max-w-2xl mx-auto bg-[#0D1117] border border-[#1A3155] rounded-2xl p-8 mb-6">
          {/* OTP Inputs */}
          <div className="flex gap-2 sm:gap-3 justify-center mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                onPaste={handleOtpPaste}
                className="w-12 h-14 sm:w-14 sm:h-16 bg-[#0A0E14] border border-[#1A3155] rounded-xl text-white text-center text-lg font-semibold outline-none focus:border-[#3B82F6]/50 transition"
              />
            ))}
          </div>

          {/* Resend */}
          <div className="text-center mb-6">
            {resendCooldown > 0 ? (
              <p className="text-gray-500 text-sm">
                Resend code in <span className="text-gray-300">{resendCooldown}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isRequesting}
                className="text-[#3B82F6] hover:text-[#60A5FA] text-sm font-medium transition-colors"
              >
                {isRequesting ? "Sending..." : "Resend Code"}
              </button>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleVerifyOtp}
              disabled={isVerifying || otp.join("").length !== 6}
              className="flex-1 flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors text-sm"
            >
              {isVerifying ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
              ) : (
                "Verify Code"
              )}
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-[#1A1F2E] hover:bg-[#252B3B] border border-[#2A3040] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Password Step */}
      {step === "password" && (
        <div className="max-w-2xl mx-auto bg-[#0D1117] border border-[#1A3155] rounded-2xl p-8 mb-6">
          {/* New Password */}
          <div className="mb-5">
            <label className="block text-white text-sm font-semibold mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#0A0E14] border border-[#1A3155] rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showNew ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-white text-sm font-semibold mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#0A0E14] border border-[#1A3155] rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showConfirm ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-[#0A1628] border border-[#1A3155] rounded-lg p-4 mb-8">
            <p className="text-white text-sm font-semibold mb-3">
              Password Requirements:
            </p>
            <div className="space-y-2">
              {requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle
                    className={`w-3.5 h-3.5 ${req.met ? "text-green-400" : "text-gray-600"}`}
                  />
                  <span className={`text-sm ${req.met ? "text-gray-300" : "text-gray-500"}`}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleChangePassword}
              disabled={isChanging}
              className="flex-1 flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors text-sm"
            >
              {isChanging ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                "Save Password"
              )}
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-[#1A1F2E] hover:bg-[#252B3B] border border-[#2A3040] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <p className="text-red-400 text-sm font-semibold">Error</p>
            <p className="text-red-400/80 text-xs">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
