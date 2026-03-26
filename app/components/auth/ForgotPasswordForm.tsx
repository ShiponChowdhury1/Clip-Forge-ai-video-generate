"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AuthCard, AuthButton, AuthInput } from "@/app/components/auth";
import { useForgotPasswordMutation } from "@/lib/redux/features/auth/authApi";
import { setResetEmail } from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const result = await forgotPassword({ email }).unwrap();
      setSuccess(result.message);
      dispatch(setResetEmail(email));
      // Navigate to verify-email page after short delay
      setTimeout(() => router.push("/verify-email"), 1500);
    } catch (err: unknown) {
      const apiError = err as { data?: { detail?: string } };
      setError(apiError.data?.detail || "Failed to send OTP. Please try again.");
    }
  };

  return (
    <AuthCard
      title="Forgot Password"
      subtitle="Enter your email to receive a one-time password (OTP)."
      variant="small"
    >
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
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

        <AuthInput
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={setEmail}
        />

        <AuthButton text="Send OTP" loading={isLoading} />

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </form>
    </AuthCard>
  );
}
