"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useGoogleAuthMutation } from "@/lib/redux/features/auth/authApi";
import { setCredentials, setUser } from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { formatApiDetail } from "@/lib/utils/formatApiError";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.10.12.3:8000/api";
const ORIGIN = API_BASE_URL.replace(/\/api$/, "");

const resolveProfileImageUrl = (url?: string | null) => {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${ORIGIN}${url}`;
};

export default function SocialButtons() {
  const [googleAuth] = useGoogleAuthMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [error, setError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(400);

  // Measure the actual container width so the Google iframe fills it exactly
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(Math.floor(entry.contentRect.width));
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Decode Google JWT credential to extract user info
  const decodeGoogleJwt = (credential: string) => {
    try {
      const base64Url = credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload) as {
        sub: string;
        name: string;
        email: string;
        picture: string;
      };
    } catch {
      return null;
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError("Google sign-in failed. No credential received.");
      return;
    }
    setError("");

    // Log decoded Google JWT for debugging
    const googleUser = decodeGoogleJwt(credentialResponse.credential);
    console.log("Google credential (decoded):", googleUser);

    try {
      console.log("Sending token to backend...");
      const result = await googleAuth({ token: credentialResponse.credential }).unwrap();
      console.log("Backend response:", result);

      localStorage.setItem("token", result.access_token);
      dispatch(setCredentials({ token: result.access_token }));

      // Use backend user data + merge Google picture
      const userData = result.user;
      if (userData) {
        const mergedUser = {
          ...userData,
          picture: userData.picture || resolveProfileImageUrl(userData.profile_image_url) || googleUser?.picture,
        };
        console.log("Using merged user data:", mergedUser);
        localStorage.setItem("user", JSON.stringify(mergedUser));
        dispatch(setUser(mergedUser));
      } else {
        console.log("No user in backend response, using Google JWT data");
        if (googleUser) {
          const fallbackUser = {
            id: 0,
            name: googleUser.name,
            email: googleUser.email,
            credits: 0,
            subscription_plan: "free",
            role: "user" as const,
            picture: googleUser.picture,
          };
          localStorage.setItem("user", JSON.stringify(fallbackUser));
          dispatch(setUser(fallbackUser));
        }
      }
      const role = userData?.role || "user";
      router.push(role === "admin" || role === "super_admin" ? "/admin" : "/dashboard");
    } catch (err: unknown) {
      const apiError = err as { data?: { detail?: unknown } };
      const detail = formatApiDetail(apiError.data?.detail);
      setError(detail || "Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-5">
      {/* Divider */}
      <div className="w-full flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-300 dark:bg-[#1F1F1F]" />
        <span className="text-gray-500 text-xs font-semibold tracking-[2px] uppercase">
          Or Continue With
        </span>
        <div className="flex-1 h-px bg-gray-300 dark:bg-[#1F1F1F]" />
      </div>

      {error && (
        <div className="w-full bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Google Sign-In Button — custom styled with real GoogleLogin on top */}
      <div className="w-full flex gap-4" ref={containerRef}>
        <div className="w-full relative h-12">
          {/* Custom styled visual underneath */}
          <div
            className="w-full h-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#1F1F1F] text-gray-900 dark:text-white font-semibold text-sm pointer-events-none"
            style={{ borderRadius: "16px", borderWidth: "1.11px" }}
          >
            <Image
              src="/google/google.png"
              alt="Google"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            Google
          </div>
          {/*
            Real GoogleLogin overlay — opacity:0.01 (not 0) so it stays
            interactive. The iframe is stretched to fill the full container
            via CSS so clicks always land on the real Google button.
          */}
          <div
            className="absolute inset-0 overflow-hidden"
            data-google-btn-overlay
            style={{
              borderRadius: "16px",
              opacity: 0.01,
              cursor: "pointer",
            }}
          >
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google sign-in was cancelled.")}
              width={containerWidth}
              size="large"
              shape="pill"
              type="standard"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

