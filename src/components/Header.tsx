import { RotateCcw } from "lucide-react";

interface HeaderProps {
  onReset: () => void;
  isIOS: boolean;
  logoKey: number;
  logoAnimation: string;
  logoFallback: string;
}

export function Header({
  onReset,
  isIOS,
  logoKey,
  logoAnimation,
  logoFallback,
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between relative mb-4">
      {/* LOGO */}
      <div
        className={`absolute -left-10 -top-5 sm:-top-10 sm:-left-30 md:-left-20 
                    w-[180px] sm:w-[432px] md:w-[302px] lg:w-[432px] 
                    pointer-events-auto z-10 transition-transform duration-300
                    ${isIOS ? "scale-[0.7]" : "scale-[1]"}`}
      >
        {isIOS ? (
          // 📱 Static iPhone logo (smaller + fade-in)
          <img
            src={logoFallback}
            alt="logo"
            className="rounded-md object-contain mx-auto opacity-0 animate-fadeInIos"
          />
        ) : (
          // 🌀 Animated logo (desktop/tablet)
          <video
            key={logoKey}
            src={logoAnimation}
            width="300"
            height="300"
            autoPlay
            muted
            playsInline
            onEnded={(e) => (e.target as HTMLVideoElement).pause()}
            className="rounded-md object-contain"
          />
        )}
      </div>

      {/* REFRESH BUTTON */}
      <div className="flex justify-end w-full pr-6">
        <button
          onClick={onReset}
          className="relative p-2 rounded-lg overflow-hidden
                     bg-gradient-to-r from-green-800 via-green-700 to-green-600
                     hover:from-green-600 hover:to-green-500
                     shadow-[0_0_10px_rgba(34,197,94,0.6)]
                     hover:shadow-[0_0_20px_rgba(34,197,94,0.9)]
                     transition-all duration-300"
          title="Reset to default settings"
        >
          <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          <span className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-transparent opacity-0 hover:opacity-100 blur-lg"></span>
        </button>
      </div>
    </div>
  );
}
