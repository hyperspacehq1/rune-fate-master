interface CharacterCardProps {
  name: string;
  photo: string;
  onClick?: () => void;
  muted?: boolean;
  note?: string;
  totalDamage?: number;
}

export function CharacterCard({
  name,
  photo,
  onClick,
  muted,
  note,
  totalDamage,
}: CharacterCardProps) {
  return (
    <div
      className={`bg-neutral-800/60 rounded-lg overflow-hidden shadow-lg ${
        onClick ? "cursor-pointer hover:bg-neutral-800/80 transition-colors" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center p-4">
        <img
          src={photo}
          alt={name}
          className={`w-36 h-36 object-cover rounded-lg shadow-md ${
            muted ? "opacity-60" : ""
          }`}
        />
        <p className="font-semibold mt-3 text-lg">{name}</p>
        {note && <p className="text-sm text-gray-400 mt-1">{note}</p>}
      </div>
      {totalDamage !== undefined && (
        <div className="bg-green-900/60 px-4 py-3 text-center border-t border-green-700/50">
          <p className="text-sm font-semibold text-green-300">
            Total Damage : {totalDamage}
          </p>
        </div>
      )}
    </div>
  );
}
