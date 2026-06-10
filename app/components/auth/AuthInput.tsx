"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";

interface AuthInputProps {
  label: string;
  type: "text" | "email" | "password";
  placeholder: string;
  rightLabel?: string;
  onRightLabelClick?: () => void;
  value?: string;
  onChange?: (value: string) => void;
  autoComplete?: string;
}

const iconMap = {
  text: User,
  email: Mail,
  password: Lock,
};

export default function AuthInput({
  label,
  type,
  placeholder,
  rightLabel,
  onRightLabelClick,
  value: controlledValue,
  onChange,
  autoComplete,
}: AuthInputProps) {
  const [internalValue, setInternalValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const handleChange = (val: string) => {
    if (onChange) onChange(val);
    else setInternalValue(val);
  };

  const Icon = iconMap[type];
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="w-full">
      {/* Label Row */}
      <div className="flex items-center justify-between mb-2">
        <label
          className="text-sm capitalize"
          style={{
            fontFamily: "Arimo, sans-serif",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "18px",
            letterSpacing: "0.2px",
            color: "#99A1AF",
          }}
        >
          {label}
        </label>
        {rightLabel && (
          <button
            type="button"
            onClick={onRightLabelClick}
            className="text-[#00A6F4] text-sm font-medium underline hover:text-[#0096d9] transition"
          >
            {rightLabel}
          </button>
        )}
      </div>

      {/* Input Field */}
      <div className="relative flex items-center w-full h-12 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#1F1F1F] rounded-xl overflow-hidden focus-within:border-[#00A6F4]/50 transition">
        <div className="pl-4 flex items-center">
          <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
        <input
          type={inputType}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete || (type === "password" ? "new-password" : "off")}
          autoCapitalize={type === "email" ? "none" : undefined}
          autoCorrect={type === "email" ? "off" : undefined}
          spellCheck={type === "email" ? false : undefined}
          pattern={type === "email" ? "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$" : undefined}
          title={type === "email" ? "Use a lowercase email address." : undefined}
          className="w-full h-full bg-transparent px-3 py-0 text-sm outline-none text-gray-900 dark:text-white/50 placeholder-gray-400 dark:placeholder-gray-500"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-4 flex items-center text-gray-500 hover:text-gray-300 transition"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
