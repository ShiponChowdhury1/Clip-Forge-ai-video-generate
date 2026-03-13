"use client";

import { useGetAdminPoliciesQuery } from "@/lib/redux/features/admin/adminApi";

export default function TermsOfServicePage() {
  const { data: policies = [], isLoading } = useGetAdminPoliciesQuery();
  const policy = policies[0];

  return (
    <div className="w-full bg-white dark:bg-black min-h-screen">
      <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
          Terms of Service
        </h1>
        {policy?.updated_at && (
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
            Effective Date: {new Date(policy.updated_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        )}
        <p className="max-w-4xl text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed mb-8 sm:mb-12">
          Welcome to ClipForge. These Terms of Service (&quot;Terms&quot;) govern your access to and use of the ClipForge website and AI-powered video generation platform (the &quot;Service&quot;). By accessing or using ClipForge, you agree to these Terms. If you do not agree, you may not use the Service.
        </p>

        <div className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/3 p-6 sm:p-8 md:p-10">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-gray-300 dark:border-[#1A3155] border-t-cyan-500 rounded-full animate-spin" />
            </div>
          ) : policy?.terms_of_service ? (
            <div
              className="text-gray-600 dark:text-gray-400 text-sm sm:text-[15px] leading-7
                [&_h1]:text-gray-900 dark:[&_h1]:text-white [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-6
                [&_h2]:text-gray-900 dark:[&_h2]:text-white [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6
                [&_h3]:text-gray-900 dark:[&_h3]:text-white [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4
                [&_p]:mb-4
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-4
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:mb-4
                [&_li]:text-gray-600 dark:[&_li]:text-gray-400
                [&_a]:text-cyan-400 [&_a]:underline [&_a]:hover:text-cyan-300
                [&_blockquote]:border-l-4 [&_blockquote]:border-cyan-500/50 [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:my-3 [&_blockquote]:text-gray-500 [&_blockquote]:italic
                [&_strong]:text-gray-900 dark:[&_strong]:text-white [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{ __html: policy.terms_of_service }}
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm py-10 text-center">
              No terms of service content available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
