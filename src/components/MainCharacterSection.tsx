interface MainCharacterSectionProps {
  name: string;
  image: string;
}

function MainCharacterSection({ name, image }: MainCharacterSectionProps) {
  return (
    <div className="flex flex-col items-center py-8">
      <img
        src={image}
        alt={name}
        className="w-48 h-48 object-cover rounded-xl shadow-[0_0_25px_rgba(34,197,94,0.7)]"
      />
      <h2 className="text-3xl mt-4 text-emerald-400 tracking-wide">
        {name}
      </h2>
    </div>
  );
}

export default MainCharacterSection;
