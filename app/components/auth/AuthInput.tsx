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
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState("");
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const setValue = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const Icon = iconMap[type];
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="w-full">
      {/* Label Row */}
      <div className="flex items-center justify-between mb-2">
        <label
          className="font-bold text-sm tracking-[1.4px] capitalize"
          style={{
            fontFamily: "Arimo, sans-serif",
            fontWeight: 700,
            fontSize: "18px",
            lineHeight: "20px",
            letterSpacing: "1.4px",
            color: "#99A1AF",
          }}
        >
          {label}
        </label>
        {rightLabel && (
          <button
            onClick={onRightLabelClick}
            className="text-[#00A6F4] text-sm font-semibold underline hover:text-[#0096d9] transition"
          >
            {rightLabel}
          </button>
        )}
      </div>

      {/* Input Field */}
      <div className="relative flex items-center w-full bg-[#0d1117] border border-gray-700/50 rounded-xl overflow-hidden focus-within:border-[#00A6F4]/50 transition">
        <div className="pl-4 flex items-center">
          <Icon className="w-5 h-5 text-gray-500" />
        </div>
        <input
          type={inputType}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full bg-transparent px-3 py-4 text-sm outline-none [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_9999px_#0d1117_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:rgba(255,255,255,0.5)]"
          style={{ color: "#FFFFFF80", backgroundColor: "transparent" }}
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
