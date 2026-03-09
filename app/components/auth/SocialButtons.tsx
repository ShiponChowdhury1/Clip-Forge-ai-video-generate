"use client";

import { useState } from "react";
import Image from "next/image";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleAuthMutation } from "@/lib/redux/features/auth/authApi";
import { setCredentials, setUser } from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";

export default function SocialButtons() {
  const [googleAuth] = useGoogleAuthMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [error, setError] = useState("");

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

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
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
          picture: userData.picture || googleUser?.picture,
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
            role: "user",
            picture: googleUser.picture,
          };
          localStorage.setItem("user", JSON.stringify(fallbackUser));
          dispatch(setUser(fallbackUser));
        }
      }
      const role = userData?.role || "user";
      router.push(role === "admin" ? "/admin" : "/dashboard");
    } catch (err: unknown) {
      const apiError = err as { data?: { detail?: string } };
      setError(apiError.data?.detail || "Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-5">
      {/* Divider */}
      <div className="w-full flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-700/50" />
        <span className="text-gray-500 text-xs font-semibold tracking-[2px] uppercase">
          Or Continue With
        </span>
        <div className="flex-1 h-px bg-gray-700/50" />
      </div>

      {error && (
        <div className="w-full bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="w-full flex gap-4">
        <div className="w-full relative" style={{ height: "58px" }}>
          {/* Custom styled button underneath */}
          <div
            className="w-full h-full flex items-center justify-center gap-2 bg-[#1e2a30] border border-gray-700/50 text-white font-semibold text-sm"
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
          {/* Invisible GoogleLogin overlay */}
          <div className="absolute inset-0 opacity-0 overflow-hidden" style={{ borderRadius: "16px" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google sign-in was cancelled.")}
              width="400"
              shape="pill"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
