import React from "react";

export interface MainCharacterSectionProps {
  name?: string | null;
  image?: string | null;
}

function MainCharacterSection({ name, image }: MainCharacterSectionProps) {
  const displayName = name || "Unnamed Character";

  return (
    <section className="w-full flex justify-center mt-10 px-4">
      <div className="max-w-3xl w-full flex flex-col items-center rounded-2xl border border-emerald-600/40 bg-zinc-950/70 shadow-[0_0_40px_rgba(16,185,129,0.35)] p-6 sm:p-8">
        <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border border-emerald-400/60 shadow-[0_0_30px_rgba(16,185,129,0.7)] bg-black/60 flex items-center justify-center mb-4">
          {image ? (
            <img
              src={image}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-emerald-500 text-xs tracking-wide text-center px-2">
              No character image set
            </span>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-semibold tracking-[0.2em] text-emerald-300 text-center">
          {displayName.toUpperCase()}
        </h2>
      </div>
    </section>
  );
}

export default MainCharacterSection;
