"use client";

import { useState } from "react";
import { Save, Pencil, X } from "lucide-react";
import { toast } from "react-toastify";
import { RichTextEditor } from "./RichTextEditor";
import {
  useCreateAdminPoliciesMutation,
  useGetAdminPoliciesQuery,
  useUpdateAdminPoliciesMutation,
} from "@/lib/redux/features/admin/adminApi";
import { sanitizeLegalHtml } from "@/app/helpers/sanitizeLegalHtml";

const policyTabs = [
  { key: "privacy_policy", label: "Privacy Policy" },
  { key: "terms_of_service", label: "Terms of Service" },
  { key: "refund_policy", label: "Refund Policy" },
] as const;

type PolicyKey = (typeof policyTabs)[number]["key"];

export function LegalPolicy() {
  const { data: policies = [], isLoading, refetch } = useGetAdminPoliciesQuery();
  const [createPolicies, { isLoading: isCreating }] = useCreateAdminPoliciesMutation();
  const [updatePolicies, { isLoading: isUpdating }] = useUpdateAdminPoliciesMutation();

  const [activeTab, setActiveTab] = useState<PolicyKey>("privacy_policy");
  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState("");

  const currentPolicy = policies[0] ?? null;
  const isSaving = isCreating || isUpdating;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPolicyValue = (key: PolicyKey) => {
    if (!currentPolicy) return "";
    return currentPolicy[key] ?? "";
  };

  const displayedContent = isEditing ? draftContent : getPolicyValue(activeTab);

  const handleTabChange = (nextTab: PolicyKey) => {
    setActiveTab(nextTab);
    setIsEditing(false);
    setDraftContent("");
  };

  const handleEdit = () => {
    setDraftContent(getPolicyValue(activeTab));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDraftContent("");
  };

  const buildPayload = (nextValue: string) => ({
    privacy_policy: activeTab === "privacy_policy" ? nextValue : getPolicyValue("privacy_policy"),
    terms_of_service: activeTab === "terms_of_service" ? nextValue : getPolicyValue("terms_of_service"),
    refund_policy: activeTab === "refund_policy" ? nextValue : getPolicyValue("refund_policy"),
  });

  const handleSave = async () => {
    try {
      const payload = buildPayload(draftContent);

      if (!currentPolicy) {
        await createPolicies(payload).unwrap();
      } else {
        await updatePolicies({ id: currentPolicy.id, body: payload }).unwrap();
      }

      await refetch();
      setIsEditing(false);
      setDraftContent("");
      toast.success(`${policyTabs.find((tab) => tab.key === activeTab)?.label} updated successfully!`);
    } catch {
      toast.error("Failed to update policy. Please try again.");
    }
  };

  const activeLabel = policyTabs.find((tab) => tab.key === activeTab)?.label ?? "Policy";

  return (
    <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
        <div>
          <h2 className="text-gray-900 dark:text-white text-xl sm:text-2xl font-bold">Legal & Policy Manager</h2>
          {currentPolicy?.updated_at && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Last updated: {formatDate(currentPolicy.updated_at)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-100 dark:bg-[#0A0F18] border border-gray-300 dark:border-[#1A3155] hover:border-red-500 text-gray-700 dark:text-gray-300 font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60"
              >
                {isSaving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit {activeLabel}
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {policyTabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#3B82F6] text-white"
                  : "bg-gray-100 dark:bg-[#0A0F18] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1A2332]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {isEditing && (
        <div className="mt-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
          <Pencil className="w-4 h-4 text-cyan-400" />
          <p className="text-cyan-400 text-sm">Editing {activeLabel}. Use rich text tools and click Save Changes.</p>
        </div>
      )}

      <div className="mt-6">
        {isLoading ? (
          <div className="bg-gray-50 dark:bg-[#0A0F18] border border-gray-200 dark:border-[#1A3155] rounded-xl p-8 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 dark:border-[#1A3155] border-t-cyan-500 rounded-full animate-spin" />
          </div>
        ) : isEditing ? (
          <RichTextEditor
            key={`policy-editor-${activeTab}-${currentPolicy?.updated_at ?? "new"}`}
            value={displayedContent}
            onChange={setDraftContent}
          />
        ) : (
          <div
            className="legal-rich-content bg-gray-50 dark:bg-[#0A0F18] rounded-xl p-6 sm:p-8 text-gray-700 dark:text-gray-300 text-sm leading-relaxed
              [&_h1]:text-gray-900 dark:[&_h1]:text-white [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-4
              [&_h2]:text-gray-900 dark:[&_h2]:text-white [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-3
              [&_a]:text-cyan-400 [&_a]:underline [&_a]:hover:text-cyan-300
              [&_blockquote]:border-l-4 [&_blockquote]:border-cyan-500/50 [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:my-3 [&_blockquote]:text-gray-500 dark:[&_blockquote]:text-gray-400 [&_blockquote]:italic
              [&_pre]:bg-gray-100 dark:[&_pre]:bg-[#0D1117] [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:my-3 [&_pre]:text-emerald-400 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:overflow-x-auto
              [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-3
              [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-1 [&_ul]:my-2
              [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:space-y-1 [&_ol]:my-2
              [&_li]:text-gray-700 dark:[&_li]:text-gray-300
              [&_p]:my-1.5"
            dangerouslySetInnerHTML={{ __html: sanitizeLegalHtml(displayedContent || `<p>No ${activeLabel.toLowerCase()} content yet. Click Edit to add content.</p>`) }}
          />
        )}
      </div>
    </div>
  );
}
