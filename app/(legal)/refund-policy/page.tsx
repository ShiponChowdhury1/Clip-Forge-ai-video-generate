export const metadata = {
  title: "Refund Policy | Clipforge",
};

export default function RefundPolicyPage() {
  return (
    <div className="w-full bg-black min-h-screen">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-20">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
          Refund Policy
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
              1. Credit-Based Refund Policy
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Clipforge operates on a credit-based system. Purchased credits are generally non-refundable. However, we understand that certain circumstances may warrant an exception.
            </p>
          </div>

          {/* Section 2 */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              2. Eligible Refund Scenarios
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              You may be eligible for a refund in the following cases:
            </p>
            <ul className="list-disc list-inside text-gray-400 text-sm leading-relaxed space-y-2 ml-4">
              <li>Technical issues that prevent video generation and cannot be resolved by our support team</li>
              <li>Duplicate purchases made in error</li>
              <li>Service unavailability exceeding 24 consecutive hours</li>
              <li>Subscription cancellation within the first 48 hours of purchase</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              3. Non-Refundable Situations
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Refunds will not be issued in the following cases:
            </p>
            <ul className="list-disc list-inside text-gray-400 text-sm leading-relaxed space-y-2 ml-4">
              <li>Credits that have already been used for video generation</li>
              <li>Dissatisfaction with generated content quality (we recommend trying our free tier first)</li>
              <li>Failure to use credits before expiration</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              4. Refund Process
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              To request a refund, please contact our support team within 14 days of the purchase. Refunds are typically processed within 5–10 business days and will be returned to the original payment method.
            </p>
          </div>

          {/* Section 5 */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              5. Subscription Cancellations
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              You may cancel your subscription at any time. Upon cancellation, you will retain access to your credits and features until the end of your current billing cycle. No partial refunds will be issued for the remaining days of your subscription period.
            </p>
          </div>

          {/* Section 6 */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              6. Changes to This Policy
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting on our website. Your continued use of the Service constitutes acceptance of any modifications.
            </p>
          </div>

          {/* Section 7 */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              7. Contact Us
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              If you have any questions about this Refund Policy, please contact us at:
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
              <p className="text-white text-sm font-semibold mb-2">Clipforge Support Team</p>
              <p className="text-gray-400 text-sm">Email: support@clipforge.com</p>
              <p className="text-gray-400 text-sm">Address: 123 Tech Avenue, San Francisco, CA 94105</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
