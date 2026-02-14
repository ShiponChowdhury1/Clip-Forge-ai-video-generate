"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthCard, AuthInput, AuthButton } from "@/app/components/auth";

export default function ForgotPasswordForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <AuthCard
      title="Forgot Password"
      subtitle="Enter your email to receive a one-time password (OTP)."
      variant="small"
    >
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
        <div className="w-full">
          <label
            className="text-white font-bold text-sm tracking-[1.4px] capitalize block mb-2"
            style={{
              fontFamily: "Arimo, sans-serif",
              fontWeight: 700,
              fontSize: "18px",
              lineHeight: "20px",
              letterSpacing: "1.4px",
            }}
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            autoComplete="off"
            className="w-full bg-[#0d1117] border border-gray-700/50 rounded-xl px-4 py-4 text-sm outline-none focus:border-[#00A6F4]/50 transition [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_9999px_#0d1117_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:rgba(255,255,255,0.5)]"
            style={{ color: "#FFFFFF80", backgroundColor: "#0d1117" }}
          />
        </div>

        <AuthButton text="Send OTP" />

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-gray-400 text-sm hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </form>
    </AuthCard>
  );
}
