export const metadata = {
  title: "Privacy Policy | Clipforge",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-black min-h-screen">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-20">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-gray-500 text-sm mb-8 sm:mb-12">
          Last updated: February 1, 2026 • Version 2.4
        </p>

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
          {/* Section 1 */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Clipforge (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) collects information that you provide directly to us when using our video generation platform. This includes:
            </p>
            <ul className="list-disc list-inside text-gray-400 text-sm leading-relaxed space-y-2 ml-4">
              <li>Account information (name, email address, password)</li>
              <li>Payment and billing information</li>
              <li>Usage data and analytics</li>
              <li>Content you create or upload to our platform</li>
              <li>Communications with our support team</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-400 text-sm leading-relaxed space-y-2 ml-4">
              <li>To provide, maintain, and improve our services</li>
              <li>To detect, prevent, and address technical issues and fraudulent activity</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              3. Information Sharing and Disclosure
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-400 text-sm leading-relaxed space-y-2 ml-4">
              <li>With your consent or at your direction</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          {/* Section 5 */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              5. Data Retention
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
          </div>

          {/* Section 6 */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              6. Your Rights and Choices
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc list-inside text-gray-400 text-sm leading-relaxed space-y-2 ml-4">
              <li>Data portability</li>
              <li>Withdrawal of consent</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              7. Contact Us
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div
              className="rounded-lg p-5"
              style={{
                backgroundColor: "rgba(24, 24, 27, 0.8)",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "#FFFFFF0D",
              }}
            >
              <p className="text-white text-sm font-semibold mb-2">Clipforge Privacy Team</p>
              <p className="text-gray-400 text-sm">Email: privacy@clipforge.com</p>
              <p className="text-gray-400 text-sm">Address: 123 Tech Avenue, San Francisco, CA 94105</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
