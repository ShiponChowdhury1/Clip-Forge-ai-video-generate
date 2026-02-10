"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard, AuthInput, AuthButton } from "@/app/components/auth";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Test mode: redirect to login on success
    router.push("/login");
  };

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Create a new password for your account."
      variant="small"
    >
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}
        <AuthInput 
          label="New Password" 
          type="password" 
          placeholder="••••••••"
          value={newPassword}
          onChange={setNewPassword}
        />
        <AuthInput 
          label="Confirm Password" 
          type="password" 
          placeholder="••••••••"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

        <AuthButton text="Reset Password" />
      </form>
    </AuthCard>
  );
}
