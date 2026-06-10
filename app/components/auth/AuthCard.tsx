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
      maxWidth: "520px",
      minHeight: "auto",
      padding: "24px",
    },
    login: {
      maxWidth: "540px",
      minHeight: "auto",
      padding: "30px",
    },
    small: {
      maxWidth: "530px",
      minHeight: "auto",
      padding: "30px",
    },
  };

  const style = cardStyles[variant];

  return (
    <div
      className="w-full mx-auto bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1F1F1F] flex flex-col items-center gap-[10px]"
      style={{
        maxWidth: style.maxWidth,
        minHeight: style.minHeight,
        padding: style.padding,
        borderRadius: "24px",
        borderWidth: "1px",
      }}
    >
      {/* Logo Icon */}
      <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center mb-2">
        <Video className="w-6 h-6 text-white" />
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center">
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-gray-600 dark:text-gray-400 text-sm text-center mb-2">{subtitle}</p>
      )}

      {/* Form Content */}
      <div className="w-full mt-3 flex flex-col gap-4">{children}</div>
    </div>
  );
}
