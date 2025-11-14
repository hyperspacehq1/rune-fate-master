import React from "react";
import { RotateCcw } from "lucide-react";

interface HeaderProps {
  onReset: () => void;
  setSettingsOpen: (open: boolean) => void;
  isIOS: boolean;
  logoKey: string;
  logoAnimation: boolean;
  logoFallback: string;
}

const Header: React.FC<HeaderProps> = ({
  onReset,
  setSettingsOpen,
  isIOS,
  logoKey,
  logoAnimation,
  logoFallback
}) => {
  return (
    <header
      className={`w-full flex justify-between items-center py-4 px-4 sm:px-6 border-b border-zinc-700 bg-black/40 backdrop-blur-md`}
    >
      {/* LEFT: LOGO / TITLE */}
      <div className="flex items-center space-x-3">
        {!isIOS && logoAnimation ? (
          <video
  key={logoKey}
  src="/images/logo.mp4"
  autoPlay
  loop
  muted
  playsInline
  className="h-10 w-10 rounded-lg"
></video>
        ) : (
          <img
            src={logoFallback}
            alt="Logo"
            className="h-10 w-10 rounded-lg shadow-[0_0_10px_rgba(34,197,94,0.8)]"
          />
        )}

        <h1 className="text-2xl sm:text-3xl font-bold tracking-wide text-emerald-400 drop-shadow-lg">
          Runefate
        </h1>
      </div>

      {/* RIGHT: SETTINGS + REFRESH */}
      <div className="flex justify-end items-center gap-3 pr-2 sm:pr-4">

        {/* SETTINGS BUTTON (LEFT) */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="relative p-2 rounded-lg overflow-hidden
                     bg-gradient-to-r from-green-900 via-green-800 to-green-700
                     hover:from-green-700 hover:to-green-600
                     shadow-[0_0_10px_rgba(34,197,94,0.6)]
                     hover:shadow-[0_0_20px_rgba(34,197,94,0.9)]
                     transition-all duration-300"
          title="Character Settings"
        >
          {/* GEAR ICON */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6 text-white"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11.983 1.887a1 1 0 0 0-1.966 0l-.126.758a4.04 4.04 0 0 1-1.116.08l-.7-.07a1 1 0 0 0-1.02.58l-.6 1.36a4.03 4.03 0 0 1-.96.96l-1.36.6a1 1 0 0 0-.58 1.02l.07.7c.04.38.012.76-.08 1.116l-.758.126a1 1 0 0 0 0 1.966l.758.126c.092.356.12.736.08 1.116l-.07.7a1 1 0 0 0 .58 1.02l1.36.6c.34.15.66.36.96.96l.6 1.36a1 1 0 0 0 1.02.58l.7-.07c.38-.04.76-.012 1.116.08l.126.758a1 1 0 0 0 1.966 0l.126-.758a4.04 4.04 0 0 1 1.116-.08l.7.07a1 1 0 0 0 1.02-.58l.6-1.36c.15-.34.36-.66.96-.96l1.36-.6a1 1 0 0 0 .58-1.02l-.07-.7a4.04 4.04 0 0 1 .08-1.116l.758-.126a1 1 0 0 0 0-1.966l-.758-.126a4.04 4.04 0 0 1-.08-1.116l.07-.7a1 1 0 0 0-.58-1.02l-1.36-.6a4.03 4.03 0 0 1-.96-.96l-.6-1.36a1 1 0 0 0-1.02-.58l-.7.07a4.04 4.04 0 0 1-1.116-.08l-.126-.758Z"/>
            <circle cx="10" cy="10" r="3.1" />
          </svg>

          {/* GLOW OVERLAY */}
          <span className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-transparent opacity-0 hover:opacity-100 blur-lg"></span>
        </button>

        {/* REFRESH BUTTON (RIGHT) */}
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
    </header>
  );
};

export default Header;
