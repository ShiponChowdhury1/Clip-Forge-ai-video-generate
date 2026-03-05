"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { makeStore, AppStore } from "./store";
import { setCredentials, setUser } from "./features/auth/authSlice";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    // Restore token from localStorage on client
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        storeRef.current.dispatch(setCredentials({ token }));
      }
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          storeRef.current.dispatch(setUser(JSON.parse(userStr)));
        } catch {
          localStorage.removeItem("user");
        }
      }
    }
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={storeRef.current}>{children}</Provider>
    </GoogleOAuthProvider>
  );
}
