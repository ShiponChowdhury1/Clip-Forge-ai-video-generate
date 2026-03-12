"use client";

import {
  Download,
  Bell,
  ChevronDown,
  User,
  Lock,
  LogOut,
  Pencil,
  Eye,
  EyeOff,
  Mail,
  Shield,
  ShieldCheck,
  X,
  CircleUserRound,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Loader2,
  Camera,
  Check,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { useLogoutMutation, useRequestChangePasswordOtpMutation, useVerifyChangePasswordOtpMutation, useChangePasswordMutation, useUpdateProfileMutation } from "@/lib/redux/features/auth/authApi";
import { logout as logoutAction, setUser } from "@/lib/redux/features/auth/authSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.10.12.3:8000/api";
const ORIGIN = API_BASE_URL.replace(/\/api$/, "");

interface AdminHeaderProps {
  onExport?: () => void;
}

// ─── My Profile Modal ────────────────────────────────────────────
function ProfileModal({ onClose }: { onClose: () => void }) {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [updateProfile] = useUpdateProfileMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [nameLoading, setNameLoading] = useState(false);
  const [pictureLoading, setPictureLoading] = useState(false);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleSaveName = async () => {
    const trimmed = editName.trim();
    if (!trimmed || trimmed === user?.name) {
      setIsEditingName(false);
      setEditName(user?.name || "");
      return;
    }
    setNameLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", trimmed);
      const res = await updateProfile(formData).unwrap();
      const updatedUser = {
        id: res.id, name: res.name, email: res.email,
        credits: res.credits, subscription_plan: res.subscription_plan,
        role: res.role,
        picture: res.profile_image_url ? `${ORIGIN}${res.profile_image_url}` : user?.picture,
      };
      dispatch(setUser(updatedUser));
      if (typeof window !== "undefined") localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditingName(false);
    } catch {
      setEditName(user?.name || "");
      setIsEditingName(false);
    } finally {
      setNameLoading(false);
    }
  };

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPictureLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", user?.name || "");
      formData.append("profile_image", file);
      const res = await updateProfile(formData).unwrap();
      const updatedUser = {
        id: res.id, name: res.name, email: res.email,
        credits: res.credits, subscription_plan: res.subscription_plan,
        role: res.role,
        picture: res.profile_image_url ? `${ORIGIN}${res.profile_image_url}` : user?.picture,
      };
      dispatch(setUser(updatedUser));
      if (typeof window !== "undefined") localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch {
      // silently fail
    } finally {
      setPictureLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#111827] rounded-2xl w-full max-w-md mx-auto shadow-2xl border border-gray-200 dark:border-[#1E293B] overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-1">My Profile</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm text-center mb-6">Update your name and profile picture</p>

          {/* Avatar with camera overlay */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePictureChange} className="hidden" />
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-cyan-500/30 bg-cyan-500/10">
                {user?.picture ? (
                  <img src={user.picture} alt={user?.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-cyan-400 font-bold text-2xl">{user?.name ? getInitials(user.name) : "A"}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={pictureLoading}
                className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]"
              >
                {pictureLoading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Camera className="w-5 h-5 text-white" />
                    <span className="text-[10px] text-white/80">Change</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-gray-100 dark:bg-[#1E293B]/60 rounded-2xl p-5 space-y-4">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <User className="w-3.5 h-3.5" />
                Full Name
              </label>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveName();
                      if (e.key === "Escape") { setIsEditingName(false); setEditName(user?.name || ""); }
                    }}
                    autoFocus
                    className="flex-1 bg-gray-100 dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-xl px-4 py-2.5 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button onClick={handleSaveName} disabled={nameLoading} className="w-9 h-9 bg-cyan-500 hover:bg-cyan-600 rounded-lg flex items-center justify-center text-white shrink-0">
                    {nameLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { setIsEditingName(false); setEditName(user?.name || ""); }} className="w-9 h-9 bg-gray-100 dark:bg-[#1A2332] hover:bg-gray-200 dark:hover:bg-[#252B3B] border border-gray-300 dark:border-[#2A3040] rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-gray-900 dark:text-white text-sm font-medium">{user?.name || "—"}</p>
                  <button onClick={() => { setEditName(user?.name || ""); setIsEditingName(true); }} className="w-7 h-7 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <Mail className="w-3.5 h-3.5" />
                Email Address
              </label>
              <p className="text-gray-900 dark:text-white text-sm font-medium">{user?.email || "—"}</p>
            </div>

            {/* Role */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <Shield className="w-3.5 h-3.5" />
                Role
              </label>
              <p className="text-gray-900 dark:text-white text-sm font-medium capitalize">{user?.role || "admin"}</p>
            </div>

            {/* Verified */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Identity Verified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Change Password Modal (3-step: OTP request → verify → new password) ───
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  type Step = "requesting" | "otp" | "password" | "success";
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

  const handleRequestOtp = useCallback(async () => {
    setError("");
    try {
      await requestOtp().unwrap();
      setStep("otp");
      setResendCooldown(60);
    } catch (err) {
      const detail = (err as { data?: { detail?: string } })?.data?.detail || "Failed to send OTP";
      setError(detail);
      setStep("otp");
    }
  }, [requestOtp]);

  useEffect(() => {
    handleRequestOtp();
  }, [handleRequestOtp]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

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
    pasteData.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    otpRefs.current[Math.min(pasteData.length, 5)]?.focus();
  };

  const handleVerifyOtp = async () => {
    setError("");
    const otpString = otp.join("");
    if (otpString.length !== 6) { setError("Please enter the 6-digit code"); return; }
    try {
      await verifyOtp({ otp: otpString }).unwrap();
      setStep("password");
    } catch (err) {
      setError((err as { data?: { detail?: string } })?.data?.detail || "Invalid OTP");
    }
  };

  const handleChangePassword = async () => {
    setError("");
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    if (!requirements.every((r) => r.met)) { setError("Password does not meet requirements"); return; }
    try {
      await changePasswordApi({ new_password: newPassword }).unwrap();
      setStep("success");
    } catch (err) {
      setError((err as { data?: { detail?: string } })?.data?.detail || "Failed to change password");
    }
  };

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

// ─── Admin Header ────────────────────────────────────────────────
export default function AdminHeader({ onExport }: AdminHeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const [logoutApi] = useLogoutMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    try {
      await logoutApi().unwrap();
    } catch {
      // Even if API fails, clear local state
    }
    dispatch(logoutAction());
    router.push("/");
  };

  const displayName = mounted ? (user?.name || "Admin") : "Admin";
  const displayEmail = mounted ? (user?.email || "") : "";
  const displayPicture = mounted ? user?.picture : null;
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <header className="flex items-center justify-end gap-3 mb-6 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1F1F1F] rounded-xl px-4 py-3">
        {/* Export button */}
        <button
          onClick={onExport}
          className="h-10 flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-4 rounded-lg text-sm transition-colors whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export Data</span>
        </button>

        {/* Notification bell */}
        <button className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-[#2563EB] transition-colors relative shrink-0">
          <Bell className="w-5 h-5" />
        </button>

        {/* User avatar + dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="h-10 flex items-center gap-2.5 bg-gray-50 dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] hover:border-[#2563EB] rounded-lg px-2.5 transition-all cursor-pointer"
          >
            {displayPicture ? (
              <img
                src={displayPicture}
                alt={displayName}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-semibold text-[11px]">
                {initials}
              </div>
            )}
            <span className="text-gray-900 dark:text-white text-sm font-medium max-w-[120px] truncate hidden sm:inline">
              {displayName}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showProfileMenu ? "rotate-180" : ""}`} />
          </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-xl shadow-2xl z-60 min-w-55 py-2 overflow-hidden">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-[#1A3155]">
                  <p className="text-gray-900 dark:text-white text-sm font-semibold truncate">{displayName}</p>
                  <p className="text-gray-400 text-xs mt-0.5 truncate">
                    {displayEmail}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowProfileModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1A2332] hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowPasswordModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1A2332] hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-200 dark:border-[#1A3155] pt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-gray-100 dark:hover:bg-[#1A2332] transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
      </header>

      {/* Modals */}
      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl shadow-black/20 dark:shadow-black/50">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Confirm Logout
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center mb-8">
              Are you sure you want to sign out of your account?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-gray-100 dark:bg-[#1A1F2E] hover:bg-gray-200 dark:hover:bg-[#252B3B] border border-gray-300 dark:border-[#2A3040] text-gray-900 dark:text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
