"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleButtonProps {
  /** Optional extra classes for the outer button */
  className?: string;
  /** Icon size (lucide size prop). Default 18 */
  size?: number;
  /** Show a text label next to the icon ("Light Mode" / "Dark Mode"). Default false */
  showLabel?: boolean;
}

/**
 * Reusable dark / light mode toggle button.
 * Shared across: Landing page Navbar, Admin dashboard topbar, User dashboard topbar.
 */
export default function ThemeToggleButton({
  className,
  size = 18,
  showLabel = false,
}: ThemeToggleButtonProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={
        className ??
        "w-11 h-11 rounded-2xl bg-gray-50 dark:bg-white/[0.06] border border-gray-200 dark:border-[#1F1F1F] flex items-center justify-center text-gray-600 dark:text-[#9090c0] hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all"
      }
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {theme === "dark" ? (
        <Sun size={size} />
      ) : (
        <Moon size={size} />
      )}
      {showLabel && (
        <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
      )}
    </button>
  );
}
