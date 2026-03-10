"use client";

import { useState } from "react";
import { Save, Pencil, ArrowLeft, Download, X } from "lucide-react";

export function LegalPolicy() {
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
                className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditingPolicy(true)}
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
  );
}
