interface ACButtonsProps {
  creatureAC: number;
  setCreatureAC: (ac: number) => void;
  acValues: readonly number[];
}

export function ACButtons({
  creatureAC,
  setCreatureAC,
  acValues,
}: ACButtonsProps) {
  return (
    <div className="text-center mb-4">
      <p className="font-semibold mb-2 text-lg">Creature AC</p>
      <div className="flex flex-wrap justify-center gap-2">
        {acValues.map((ac) => (
          <button
            key={ac}
            onClick={() => setCreatureAC(ac)}
            className={`w-10 h-10 rounded-full font-semibold transition-all text-sm ${
              creatureAC === ac
                ? "bg-green-500 text-white scale-110 shadow-lg"
                : "bg-green-900/50 hover:bg-green-700/70 text-green-300 border border-green-700"
            }`}
          >
            {ac}
          </button>
        ))}
      </div>
    </div>
  );
}
