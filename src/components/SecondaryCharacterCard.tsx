interface SecondaryCharacterCardProps {
  name: string;
  photo: string;
  photoInactive: string;
  isActive: boolean;
  onClick: () => void;
  totalDamage?: number;
}

export function SecondaryCharacterCard({
  name,
  photo,
  photoInactive,
  isActive,
  onClick,
  totalDamage,
}: SecondaryCharacterCardProps) {
  // ✅ Add blue glow base (always present)
  const baseGlow =
    "border-[#203596]/70 shadow-[0_0_20px_4px_rgba(32,53,150,0.45)]";

  return (
    <div
      onClick={onClick}
      className={`bg-neutral-900/90 rounded-xl overflow-hidden h-[280px] cursor-pointer transition-all relative hover:scale-[1.02] ${
        isActive
          ? `${baseGlow} hover:border-green-700/60 hover:shadow-[0_0_25px_5px_rgba(32,53,150,0.6)]`
          : `${baseGlow} opacity-70`
      }`}
    >
      <div className="absolute top-3 right-3 z-10">
        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold ${
            isActive
              ? "bg-green-700/60 text-green-300 border border-green-600/50"
              : "bg-neutral-800/80 text-gray-400 border border-neutral-700/50"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="flex items-start gap-4 p-4 h-full">
        <img
          src={isActive ? photo : photoInactive}
          alt={name}
          className="w-[100px] h-[100px] object-cover rounded-lg shadow-lg flex-shrink-0"
        />

        <div className="flex flex-col gap-3 pt-1">
          <h2 className="font-bold text-white text-md pr-16">{name}</h2>
          {totalDamage !== undefined && (
            <div className="bg-green-900/50 px-3 py-2 rounded-lg border border-green-700/50">
              <p className="text-sm font-semibold text-green-300">
                Total Damage : {totalDamage}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default SecondaryCharacterCard;