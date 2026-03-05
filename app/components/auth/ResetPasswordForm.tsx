"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard, AuthInput, AuthButton } from "@/app/components/auth";
import { useResetPasswordMutation } from "@/lib/redux/features/auth/authApi";
import { clearResetFlow } from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

export default function ResetPasswordForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const resetEmail = useAppSelector((state) => state.auth.resetEmail);
  const otpVerified = useAppSelector((state) => state.auth.otpVerified);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!resetEmail || !otpVerified) {
      setError("Please verify your OTP first.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const result = await resetPassword({ email: resetEmail, new_password: newPassword }).unwrap();
      setSuccess(result.message);
      dispatch(clearResetFlow());
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: unknown) {
      const apiError = err as { data?: { detail?: string } };
      setError(apiError.data?.detail || "Failed to reset password.");
    }
  };

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Create a new password for your account."
      variant="small"
    >
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
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

        <AuthInput label="New Password" type="password" placeholder="••••••••" value={newPassword} onChange={setNewPassword} />
        <AuthInput label="Confirm Password" type="password" placeholder="••••••••" value={confirmPassword} onChange={setConfirmPassword} />

        <AuthButton text="Reset Password" loading={isLoading} />
      </form>
    </AuthCard>
  );
}
