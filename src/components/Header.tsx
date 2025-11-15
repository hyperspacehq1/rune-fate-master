import React from "react";
import { RotateCcw } from "lucide-react";

interface HeaderProps {
  onReset: () => void;
  setSettingsOpen: (open: boolean) => void;
  isIOS: boolean;
  logoKey: string;
  logoAnimation: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onReset,
  setSettingsOpen,
  isIOS,
  logoKey,
  logoAnimation
}) => {
  return (
    <header className="w-full flex justify-between items-center py-4 px-4 border-b border-zinc-700 bg-black/40 backdrop-blur-md">

      {/* LEFT — LOGO + TITLE */}
      <div className="flex items-center space-x-3">
        {!isIOS && logoAnimation ? (
          <video
            key={logoKey}
            src="/images/logo-animation.webm"
            autoPlay
            loop
            muted
            playsInline
            className="h-12 w-12 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.8)]"
          />
        ) : (
          <img
            src="/images/logo-transparent.png"
            alt="Rune Fate Logo"
            className="h-12 w-12 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.8)]"
          />
        )}

        <h1 className="text-3xl font-bold tracking-wide text-emerald-400 drop-shadow-lg">
          RuneFate
        </h1>
      </div>

      {/* RIGHT — SETTINGS + REFRESH */}
      <div className="flex items-center gap-4">

        {/* SETTINGS BUTTON */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="p-2 rounded-lg bg-green-800 hover:bg-green-600 shadow-[0_0_10px_rgba(34,197,94,0.6)] hover:shadow-[0_0_20px_rgba(34,197,94,0.9)] transition-all"
        >
          {/* gear icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12a7.5 7.5 0 01-.307 2.143l2.148 1.24-1.5 2.598-2.148-1.24a7.501 7.501 0 01-3.722 2.15v2.48h-3v-2.48a7.501 7.501 0 01-3.723-2.15l-2.147 1.24-1.5-2.598 2.148-1.24A7.5 7.5 0 014.5 12a7.5 7.5 0 01.307-2.143L2.66 8.617l1.5-2.598 2.147 1.24a7.5 7.5 0 013.723-2.15V2.63h3v2.48a7.5 7.5 0 013.722 2.15l2.148-1.24 1.5 2.598-2.148 1.24A7.5 7.5 0 0119.5 12z"
            />
          </svg>
        </button>

        {/* REFRESH BUTTON */}
        <button
          onClick={onReset}
          className="p-2 rounded-lg bg-green-700 hover:bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] hover:shadow-[0_0_20px_rgba(34,197,94,0.9)] transition-all"
        >
          <RotateCcw className="h-6 w-6 text-white" />
        </button>

      </div>
    </header>
  );
};

export default Header;
