"use client";

import { useEffect, useState } from "react";
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
  const [store] = useState<AppStore>(() => makeStore());

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      store.dispatch(setCredentials({ token }));
    }
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        store.dispatch(setUser(JSON.parse(userStr)));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, [store]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>{children}</Provider>
    </GoogleOAuthProvider>
  );
}
