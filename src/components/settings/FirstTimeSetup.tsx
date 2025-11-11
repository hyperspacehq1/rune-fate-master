import { ArrowLeft } from "lucide-react";
import { useRef } from "react";
import { AvatarUpload } from "./AvatarUpload";

interface FirstTimeSetupProps {
  localUserName: string;
  setLocalUserName: (name: string) => void;
  localUserAvatar: string;
  setLocalUserAvatar: (avatar: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export function FirstTimeSetup({
  localUserName,
  setLocalUserName,
  localUserAvatar,
  setLocalUserAvatar,
  onSave,
  onClose,
}: FirstTimeSetupProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="fixed bottom-24 right-4 z-40 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#1a1a1a]/95 backdrop-blur-xl rounded-2xl shadow-2xl w-[340px] p-6 border border-green-700/30">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="mb-4 p-2 hover:bg-neutral-900/40 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* User Setup Section */}
        <div className="flex flex-col items-center mb-6">
          <AvatarUpload
            avatar={localUserAvatar}
            onAvatarChange={setLocalUserAvatar}
            size="large"
            showEditButton
            inputRef={avatarInputRef}
          />

          <p className="text-[11px] text-gray-500 mb-4">(200 x 200)</p>

          {/* Name Input */}
          <div className="w-full">
            <label className="text-white/90 text-sm mb-2 block">Name</label>
            <input
              type="text"
              value={localUserName}
              onChange={(e) => setLocalUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-neutral-900/80 border-2 border-green-700/40 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>
        </div>

        {/* Save & Activate Button */}
        <button
          onClick={onSave}
          className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-medium transition-all text-sm"
        >
          Save & Activate
        </button>
      </div>
    </div>
  );
}
