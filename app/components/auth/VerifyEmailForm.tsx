"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard, AuthButton, OtpInput } from "@/app/components/auth";

export default function VerifyEmailForm() {
  const router = useRouter();
  const [otp, setOtp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Test mode: accept any 6-digit OTP
    if (otp.length === 6) {
      router.push("/reset-password");
    }
  };

  return (
    <AuthCard
      title="Verify Email"
      subtitle="Enter the 6-digit verification code sent to your email."
      variant="small"
    >
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
        <OtpInput length={6} onChange={setOtp} />

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
