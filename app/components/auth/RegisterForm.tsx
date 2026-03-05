"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard, AuthInput, AuthButton, SocialButtons } from "@/app/components/auth";
import { useRegisterMutation } from "@/lib/redux/features/auth/authApi";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("Please agree to the Terms and Conditions.");
      return;
    }

    try {
      await register({ name, email, password }).unwrap();
      router.push("/login");
    } catch (err: unknown) {
      const apiError = err as { data?: { detail?: string } };
      setError(apiError.data?.detail || "Registration failed. Please try again.");
    }
  };

  return (
    <AuthCard title="Create Account" variant="register">
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <AuthInput label="Full Name" type="text" placeholder="John Doe" value={name} onChange={setName} />
        <AuthInput label="Email Address" type="email" placeholder="name@example.com" value={email} onChange={setEmail} />
        <AuthInput label="Password" type="password" placeholder="••••••••" value={password} onChange={setPassword} />

        <AuthButton text="Create Account" loading={isLoading} />

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 mt-0.5 rounded border-gray-600 cursor-pointer accent-[#00A6F4]"
            style={{ backgroundColor: "#2D3235" }}
          />
          <label htmlFor="terms" className="text-gray-400 text-sm leading-relaxed">
            I&apos;ve read and agree with the{" "}
            <Link href="/terms-of-service" className="text-[#00A6F4] font-semibold hover:underline">
              Terms and Conditions
            </Link>{" "}
            and the{" "}
            <Link href="/privacy-policy" className="text-[#00A6F4] font-semibold hover:underline">
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
