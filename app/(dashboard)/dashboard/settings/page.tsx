"use client";

import { useState } from "react";
import {
  ProfileSection,
  CreditWalletDetail,
  ChangePassword,
  NotificationSettings,
} from "@/app/components/dashboard/settings";

type SettingsView = "profile" | "wallet" | "notifications";

export default function SettingsPage() {
  const [view, setView] = useState<SettingsView>("profile");
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <div>
      {view === "profile" && (
        <ProfileSection
          onNavigate={(v) => {
            if (v === "password") {
              setShowChangePassword(true);
            } else {
              setView(v);
            }
          }}
          onLogout={() => {}}
        />
      )}

      {view === "wallet" && (
        <CreditWalletDetail
          onBack={() => setView("profile")}
          onBuyCredits={() => {}}
        />
      )}

      {view === "notifications" && (
        <NotificationSettings onBack={() => setView("profile")} />
      )}

      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  );
}
