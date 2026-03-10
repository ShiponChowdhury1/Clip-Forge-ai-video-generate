"use client";

import { useState } from "react";
import { Save, Plus, Pencil, ChevronDown, X, Trash2 } from "lucide-react";
import { Toggle } from "./Toggle";
import {
  useGetSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useToggleSubscriptionStatusMutation,
  type SubscriptionPlan,
} from "@/lib/redux/features/admin/adminApi";

const defaultPlanForm = {
  name: "",
  monthly_price: "",
  monthly_credits: "",
  video_limit_per_month: "",
  priority_level: "",
  commercial_usage_allowed: false,
  max_video_duration: "",
  max_concurrent_jobs: "",
  max_queued_jobs: "",
  max_retry_attempts: "",
  plan_status: "active",
};

export function SubscriptionPlans() {
  const { data: subscriptions, isLoading: subsLoading, refetch: refetchSubs } = useGetSubscriptionsQuery();
  const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation();
  const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation();
  const [deleteSubscription] = useDeleteSubscriptionMutation();
  const [toggleSubscriptionStatus] = useToggleSubscriptionStatusMutation();
  const isSaving = isCreating || isUpdating;

  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [planForm, setPlanForm] = useState(defaultPlanForm);
  const [planError, setPlanError] = useState("");

  const openAddModal = () => {
    setEditingPlanId(null);
    setPlanForm(defaultPlanForm);
    setPlanError("");
    setShowPlanModal(true);
  };

  const openEditModal = (plan: SubscriptionPlan) => {
    setEditingPlanId(plan.id);
    setPlanForm({
      name: plan.name,
      monthly_price: String(plan.monthly_price),
      monthly_credits: String(plan.monthly_credits),
      video_limit_per_month: String(plan.video_limit_per_month),
      priority_level: String(plan.priority_level),
      commercial_usage_allowed: plan.commercial_usage_allowed,
      max_video_duration: String(plan.max_video_duration),
      max_concurrent_jobs: String(plan.max_concurrent_jobs),
      max_queued_jobs: String(plan.max_queued_jobs),
      max_retry_attempts: String(plan.max_retry_attempts),
      plan_status: plan.plan_status,
    });
    setPlanError("");
    setShowPlanModal(true);
  };

  const closeModal = () => {
    setShowPlanModal(false);
    setEditingPlanId(null);
    setPlanError("");
    setPlanForm(defaultPlanForm);
  };

  const handleCreatePlan = async () => {
    if (!planForm.name.trim()) { setPlanError("Plan name is required."); return; }
    setPlanError("");
    const payload = {
      name: planForm.name,
      monthly_price: Number(planForm.monthly_price) || 0,
      monthly_credits: Number(planForm.monthly_credits) || 0,
      video_limit_per_month: Number(planForm.video_limit_per_month) || 0,
      priority_level: Number(planForm.priority_level) || 1,
      commercial_usage_allowed: planForm.commercial_usage_allowed,
      max_video_duration: Number(planForm.max_video_duration) || 0,
      max_concurrent_jobs: Number(planForm.max_concurrent_jobs) || 1,
      max_queued_jobs: Number(planForm.max_queued_jobs) || 0,
      max_retry_attempts: Number(planForm.max_retry_attempts) || 0,
      plan_status: planForm.plan_status,
    };
    try {
      if (editingPlanId !== null) {
        await updateSubscription({ id: editingPlanId, ...payload }).unwrap();
      } else {
        await createSubscription(payload).unwrap();
      }
      refetchSubs();
      closeModal();
    } catch (err: unknown) {
      const msg = (err as { data?: { detail?: string } })?.data?.detail;
      setPlanError(msg || (editingPlanId !== null ? "Failed to update plan. Please try again." : "Failed to create plan. Please try again."));
    }
  };

  const handleDeletePlan = async (id: number) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      await deleteSubscription(id).unwrap();
      refetchSubs();
    } catch {
      alert("Failed to delete plan.");
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await toggleSubscriptionStatus(id).unwrap();
      refetchSubs();
    } catch {
      alert("Failed to toggle plan status.");
    }
  };

  return (
    <>
      {/* Add/Edit Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1A3155]">
              <h2 className="text-white text-lg font-bold">{editingPlanId !== null ? "Edit Plan" : "Add New Plan"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              {planError && (
                <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">{planError}</p>
              )}

              {/* Name */}
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Plan Name *</label>
                <input type="text" value={planForm.name} onChange={(e) => setPlanForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Pro" className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors" />
              </div>

              {/* Price & Credits */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Monthly Price ($)</label>
                  <input type="number" min="0" value={planForm.monthly_price} onChange={(e) => setPlanForm((f) => ({ ...f, monthly_price: e.target.value }))} placeholder="0" className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Monthly Credits</label>
                  <input type="number" min="0" value={planForm.monthly_credits} onChange={(e) => setPlanForm((f) => ({ ...f, monthly_credits: e.target.value }))} placeholder="0" className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors" />
                </div>
              </div>

              {/* Video Limit & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Videos / Month</label>
                  <input type="number" min="0" value={planForm.video_limit_per_month} onChange={(e) => setPlanForm((f) => ({ ...f, video_limit_per_month: e.target.value }))} placeholder="0" className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Priority Level</label>
                  <input type="number" min="1" value={planForm.priority_level} onChange={(e) => setPlanForm((f) => ({ ...f, priority_level: e.target.value }))} placeholder="1" className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors" />
                </div>
              </div>

              {/* Max Video Duration & Concurrent Jobs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Max Video Duration (s)</label>
                  <input type="number" min="0" value={planForm.max_video_duration} onChange={(e) => setPlanForm((f) => ({ ...f, max_video_duration: e.target.value }))} placeholder="0" className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Max Concurrent Jobs</label>
                  <input type="number" min="1" value={planForm.max_concurrent_jobs} onChange={(e) => setPlanForm((f) => ({ ...f, max_concurrent_jobs: e.target.value }))} placeholder="1" className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors" />
                </div>
              </div>

              {/* Queued Jobs & Retry Attempts */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Max Queued Jobs</label>
                  <input type="number" min="0" value={planForm.max_queued_jobs} onChange={(e) => setPlanForm((f) => ({ ...f, max_queued_jobs: e.target.value }))} placeholder="0" className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Max Retry Attempts</label>
                  <input type="number" min="0" value={planForm.max_retry_attempts} onChange={(e) => setPlanForm((f) => ({ ...f, max_retry_attempts: e.target.value }))} placeholder="0" className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors" />
                </div>
              </div>

              {/* Plan Status & Commercial Usage */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Plan Status</label>
                  <div className="relative">
                    <select value={planForm.plan_status} onChange={(e) => setPlanForm((f) => ({ ...f, plan_status: e.target.value }))} className="w-full bg-[#0A0F18] border border-[#1A3155] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Commercial Usage</label>
                  <div className="flex items-center gap-3 mt-1">
                    <Toggle enabled={planForm.commercial_usage_allowed} onChange={(val) => setPlanForm((f) => ({ ...f, commercial_usage_allowed: val }))} />
                    <span className="text-sm text-gray-400">{planForm.commercial_usage_allowed ? "Allowed" : "Not Allowed"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1A3155]">
              <button onClick={closeModal} className="px-5 py-2.5 rounded-lg bg-[#0A0F18] border border-[#1A3155] text-sm text-gray-300 hover:border-[#3B82F6] transition-colors">
                Cancel
              </button>
              <button onClick={handleCreatePlan} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editingPlanId !== null ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isSaving ? (editingPlanId !== null ? "Saving..." : "Creating...") : editingPlanId !== null ? "Save Changes" : "Create Plan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plans List */}
      <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <h2 className="text-white text-lg sm:text-xl font-bold">Subscription Plans</h2>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm transition-colors">
            <Plus className="w-4 h-4" />
            Add New Plan
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {!subscriptions?.length && !subsLoading ? (
            <p className="text-gray-500 text-sm text-center py-8">No plans found.</p>
          ) : (
            (subscriptions ?? []).map((plan) => (
              <div
                key={plan.id}
                className="bg-[#0A0F18] border border-[#1A3155] rounded-xl p-3 sm:p-4 md:p-5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#1A3155] flex items-center justify-center text-white font-semibold text-xs sm:text-sm shrink-0">
                    {plan.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{plan.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5 truncate">
                      ${plan.monthly_price}/mo &bull; {plan.monthly_credits.toLocaleString()} credits &bull; {plan.video_limit_per_month} videos/mo
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(plan.id)}
                    className={`text-xs font-medium px-3 py-1 rounded-full cursor-pointer transition-colors ${
                      plan.plan_status === "active"
                        ? "text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20"
                        : "text-gray-400 bg-gray-400/10 hover:bg-gray-400/20"
                    }`}
                    title="Toggle status"
                  >
                    {plan.plan_status.charAt(0).toUpperCase() + plan.plan_status.slice(1)}
                  </button>
                  <button
                    onClick={() => openEditModal(plan)}
                    className="text-gray-400 hover:text-cyan-400 transition-colors p-1 rounded-lg hover:bg-[#1A2332]"
                    title="Edit plan"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-400/10"
                    title="Delete plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
