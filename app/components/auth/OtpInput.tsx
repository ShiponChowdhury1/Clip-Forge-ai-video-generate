"use client";

import { useRef, useState } from "react";

interface OtpInputProps {
  length?: number;
  onChange?: (otp: string) => void;
}

export default function OtpInput({ length = 6, onChange }: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const updateOtp = (newOtp: string[]) => {
    setOtp(newOtp);
    if (onChange) {
      onChange(newOtp.join(""));
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    updateOtp(newOtp);

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
    updateOtp(newOtp);

    const nextIndex = Math.min(pasteData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="w-full">
      <label
        className="text-white font-bold text-sm tracking-[1.4px] capitalize block mb-3"
        style={{
          fontFamily: "Arimo, sans-serif",
          fontWeight: 700,
          fontSize: "18px",
          lineHeight: "20px",
          letterSpacing: "1.4px",
        }}
      >
        Verification Code
      </label>
      <div className="flex gap-2 sm:gap-3 justify-between">
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
            className="w-12 h-14 sm:w-14 sm:h-16 bg-[#0d1117] border border-gray-700/50 rounded-xl text-white text-center text-lg font-semibold outline-none focus:border-[#00A6F4]/50 transition"
          />
        ))}
      </div>
    </div>
  );
}
