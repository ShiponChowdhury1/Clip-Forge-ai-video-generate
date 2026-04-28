"use client";

import { useRef, useState } from "react";

interface OtpInputProps {
  length?: number;
  onChange?: (otp: string) => void;
}

export default function OtpInput({ length = 6, onChange }: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    onChange?.(newOtp.join(""));

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = [...otp];
    pasteData.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    onChange?.(newOtp.join(""));

    const nextIndex = Math.min(pasteData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="w-full">
      <label
        className="text-sm capitalize block mb-4 text-center"
        style={{
          fontFamily: "Arimo, sans-serif",
          fontWeight: 400,
          fontSize: "14px",
          lineHeight: "18px",
          letterSpacing: "0.2px",
          color: "#99A1AF",
        }}
      >
        Verification Code
      </label>
      <div className="flex justify-center gap-2 sm:gap-2.5">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-16 h-16 sm:w-16 sm:h-16 bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700/50 rounded-xl text-center text-lg font-medium outline-none focus:border-[#00A6F4]/50 transition text-gray-900 dark:text-white"
          />
        ))}
      </div>
    </div>
  );
}
