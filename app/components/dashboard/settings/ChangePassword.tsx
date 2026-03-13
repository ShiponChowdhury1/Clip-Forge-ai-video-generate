"use client";

import { useState, useEffect, useRef } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  Mail,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  useRequestChangePasswordOtpMutation,
  useVerifyChangePasswordOtpMutation,
  useChangePasswordMutation,
} from "@/lib/redux/features/auth/authApi";

type Step = "requesting" | "otp" | "password" | "success";

interface ChangePasswordProps {
  onClose: () => void;
}

export default function ChangePassword({ onClose }: ChangePasswordProps) {
  const [step, setStep] = useState<Step>("requesting");
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const [requestOtp, { isLoading: isRequesting }] = useRequestChangePasswordOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyChangePasswordOtpMutation();
  const [changePasswordApi, { isLoading: isChanging }] = useChangePasswordMutation();

  const requirements = [
    { label: "Minimum 8 characters", met: newPassword.length >= 8 },
    { label: "1 uppercase letter", met: /[A-Z]/.test(newPassword) },
    { label: "1 number", met: /\d/.test(newPassword) },
  ];

  useEffect(() => {
    let active = true;
    const requestInitialOtp = async () => {
      try {
        await requestOtp().unwrap();
        if (!active) return;
        setStep("otp");
        setResendCooldown(60);
      } catch (err) {
        if (!active) return;
        const detail =
          (err as { data?: { detail?: string } })?.data?.detail || "Failed to send OTP";
        setError(detail);
        setStep("otp");
      }
    };
    requestInitialOtp();
    return () => {
      active = false;
    };
  }, [requestOtp]);

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
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
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
    otpRefs.current[Math.min(pasteData.length, 5)]?.focus();
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
      setError((err as { data?: { detail?: string } })?.data?.detail || "Invalid OTP");
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
      await changePasswordApi({ new_password: newPassword }).unwrap();
      setStep("success");
    } catch (err) {
      setError((err as { data?: { detail?: string } })?.data?.detail || "Failed to change password");
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
      setError((err as { data?: { detail?: string } })?.data?.detail || "Failed to resend OTP");
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#111827] rounded-2xl w-full max-w-lg mx-auto shadow-2xl border border-gray-200 dark:border-[#1E293B] overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Step: Requesting */}
          {step === "requesting" && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-10 h-10 text-[#3B82F6] animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">Sending verification code to your email...</p>
            </div>
          )}

          {/* Step: OTP */}
          {step === "otp" && (
            <>
              {/* Icon + Title */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-gray-100 dark:bg-[#1A2332] border border-gray-300 dark:border-[#1A3155] rounded-2xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#2563EB]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Identity</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Enter the 6-digit code sent to your email</p>
              </div>

              {/* OTP Card */}
              <div className="bg-gray-50 dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6 sm:p-8">
                {/* OTP Inputs */}
                <div className="flex gap-2 sm:gap-3 justify-center mb-6">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={handleOtpPaste}
                      className="w-12 h-14 sm:w-14 sm:h-16 bg-gray-100 dark:bg-[#0A0E14] border border-gray-300 dark:border-[#1A3155] rounded-xl text-gray-900 dark:text-white text-center text-lg font-semibold outline-none focus:border-[#3B82F6]/50 transition"
                    />
                  ))}
                </div>

                {/* Resend */}
                <div className="text-center mb-6">
                  {resendCooldown > 0 ? (
                    <p className="text-gray-500 text-sm">
                      Resend code in <span className="text-gray-700 dark:text-gray-300">{resendCooldown}s</span>
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
                    onClick={onClose}
                    className="flex-1 bg-gray-100 dark:bg-[#1A1F2E] hover:bg-gray-200 dark:hover:bg-[#252B3B] border border-gray-300 dark:border-[#2A3040] text-gray-900 dark:text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <p className="text-red-400 text-sm font-semibold">Error</p>
                    <p className="text-red-400/80 text-xs">{error}</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Step: New Password */}
          {step === "password" && (
            <>
              {/* Icon + Title */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-gray-100 dark:bg-[#1A2332] border border-gray-300 dark:border-[#1A3155] rounded-2xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-[#2563EB]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Set New Password</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Create a strong new password</p>
              </div>

              {/* Password Card */}
              <div className="bg-gray-50 dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6 sm:p-8">
                {/* New Password */}
                <div className="mb-5">
                  <label className="block text-gray-900 dark:text-white text-sm font-semibold mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-gray-100 dark:bg-[#0A0E14] border border-gray-300 dark:border-[#1A3155] rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors pr-12"
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                      {showNew ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                  <label className="block text-gray-900 dark:text-white text-sm font-semibold mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-gray-100 dark:bg-[#0A0E14] border border-gray-300 dark:border-[#1A3155] rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors pr-12"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                      {showConfirm ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-100 dark:bg-[#0A1628] border border-gray-300 dark:border-[#1A3155] rounded-lg p-4 mb-8">
                  <p className="text-gray-900 dark:text-white text-sm font-semibold mb-3">Password Requirements:</p>
                  <div className="space-y-2">
                    {requirements.map((req) => (
                      <div key={req.label} className="flex items-center gap-2">
                        <CheckCircle className={`w-3.5 h-3.5 ${req.met ? "text-green-400" : "text-gray-600"}`} />
                        <span className={`text-sm ${req.met ? "text-gray-700 dark:text-gray-300" : "text-gray-500"}`}>{req.label}</span>
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
                    onClick={onClose}
                    className="flex-1 bg-gray-100 dark:bg-[#1A1F2E] hover:bg-gray-200 dark:hover:bg-[#252B3B] border border-gray-300 dark:border-[#2A3040] text-gray-900 dark:text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <p className="text-red-400 text-sm font-semibold">Error</p>
                    <p className="text-red-400/80 text-xs">{error}</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Step: Success */}
          {step === "success" && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Password Changed!</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Your password has been updated successfully</p>
              <button onClick={onClose} className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium py-3 rounded-xl text-sm transition-colors">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
