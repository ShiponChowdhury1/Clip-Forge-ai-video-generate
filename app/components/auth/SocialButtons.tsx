import Image from "next/image";

export default function SocialButtons() {
  return (
    <div className="w-full flex flex-col items-center gap-5">
      {/* Divider */}
      <div className="w-full flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-700/50" />
        <span className="text-gray-500 text-xs font-semibold tracking-[2px] uppercase">
          Or Continue With
        </span>
        <div className="flex-1 h-px bg-gray-700/50" />
      </div>

      {/* Buttons */}
      <div className="w-full flex gap-4">
        <button
          className="w-full flex items-center justify-center gap-2 bg-[#1e2a30] hover:bg-[#253540] border border-gray-700/50 text-white font-semibold text-sm transition"
          style={{
            height: "58px",
            borderRadius: "16px",
            borderWidth: "1.11px",
          }}
        >
          <Image 
            src="/google/google.png" 
            alt="Google" 
            width={20} 
            height={20}
            className="w-5 h-5"
          />
          Google
        </button>
       
      </div>
    </div>
  );
}
