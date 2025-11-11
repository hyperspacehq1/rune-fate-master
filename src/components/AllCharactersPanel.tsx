import { ArrowLeft, Trash2 } from "lucide-react";

interface Character {
  id: string;
  name: string;
  photo: string;
  isActive: boolean;
}

interface AllCharactersPanelProps {
  characters: Character[];
  onToggleCharacter: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function AllCharactersPanel({
  characters,
  onToggleCharacter,
  isOpen,
  onClose,
}: AllCharactersPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-25 right-8 z-40 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-neutral-900/95 backdrop-blur-sm rounded-lg shadow-2xl w-[380px] p-4 border-2 border-green-700/50">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={onClose}
            className="text-green-400 hover:text-green-300 transition-colors"
            title="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h3 className="text-white font-semibold text-lg flex-1">
            All Characters
          </h3>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {characters.map((char) => (
            <div
              key={char.id}
              className="flex items-center gap-3 p-2 bg-neutral-800/60 rounded hover:bg-neutral-800 transition-colors"
            >
              <img
                src={char.photo}
                alt={char.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-green-700/30"
              />
              <span className="text-white flex-1 font-medium text-sm">
                {char.name}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded font-semibold ${
                  char.isActive
                    ? "bg-green-700/50 text-green-300"
                    : "bg-neutral-700/50 text-gray-400"
                }`}
              >
                {char.isActive ? "Active" : "Inactive"}
              </span>
              <button
                onClick={() => onToggleCharacter(char.id)}
                className="p-1 bg-neutral-700/50 hover:bg-neutral-600/50 rounded transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
