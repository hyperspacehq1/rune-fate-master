interface SecondaryCharacterCardProps {
  companionName: string;
  activeImage: string;
  inactiveImage: string;
}

function SecondaryCharacterCard({
  companionName,
  activeImage,
  inactiveImage
}: SecondaryCharacterCardProps) {
  return (
    <div className="flex flex-col items-center py-8">
      <img
        src={activeImage || inactiveImage}
        alt={companionName}
        className="w-32 h-32 object-cover rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.6)]"
      />

      <h3 className="text-xl mt-3 text-emerald-300 tracking-wide">
        {companionName}
      </h3>
    </div>
  );
}

export default SecondaryCharacterCard;
