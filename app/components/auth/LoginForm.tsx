"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard, AuthInput, AuthButton, SocialButtons } from "@/app/components/auth";
import { getLowercaseEmailError } from "@/app/components/auth/emailValidation";
import { useLoginMutation } from "@/lib/redux/features/auth/authApi";
import { setCredentials, setUser } from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.10.12.3:8000/api";
const ORIGIN = API_BASE_URL.replace(/\/api$/, "");

const resolveProfileImageUrl = (url?: string | null) => {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${ORIGIN}${url}`;
};

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const emailError = getLowercaseEmailError(trimmedEmail);
    if (emailError) {
      setError(emailError);
      return;
    }

    try {
      const result = await login({ email: trimmedEmail, password }).unwrap();
      const normalizedUser = {
        ...result.user,
        subscription_plan: result.user.subscription_plan || "Free",
        picture: result.user.picture || resolveProfileImageUrl(result.user.profile_image_url),
      };
      localStorage.setItem("token", result.access_token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      dispatch(setCredentials({ token: result.access_token }));
      dispatch(setUser(normalizedUser));
      router.push(normalizedUser.role === "admin" || normalizedUser.role === "super_admin" ? "/admin" : "/dashboard");
    } catch (err: unknown) {
      const apiError = err as { data?: { detail?: string | Array<{ msg: string }> } };
      const detail = apiError.data?.detail;
      if (typeof detail === "string") {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join(", "));
      } else {
        setError("Invalid email or password.");
      }
    }
  };

  return (
    <AuthCard title="Welcome back" variant="login">
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5" autoComplete="off">
        {/* Dummy hidden inputs to prevent browser autofill */}
        <input type="text" name="chrome-email-dummy" style={{ display: "none" }} tabIndex={-1} autoComplete="new-password" />
        <input type="password" name="chrome-password-dummy" style={{ display: "none" }} tabIndex={-1} autoComplete="new-password" />

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <AuthInput
          label="Email Address"
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={setEmail}
          autoComplete="new-password"
        />
        <AuthInput
          label="Password"
          type="password"
          placeholder="Enter Your Password"
          rightLabel="Forgot Password?"
          onRightLabelClick={() => router.push("/forgot-password")}
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
        />

        <AuthButton text="Log In" loading={isLoading} />

        <SocialButtons />

        <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#00A6F4] font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
