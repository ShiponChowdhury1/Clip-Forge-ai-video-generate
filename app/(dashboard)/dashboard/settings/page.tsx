"use client";

import { useState } from "react";
import {
  ProfileSection,
  CreditWalletDetail,
  ChangePassword,
  NotificationSettings,
} from "@/app/components/dashboard/settings";

type SettingsView = "profile" | "wallet" | "password" | "notifications";

export default function SettingsPage() {
  const [view, setView] = useState<SettingsView>("profile");

  return (
    <div>
      {view === "profile" && (
        <ProfileSection
          onNavigate={(v) => setView(v)}
          onLogout={() => {}}
        />
      )}

      {view === "wallet" && (
        <CreditWalletDetail
          onBack={() => setView("profile")}
          onBuyCredits={() => {}}
        />
      )}

      {view === "password" && (
        <ChangePassword onBack={() => setView("profile")} />
      )}

      {view === "notifications" && (
        <NotificationSettings onBack={() => setView("profile")} />
      )}
    </div>
  );
}
