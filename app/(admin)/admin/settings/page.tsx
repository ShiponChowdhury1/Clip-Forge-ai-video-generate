"use client";

import { useState } from "react";
import {
  Save,
  Settings2,
  CreditCard,
  Gauge,
  Wallet,
  Scale,
  ShieldCheck,
  ChevronDown,
  Plus,
  Pencil,
  ArrowLeft,
  Download,
  X,
} from "lucide-react";
import { AdminHeader } from "@/app/components/admin";

// Toggle Component
function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        enabled ? "bg-cyan-500" : "bg-[#1A3155]"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// Sidebar Tabs
const tabs = [
  { id: "credit-settings", label: "Credit Settings", icon: Settings2 },
  { id: "plan-pricing", label: "Plan & Pricing", icon: CreditCard },
  { id: "usage-limits", label: "Usage Limits", icon: Gauge },
  { id: "payment-rules", label: "Payment Rules", icon: Wallet },
  { id: "legal-policy", label: "Legal & Policy", icon: Scale },
  { id: "admins-security", label: "Admins & Security", icon: ShieldCheck },
];

// Plans data
const plans = [
  { name: "Free Plan", price: "$0/mo", credits: "50 credits", initial: "F", color: "bg-[#1A3155]" },
  { name: "Starter Plan", price: "$19/mo", credits: "200 credits", initial: "S", color: "bg-[#1A3155]" },
  { name: "Pro Plan", price: "$49/mo", credits: "1,000 credits", initial: "P", color: "bg-[#1A3155]" },
  { name: "Enterprise Plan", price: "$299/mo", credits: "5,000 credits", initial: "E", color: "bg-[#1A3155]" },
];

