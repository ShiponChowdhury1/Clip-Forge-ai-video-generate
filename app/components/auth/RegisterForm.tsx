"use client";

import Link from "next/link";
import { AuthCard, AuthInput, AuthButton, SocialButtons } from "@/app/components/auth";

export default function RegisterForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <AuthCard title="Create Account" variant="register">
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        <AuthInput label="Full Name" type="text" placeholder="John Doe" />
        <AuthInput label="Email Address" type="email" placeholder="name@example.com" />
        <AuthInput label="Password" type="password" placeholder="••••••••" />

        <AuthButton text="Create Account" />

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            className="w-5 h-5 mt-0.5 rounded border-gray-600 bg-transparent accent-[#00A6F4] cursor-pointer"
          />
          <label htmlFor="terms" className="text-gray-400 text-sm leading-relaxed">
            I&apos;ve read and agree with the{" "}
            <Link href="#" className="text-[#00A6F4] font-semibold hover:underline">
              Terms and Conditions
            </Link>{" "}
            and the{" "}
            <Link href="#" className="text-[#00A6F4] font-semibold hover:underline">
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        <SocialButtons />

        <p className="text-gray-400 text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-[#00A6F4] font-bold hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
