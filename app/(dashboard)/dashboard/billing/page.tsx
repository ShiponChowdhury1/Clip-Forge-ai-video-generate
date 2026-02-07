import { CreditCard, Check } from "lucide-react";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";

const plans = [
  {
    name: "Starter",
    price: "$0",
    credits: "50 Credits",
    features: ["1080p Export", "Standard Voices", "Basic Support", "No Watermark"],
    current: false,
  },
  {
    name: "Growth",
    price: "$10",
    credits: "3000 Credits",
    features: ["4K Export", "Premium AI Voices", "Priority Support", "Unlimited Assets"],
    current: true,
    badge: "CURRENT PLAN",
  },
  {
    name: "Pro",
    price: "$25",
    credits: "6000 Credits",
    features: ["API Access", "Custom Branding", "Dedicated Manager", "Bulk Generation"],
    current: false,
  },
];

export default function BillingPage() {
  return (
    <div>
      {/* Header - Reusable */}
      <DashboardHeader
        icon={
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
        }
        title="Billing"
        description="Manage your subscription and credits"
        showCreateButton={false}
      />

      {/* Credit Balance */}
      <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Available Credits</p>
            <p className="text-4xl font-bold text-white">2,450</p>
          </div>
          <button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm">
            Buy More Credits
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-[#0D1117] border rounded-2xl p-6 ${
              plan.current ? "border-[#2563EB]" : "border-[#1A3155]"
            }`}
          >
            {plan.badge && (
              <span className="inline-block bg-[#2563EB] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                {plan.badge}
              </span>
            )}
            <h3 className="text-white text-lg font-bold mb-1">{plan.name}</h3>
            <p className="text-3xl font-bold text-white mb-1">{plan.price}</p>
            <p className="text-gray-400 text-sm mb-6">{plan.credits}</p>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-[#009927]" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
                plan.current
                  ? "bg-[#1A3155] text-gray-400 cursor-default"
                  : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
              }`}
            >
              {plan.current ? "Current Plan" : "Upgrade"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
