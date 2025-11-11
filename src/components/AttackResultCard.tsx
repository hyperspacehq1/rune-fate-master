import type { DiceRoll } from "../types";

interface AttackResultCardProps {
  label: string;
  icon: string;
  crit: boolean;
  success: boolean;
  hitRoll: number;
  hitTotal: number;
  total: number;
  diceBreakdown?: DiceRoll[];
  hasDreadfulStrike?: boolean;
}

export function AttackResultCard({
  label,
  icon,
  crit,
  success,
  hitRoll,
  hitTotal,
  total,
  diceBreakdown,
  hasDreadfulStrike,
}: AttackResultCardProps) {
  // ✅ Conditional border / glow logic
  let borderGlow = "border-neutral-700/50"; // default fallback

  if (crit) {
    borderGlow =
      "border-yellow-400 shadow-[0_0_14px_3px_rgba(250,204,21,0.55)]";
  } else if (success) {
    borderGlow =
      "border-green-600/70 shadow-[0_0_12px_2px_rgba(34,197,94,0.4)]";
  } else {
    borderGlow =
      "border-red-600/50 shadow-[0_0_12px_2px_rgba(239,68,68,0.25)]";
  }

  // ✅ Determine whether to show proficiency bonus
  const showProficiency =
    !label.toLowerCase().includes("shortsword"); // hide when Shortsword

  return (
    <div
      className={`bg-neutral-900/90 p-3 rounded-xl border animate-fadeIn hover:scale-[1.02] transition-transform duration-200 h-[295px] flex flex-col ${borderGlow}`}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-white text-sm flex items-center gap-1 flex-1">
          <span className="text-base">{icon}</span>
          <span className="truncate">{label}</span>
          {hasDreadfulStrike && (
            <span className="text-orange-400 flex items-center gap-0.5">
              <span className="text-sm">⚡</span>
            </span>
          )}
        </h3>
      </div>

      {/* STATS */}
      <div className="space-y-2 text-sm mb-2">
        <div className="flex items-center justify-between border-b border-neutral-700/30">
          <span className="text-gray-300 flex items-center gap-1 text-xs">
            <span className="text-white">|</span> Hit Roll
          </span>
          <span className="font-bold text-white flex items-center gap-1 text-sm">
            {hitRoll}
            {crit && <span className="text-orange-400 text-xs">🔥</span>}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-neutral-700/30">
          <span className="text-white text-xs">Hit Roll (+)</span>
          <span className="font-bold text-white text-sm">{hitTotal}</span>
        </div>

        {/* ✅ Transparency section */}
        <div className="flex flex-col border-b border-neutral-700/30 pb-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300">DEX Bonus Applied:</span>
            <span className="font-semibold text-green-400">+4</span>
          </div>
          {showProficiency && (
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-gray-300">Proficiency Bonus:</span>
              <span className="font-semibold text-blue-400">+3</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white text-xs">Total Damage</span>
          <span className="font-bold text-white text-sm">{total}</span>
        </div>
      </div>

      {/* DICE BREAKDOWN */}
      {diceBreakdown && diceBreakdown.length > 0 && (
        <div className="pt-1 border-t border-neutral-700/30 flex-1 overflow-y-auto">
          <p className="text-xs text-gray-400 mb-2 font-semibold">
            Dice Breakdown:
          </p>
          <div className="flex flex-wrap gap-1">
            {diceBreakdown.map((dice, idx) => {
              const bgColor =
                dice.label === "Base"
                  ? "bg-blue-700/60 text-blue-200"
                  : dice.label === "Htmk"
                  ? "bg-purple-700/60 text-purple-200"
                  : dice.label === "Dstk"
                  ? "bg-orange-700/60 text-orange-200"
                  : dice.label === "Gloom"
                  ? "bg-green-700/60 text-green-200"
                  : dice.label === "Zeph"
                  ? "bg-cyan-700/60 text-cyan-200"
                  : "bg-neutral-700/60 text-gray-200";

              return (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded-md text-xs font-semibold ${bgColor} border border-white/10`}
                >
                  {dice.label} {dice.diceType}: {dice.value}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
