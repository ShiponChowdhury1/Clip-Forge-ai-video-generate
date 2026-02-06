import { Video } from "lucide-react";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  variant?: "register" | "login" | "small";
}

export default function AuthCard({
  children,
  title,
  subtitle,
  variant = "login",
}: AuthCardProps) {
  const cardStyles = {
    register: {
      maxWidth: "548px",
      minHeight: "auto",
      padding: "34px",
    },
    login: {
      maxWidth: "564px",
      minHeight: "auto",
      padding: "42px",
    },
    small: {
      maxWidth: "530px",
      minHeight: "auto",
      padding: "42px",
    },
  };

  const style = cardStyles[variant];

  return (
    <div
      className="w-full mx-auto bg-[#161D21] border border-gray-700/50 flex flex-col items-center gap-[10px]"
      style={{
        maxWidth: style.maxWidth,
        minHeight: style.minHeight,
        padding: style.padding,
        borderRadius: "32px",
        borderWidth: "1px",
      }}
    >
      {/* Logo Icon */}
      <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center mb-2">
        <Video className="w-7 h-7 text-white" />
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-gray-400 text-sm text-center mb-2">{subtitle}</p>
      )}

      {/* Form Content */}
      <div className="w-full mt-4 flex flex-col gap-5">{children}</div>
    </div>
  );
}
