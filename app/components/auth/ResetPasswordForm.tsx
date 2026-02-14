"use client";

import { AuthCard, AuthInput, AuthButton } from "@/app/components/auth";

export default function ResetPasswordForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Create a new password for your account."
      variant="small"
    >
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        <AuthInput label="New Password" type="password" placeholder="••••••••" />
        <AuthInput label="Confirm Password" type="password" placeholder="••••••••" />

        <AuthButton text="Send OTP" />
      </form>
    </AuthCard>
  );
}
