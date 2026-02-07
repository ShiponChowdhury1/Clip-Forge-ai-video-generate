"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  totalSteps?: number;
  onBack: () => void;
  onContinue: () => void;
  continueLabel?: string;
  isSubmitting?: boolean;
}

export default function StepNavigation({
  currentStep,
  totalSteps = 6,
  onBack,
  onContinue,
  continueLabel,
  isSubmitting = false,
}: StepNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const label = continueLabel || (isLastStep ? "Generate Video" : "Continue");

  return (
    <div className="flex items-center justify-between mt-8">
      {!isFirstStep ? (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[#3B82F6] hover:text-[#60A5FA] font-medium text-sm transition-colors px-4 py-2.5 rounded-lg hover:bg-[#3B82F6]/5"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      ) : (
        <div />
      )}
      <button
        onClick={onContinue}
        disabled={isSubmitting}
        className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors"
      >
        {label}
        {!isLastStep && <ChevronRight className="w-4 h-4" />}
      </button>
    </div>
  );
}
