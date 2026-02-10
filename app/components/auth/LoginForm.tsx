"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard, AuthInput, AuthButton, SocialButtons } from "@/app/components/auth";

// Test credentials for testing without backend
const TEST_EMAIL = "admin@gmail.com";
const TEST_PASSWORD = "123456";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Test mode: check credentials
    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password. Use admin@gmail.com / 123456");
    }
  };

  return (
    <AuthCard title="Welcome Back" variant="login">
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}
        <AuthInput 
          label="Email Address" 
          type="email" 
          placeholder="name@example.com"
          value={email}
          onChange={setEmail}
        />
        <AuthInput
          label="Password"
          type="password"
          placeholder="••••••••"
          rightLabel="Forgot Password?"
          onRightLabelClick={() => router.push("/forgot-password")}
          value={password}
          onChange={setPassword}
        />

        <AuthButton text="Log In" />

        <SocialButtons />

        <p className="text-gray-400 text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#00A6F4] font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
