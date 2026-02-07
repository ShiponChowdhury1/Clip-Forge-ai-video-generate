"use client";

interface StepProgressProps {
  currentStep: number;
  totalSteps?: number;
}

export default function StepProgress({
  currentStep,
  totalSteps = 6,
}: StepProgressProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
            i < currentStep
              ? "bg-[#3B82F6]"
              : "bg-[#1A2332]"
          }`}
        />
      ))}
    </div>
  );
}
