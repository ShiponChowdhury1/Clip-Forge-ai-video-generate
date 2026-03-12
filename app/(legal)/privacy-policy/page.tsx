"use client";

import { useGetPrivacyPolicyQuery } from "@/lib/redux/features/admin/adminApi";

export default function PrivacyPolicyPage() {
  const { data: policy, isLoading } = useGetPrivacyPolicyQuery();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full bg-white dark:bg-black min-h-screen">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-20">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
          Privacy Policy
        </h1>
        {policy?.updated_at && (
          <p className="text-gray-500 text-sm mb-8 sm:mb-12">
            Last updated: {formatDate(policy.updated_at)}
          </p>
        )}

        {/* Content Card */}
        <div
          className="w-full"
          style={{
            maxWidth: "1320px",
            paddingTop: "33.11px",
            paddingRight: "33.11px",
            paddingBottom: "1.11px",
            paddingLeft: "33.11px",
            borderRadius: "16px",
            borderWidth: "1.11px",
            borderStyle: "solid",
            borderColor: "#FFFFFF0D",
            backgroundColor: "rgba(24, 24, 27, 0.5)",
          }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#1A3155] border-t-cyan-500 rounded-full animate-spin" />
            </div>
          ) : policy?.content ? (
            <div
              className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed
                [&_h1]:text-gray-900 dark:[&_h1]:text-white [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-6
                [&_h2]:text-gray-900 dark:[&_h2]:text-white [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6
                [&_h3]:text-gray-900 dark:[&_h3]:text-white [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4
                [&_p]:mb-4
                [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-1 [&_ul]:mb-4
                [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:space-y-1 [&_ol]:mb-4
                [&_li]:text-gray-600 dark:[&_li]:text-gray-400
                [&_a]:text-cyan-400 [&_a]:underline [&_a]:hover:text-cyan-300
                [&_blockquote]:border-l-4 [&_blockquote]:border-cyan-500/50 [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:my-3 [&_blockquote]:text-gray-500 [&_blockquote]:italic
                [&_strong]:text-gray-900 dark:[&_strong]:text-white [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{ __html: policy.content }}
            />
          ) : (
            <p className="text-gray-500 text-sm py-10 text-center">
              No privacy policy content available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
