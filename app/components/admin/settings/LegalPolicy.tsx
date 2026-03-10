"use client";

import { useState } from "react";
import { Save, Pencil, Download, X } from "lucide-react";
import { toast } from "react-toastify";
import { RichTextEditor } from "./RichTextEditor";
import {
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
} from "@/lib/redux/features/admin/adminApi";

export function LegalPolicy() {
  const { data: policy, isLoading, refetch } = useGetPrivacyPolicyQuery();
  const [updatePolicy, { isLoading: isSaving }] = useUpdatePrivacyPolicyMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState<string | null>(null);
  const content = editContent ?? policy?.content ?? "";

  const handleSave = async () => {
    try {
      await updatePolicy({ content }).unwrap();
      refetch();
      setEditContent(null);
      setIsEditing(false);
      toast.success("Privacy policy updated successfully!");
    } catch {
      toast.error("Failed to update privacy policy. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditContent(null);
    setIsEditing(false);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
        <div>
          <h2 className="text-white text-xl sm:text-2xl font-bold">Privacy Policy</h2>
          {policy?.updated_at && (
            <p className="text-gray-400 text-sm mt-1">
              Last updated: {formatDate(policy.updated_at)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-[#0A0F18] border border-[#1A3155] hover:border-red-500 text-gray-300 font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
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
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
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
      {isEditing && (
        <div className="mt-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
          <Pencil className="w-4 h-4 text-cyan-400" />
          <p className="text-cyan-400 text-sm">You are now in edit mode. Use the toolbar to format content and click Save Changes.</p>
        </div>
      )}

      {/* Content */}
      <div className="mt-6">
        {isLoading ? (
          <div className="bg-[#0A0F18] border border-[#1A3155] rounded-xl p-8 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#1A3155] border-t-cyan-500 rounded-full animate-spin" />
          </div>
        ) : isEditing ? (
          <RichTextEditor value={content} onChange={setEditContent} />
        ) : (
          <div
            className="bg-[#0A0F18] border border-[#1A3155] rounded-xl p-6 sm:p-8 text-gray-300 text-sm leading-relaxed
              [&_h1]:text-white [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-4
              [&_h2]:text-white [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-3
              [&_a]:text-cyan-400 [&_a]:underline [&_a]:hover:text-cyan-300
              [&_blockquote]:border-l-4 [&_blockquote]:border-cyan-500/50 [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:my-3 [&_blockquote]:text-gray-400 [&_blockquote]:italic
              [&_pre]:bg-[#0D1117] [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:my-3 [&_pre]:text-emerald-400 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:overflow-x-auto
              [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-3
              [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-1 [&_ul]:my-2
              [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:space-y-1 [&_ol]:my-2
              [&_li]:text-gray-300
              [&_p]:my-1.5"
            dangerouslySetInnerHTML={{ __html: content || "<p>No privacy policy content yet. Click Edit to add content.</p>" }}
          />
        )}
      </div>
    </div>
  );
}
