"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard, AuthInput, AuthButton, SocialButtons } from "@/app/components/auth";

export default function LoginForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <AuthCard title="Welcome Back" variant="login">
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        <AuthInput label="Email Address" type="email" placeholder="name@example.com" />
        <AuthInput
          label="Password"
          type="password"
          placeholder="••••••••"
          rightLabel="Forgot Password?"
          onRightLabelClick={() => router.push("/forgot-password")}
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
