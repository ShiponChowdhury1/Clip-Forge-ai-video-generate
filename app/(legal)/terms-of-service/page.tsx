export const metadata = {
  title: "Terms of Service | Clipforge",
};

export default function TermsOfServicePage() {
  return (
    <div className="w-full bg-black min-h-screen">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-20">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
          Terms of Service
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
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              By accessing or using Clipforge (&quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </div>

          {/* Section 2 */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              2. Use of Service
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-400 text-sm leading-relaxed space-y-2 ml-4">
              <li>Use the Service in any way that violates applicable laws or regulations</li>
              <li>Generate content that is harmful, offensive, or infringes on intellectual property rights</li>
              <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              3. Account Registration
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              To access certain features of the Service, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </div>

          {/* Section 4 */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              4. Credit System and Payments
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Our Service operates on a credit-based system. Credits are non-transferable and non-refundable except as outlined in our Refund Policy. Prices are subject to change with reasonable notice.
            </p>
          </div>

          {/* Section 5 */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              5. Intellectual Property
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Content generated through our platform belongs to you, subject to our licensing terms. The Service itself, including its original content, features, and functionality, is owned by Clipforge and is protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </div>

          {/* Section 6 */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              In no event shall Clipforge be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or other intangible losses resulting from your use of the Service.
            </p>
          </div>

          {/* Section 7 */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              7. Contact Us
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us at:
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
              <p className="text-white text-sm font-semibold mb-2">Clipforge Legal Team</p>
              <p className="text-gray-400 text-sm">Email: legal@clipforge.com</p>
              <p className="text-gray-400 text-sm">Address: 123 Tech Avenue, San Francisco, CA 94105</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
