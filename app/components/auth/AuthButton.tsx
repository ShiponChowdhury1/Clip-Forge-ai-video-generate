import { ArrowRight } from "lucide-react";

interface AuthButtonProps {
  text: string;
  onClick?: () => void;
  type?: "submit" | "button";
}

export default function AuthButton({
  text,
  onClick,
  type = "submit",
}: AuthButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full py-4 bg-[#00A6F4] hover:bg-[#00bfff] text-white font-bold text-base rounded-xl transition flex items-center justify-center gap-2"
    >
      {text}
      <ArrowRight className="w-5 h-5" />
    </button>
  );
}
