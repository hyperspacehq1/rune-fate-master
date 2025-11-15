import React from "react";

export interface SecondaryCharacterCardProps {
  companionName?: string | null;
  activeImage?: string | null;
  inactiveImage?: string | null;
}

function SecondaryCharacterCard({
  companionName,
  activeImage,
  inactiveImage
}: SecondaryCharacterCardProps) {
  const displayName = companionName || "Companion";
  const displayImage = activeImage || inactiveImage || null;

  return (
    <section className="w-full flex justify-center mt-8 px-4">
      <div className="max-w-xl w-full flex flex-col items-center rounded-2xl border border-emerald-500/30 bg-zinc-900/70 shadow-[0_0_30px_rgba(16,185,129,0.25)] p-5">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-emerald-300/60 bg-black/70 flex items-center justify-center mb-3">
          {displayImage ? (
            <img
              src={displayImage}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-emerald-400 text-[10px] tracking-wide text-center px-2">
              No companion image set
            </span>
          )}
        </div>

        <h3 className="text-lg sm:text-xl font-medium tracking-[0.18em] text-emerald-200 text-center">
          {displayName.toUpperCase()}
        </h3>
      </div>
    </section>
  );
}

export default SecondaryCharacterCard;