// Admins data
const admins = [
  { name: "Sarah Chen", email: "sarah@vidflow.com", role: "Super Admin", initials: "SC", color: "bg-[#2563EB]" },
  { name: "Mike Johnson", email: "mike@vidflow.com", role: "Admin", initials: "MJ", color: "bg-[#2563EB]" },
  { name: "Emma Davis", email: "emma@vidflow.com", role: "Support Agent", initials: "ED", color: "bg-[#2563EB]" },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("credit-settings");
  const [creditCostPerVideo, setCreditCostPerVideo] = useState("25");
  const [addOnCreditCost, setAddOnCreditCost] = useState("4.99");
  const [creditExpiry, setCreditExpiry] = useState("Never");
  const [allowNegativeBalance, setAllowNegativeBalance] = useState(false);

  // Usage Limits state
  const [dailyVideoLimit, setDailyVideoLimit] = useState("100");
  const [monthlyVideoLimit, setMonthlyVideoLimit] = useState("2500");

  // Legal & Policy editing state
  const [isEditingPolicy, setIsEditingPolicy] = useState(false);
  const [policySection1Intro, setPolicySection1Intro] = useState(
    'VidFlow ("we," "our," or "us") collects information that you provide directly to us when using our video generation platform. This includes:'
  );
  const [policySection1Items, setPolicySection1Items] = useState(
    'Account information (name, email address, password)\nPayment and billing information\nUsage data and analytics\nContent you create or upload to our platform\nCommunications with our support team'
  );
  const [policySection2Intro, setPolicySection2Intro] = useState(
    'We use the collected information for the following purposes:'
  );
  const [policySection2Items, setPolicySection2Items] = useState(
    'To provide, maintain, and improve our services\nTo process transactions and send transaction notifications\nTo respond to your comments, questions, and provide customer support\nTo send you technical notices, updates, security alerts, and support messages\nTo monitor and analyze trends, usage, and activities in connection with our services\nTo detect, prevent, and address technical issues and fraudulent activity'
  );
  const [policySection3Intro, setPolicySection3Intro] = useState(
    'We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:'
  );
  const [policySection3Items, setPolicySection3Items] = useState(
    'With your consent or at your direction\nWith service providers who perform services on our behalf\nTo comply with legal obligations\nTo protect the rights, property, and safety of VidFlow, our users, and the public\nIn connection with a merger, sale, or acquisition of all or a portion of our business'
  );
  const [policyContactName, setPolicyContactName] = useState('VidFlow Privacy Team');
  const [policyContactEmail, setPolicyContactEmail] = useState('privacy@vidflow.com');
  const [policyContactAddress, setPolicyContactAddress] = useState('123 Tech Avenue, San Francisco, CA 94105');

  return (
    <div>
      <AdminHeader />
       <h3 className="text-white text-xl font-semibold mb-2">Settings</h3>
      {/* Description */}
      <p className="text-gray-400 text-sm mb-6">
        Configure platform-wide rules, pricing, and system parameters
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#3B82F6] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#1A2332]"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Content */}
        <div className="flex-1">
          {/* Credit Settings Tab */}
          {activeTab === "credit-settings" && (
            <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 sm:p-8">
              <h2 className="text-white text-xl font-bold mb-8">
                Credit Consumption Rules
              </h2>

              {/* Credit Cost Per Video & Add-On Credit Cost */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    Credit Cost Per Video
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={creditCostPerVideo}
                      onChange={(e) => setCreditCostPerVideo(e.target.value)}
                      className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors pr-20"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      CREDITS
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    Number of credits deducted for standard generation
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    Add-On Credit Cost
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      $
                    </span>
                    <input
                      type="text"
                      value={addOnCreditCost}
                      onChange={(e) => setAddOnCreditCost(e.target.value)}
                      className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-xl pl-8 pr-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    Base price for 100 extra credits
                  </p>
                </div>
              </div>

              {/* Credit Expiry Rules & Allow Negative Balance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    Credit Expiry Rules
                  </label>
                  <div className="relative">
                    <select
                      value={creditExpiry}
                      onChange={(e) => setCreditExpiry(e.target.value)}
                      className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="Never">Never</option>
                      <option value="30 Days">30 Days</option>
                      <option value="60 Days">60 Days</option>
                      <option value="90 Days">90 Days</option>
                      <option value="1 Year">1 Year</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    When do purchased credits expire?
                  </p>
                </div>

                <div className="bg-[#0A0F18] border border-[#1A3155] rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Allow Negative Balance
                    </p>
                    <p className="text-gray-500 text-xs">
                      Enable overdraft for enterprise customers
                    </p>
                  </div>
                  <Toggle
                    enabled={allowNegativeBalance}
                    onChange={setAllowNegativeBalance}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium px-6 py-3 rounded-full text-sm transition-colors">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Plan & Pricing Tab */}
          {activeTab === "plan-pricing" && (
            <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <h2 className="text-white text-lg sm:text-xl font-bold">Subscription Plans</h2>
                <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm transition-colors">
                  <Plus className="w-4 h-4" />
                  Add New Plan
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className="bg-[#0A0F18] border border-[#1A3155] rounded-xl p-3 sm:p-4 md:p-5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#1A3155] flex items-center justify-center text-white font-semibold text-xs sm:text-sm shrink-0">
                        {plan.initial}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{plan.name}</p>
                        <p className="text-gray-400 text-xs mt-0.5 truncate">
                          {plan.price} &bull; {plan.credits}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Usage Limits Tab */}
          {activeTab === "usage-limits" && (
            <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 sm:p-8">
              <h2 className="text-white text-xl font-bold mb-8">
                System Usage Limits
              </h2>

              {/* Daily Video Limit */}
              <div className="mb-6">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                  Daily Video Limit
                </label>
                <input
                  type="text"
                  value={dailyVideoLimit}
                  onChange={(e) => setDailyVideoLimit(e.target.value)}
                  className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
                />
                <p className="text-gray-500 text-xs mt-2">
                  Max generations per user per day (default)
                </p>
              </div>

              {/* Monthly Video Limit */}
              <div className="mb-8">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                  Monthly Video Limit
                </label>
                <input
                  type="text"
                  value={monthlyVideoLimit}
                  onChange={(e) => setMonthlyVideoLimit(e.target.value)}
                  className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
                />
                <p className="text-gray-500 text-xs mt-2">
                  Max generations per user per month (default)
                </p>
              </div>

              {/* Info banner */}
              <div className="bg-[#0A0F18] border border-[#1A3155] rounded-xl p-4 mb-8">
                <p className="text-cyan-400 text-sm">
                  Per-user overrides can be set in the User Details drawer.
                </p>
              </div>

              <hr className="border-[#1A3155] mb-6" />

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-medium px-6 py-3 rounded-lg text-sm transition-colors">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Payment Rules Tab */}
          {activeTab === "payment-rules" && (
            <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <h2 className="text-white text-lg sm:text-xl font-bold">
                  Payment & Refund Rules
                </h2>
                <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm transition-colors">
                  <Pencil className="w-4 h-4" />
                  Edit Rules
                </button>
              </div>

              <div className="bg-[#0A0F18] border border-[#1A3155] rounded-xl p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Refund Allowed
                    </p>
                    <p className="text-white text-sm font-medium">Yes</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Refund Window
                    </p>
                    <p className="text-white text-sm font-medium">30 days</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Partial Refunds
                    </p>
                    <p className="text-white text-sm font-medium">Enabled</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Return Credits
                    </p>
                    <p className="text-white text-sm font-medium">On Refund</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Default Currency
                    </p>
                    <p className="text-white text-sm font-medium">USD - US Dollar</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Legal & Policy Tab */}
          {activeTab === "legal-policy" && (
            <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 sm:p-8">
              {/* Back link */}
              <button className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Settings
              </button>

              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold">Privacy Policy</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Last updated: February 1, 2026 &bull; Version 2.4
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                  {isEditingPolicy ? (
                    <>
                      <button
                        onClick={() => setIsEditingPolicy(false)}
                        className="flex items-center gap-2 bg-[#0A0F18] border border-[#1A3155] hover:border-red-500 text-gray-300 font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={() => setIsEditingPolicy(false)}
                        className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditingPolicy(true)}
                        className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>
                      <button className="flex items-center gap-2 bg-[#0A0F18] border border-[#1A3155] hover:border-[#2563EB] text-gray-300 font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
                        <Download className="w-4 h-4" />
                        Export PDF
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Editing indicator */}
              {isEditingPolicy && (
                <div className="mt-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-cyan-400" />
                  <p className="text-cyan-400 text-sm">You are now in edit mode. Modify the content below and click Save Changes.</p>
                </div>
              )}

              {/* Policy Content */}
              <div className="mt-6 bg-[#0A0F18] border border-[#1A3155] rounded-xl p-6 sm:p-8 space-y-8">
                {/* Section 1 */}
                <div>
                  <h3 className="text-white text-lg font-bold mb-3">
                    1. Information We Collect
                  </h3>
                  {isEditingPolicy ? (
                    <>
                      <textarea
                        value={policySection1Intro}
                        onChange={(e) => setPolicySection1Intro(e.target.value)}
                        rows={3}
                        className="w-full bg-[#0D1117] border border-[#1A3155] rounded-xl px-4 py-3 text-gray-300 text-sm leading-relaxed focus:outline-none focus:border-[#3B82F6] transition-colors resize-y mb-3"
                      />
                      <textarea
                        value={policySection1Items}
                        onChange={(e) => setPolicySection1Items(e.target.value)}
                        rows={5}
                        placeholder="One item per line"
                        className="w-full bg-[#0D1117] border border-[#1A3155] rounded-xl px-4 py-3 text-gray-300 text-sm leading-relaxed focus:outline-none focus:border-[#3B82F6] transition-colors resize-y"
                      />
                      <p className="text-gray-500 text-xs mt-1.5">Enter one bullet point per line</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        {policySection1Intro}
                      </p>
                      <ul className="text-gray-300 text-sm leading-relaxed space-y-1.5 ml-6 list-disc">
                        {policySection1Items.split('\n').filter(Boolean).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {/* Section 2 */}
                <div>
                  <h3 className="text-white text-lg font-bold mb-3">
                    2. How We Use Your Information
                  </h3>
                  {isEditingPolicy ? (
                    <>
                      <textarea
                        value={policySection2Intro}
                        onChange={(e) => setPolicySection2Intro(e.target.value)}
                        rows={2}
                        className="w-full bg-[#0D1117] border border-[#1A3155] rounded-xl px-4 py-3 text-gray-300 text-sm leading-relaxed focus:outline-none focus:border-[#3B82F6] transition-colors resize-y mb-3"
                      />
                      <textarea
                        value={policySection2Items}
                        onChange={(e) => setPolicySection2Items(e.target.value)}
                        rows={6}
                        placeholder="One item per line"
                        className="w-full bg-[#0D1117] border border-[#1A3155] rounded-xl px-4 py-3 text-gray-300 text-sm leading-relaxed focus:outline-none focus:border-[#3B82F6] transition-colors resize-y"
                      />
                      <p className="text-gray-500 text-xs mt-1.5">Enter one bullet point per line</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        {policySection2Intro}
                      </p>
                      <ul className="text-gray-300 text-sm leading-relaxed space-y-1.5 ml-6 list-disc">
                        {policySection2Items.split('\n').filter(Boolean).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {/* Section 3 */}
                <div>
                  <h3 className="text-white text-lg font-bold mb-3">
                    3. Information Sharing and Disclosure
                  </h3>
                  {isEditingPolicy ? (
                    <>
                      <textarea
                        value={policySection3Intro}
                        onChange={(e) => setPolicySection3Intro(e.target.value)}
                        rows={3}
                        className="w-full bg-[#0D1117] border border-[#1A3155] rounded-xl px-4 py-3 text-gray-300 text-sm leading-relaxed focus:outline-none focus:border-[#3B82F6] transition-colors resize-y mb-3"
                      />
                      <textarea
                        value={policySection3Items}
                        onChange={(e) => setPolicySection3Items(e.target.value)}
                        rows={5}
                        placeholder="One item per line"
                        className="w-full bg-[#0D1117] border border-[#1A3155] rounded-xl px-4 py-3 text-gray-300 text-sm leading-relaxed focus:outline-none focus:border-[#3B82F6] transition-colors resize-y"
                      />
                      <p className="text-gray-500 text-xs mt-1.5">Enter one bullet point per line</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        {policySection3Intro}
                      </p>
                      <ul className="text-gray-300 text-sm leading-relaxed space-y-1.5 ml-6 list-disc">
                        {policySection3Items.split('\n').filter(Boolean).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {/* Section 4 */}
                <div>
                  <h3 className="text-white text-lg font-bold mb-3">
                    4. Contact Us
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    If you have any questions about this Privacy Policy, please contact us at:
                  </p>
                  {isEditingPolicy ? (
                    <div className="bg-[#0D1117] border border-[#1A3155] rounded-lg p-4 mt-3 space-y-3">
                      <div>
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Team Name</label>
                        <input
                          type="text"
                          value={policyContactName}
                          onChange={(e) => setPolicyContactName(e.target.value)}
                          className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Email</label>
                        <input
                          type="email"
                          value={policyContactEmail}
                          onChange={(e) => setPolicyContactEmail(e.target.value)}
                          className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Address</label>
                        <input
                          type="text"
                          value={policyContactAddress}
                          onChange={(e) => setPolicyContactAddress(e.target.value)}
                          className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#0D1117] border border-[#1A3155] rounded-lg p-4 mt-3">
                      <p className="text-white text-sm font-semibold">{policyContactName}</p>
                      <p className="text-gray-300 text-sm mt-1">Email: {policyContactEmail}</p>
                      <p className="text-gray-300 text-sm mt-0.5">Address: {policyContactAddress}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Admins & Security Tab */}
          {activeTab === "admins-security" && (
            <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <h2 className="text-white text-lg sm:text-xl font-bold">
                  Admin Roles & Permissions
                </h2>
                <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Admin
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {admins.map((admin) => (
                  <div
                    key={admin.email}
                    className="bg-[#0A0F18] border border-[#1A3155] rounded-xl p-3 sm:p-4 md:p-5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-semibold text-xs sm:text-sm shrink-0">
                        {admin.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{admin.name}</p>
                        <p className="text-gray-400 text-xs mt-0.5 truncate">
                          {admin.email} &bull;{" "}
                          <span className="text-cyan-400">{admin.role}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
