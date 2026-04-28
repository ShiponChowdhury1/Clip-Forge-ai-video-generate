"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleBuyCredits = () => {
    router.push("/dashboard/billing?buy=1");
  };

  return (
    <div>
      {/* Render all views but control visibility - prevents hook count mismatch */}
      <div className={view === "profile" ? "block" : "hidden"}>
        <ProfileSection
          onNavigate={(v) => {
            if (v === "password") {
              setShowChangePassword(true);
            } else {
              setView(v);
            }
          }}
        />
      </div>

      <div className={view === "wallet" ? "block" : "hidden"}>
        <CreditWalletDetail
          onBack={() => setView("profile")}
          onBuyCredits={handleBuyCredits}
        />
      </div>

      <div className={view === "notifications" ? "block" : "hidden"}>
        <NotificationSettings onBack={() => setView("profile")} />
      </div>

      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  );
}
