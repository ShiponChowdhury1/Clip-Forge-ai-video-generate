"use client";

export default function ProcessingPayment() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-12 text-center max-w-md w-full">
        {/* Spinning Loader */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">
          Processing Payment
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Please wait while we securely process your transaction...
        </p>

        {/* Dot animation */}
        <div className="flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-pulse" />
          <span
            className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          />
          <span
            className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
      </div>
    </div>
  );
}
