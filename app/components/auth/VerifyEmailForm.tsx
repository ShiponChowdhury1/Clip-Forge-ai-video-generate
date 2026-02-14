"use client";

import Link from "next/link";
import { AuthCard, AuthButton, OtpInput } from "@/app/components/auth";

export default function VerifyEmailForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <AuthCard
      title="Verify Email"
      subtitle="Enter the 6-digit verification code sent to your email."
      variant="small"
    >
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
        <OtpInput length={6} />

        <AuthButton text="Verify" />

        <p className="text-gray-400 text-sm text-center">
          Didn&apos;t receive the code?{" "}
          <Link href="#" className="text-[#00A6F4] font-bold hover:underline">
            Resend
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
