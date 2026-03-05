import { ArrowRight, Loader2 } from "lucide-react";

interface AuthButtonProps {
  text: string;
  onClick?: () => void;
  type?: "submit" | "button";
  loading?: boolean;
  disabled?: boolean;
}

export default function AuthButton({
  text,
  onClick,
  type = "submit",
  loading = false,
  disabled = false,
}: AuthButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className="w-full py-4 bg-[#00A6F4] hover:bg-[#00bfff] text-white font-bold text-base rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {text}
          <ArrowRight className="w-5 h-5" />
        </>
      )}
    </button>
  );
}
