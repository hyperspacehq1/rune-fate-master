import { Edit2 } from "lucide-react";
import { AvatarUpload } from "./AvatarUpload";
import type { RefObject } from "react";

interface UserProfileProps {
  userName: string;
  localUserName: string;
  setLocalUserName: (name: string) => void;
  localUserAvatar: string;
  setLocalUserAvatar: (avatar: string) => void;
  isEditingName: boolean;
  setIsEditingName: (value: boolean) => void;
  avatarInputRef: RefObject<HTMLInputElement | null>;
}

export function UserProfile({
  userName,
  localUserName,
  setLocalUserName,
  localUserAvatar,
  setLocalUserAvatar,
  isEditingName,
  setIsEditingName,
  avatarInputRef,
}: UserProfileProps) {
  const handleEditName = () => {
    setIsEditingName(true);
  };

  return (
    <div className="flex flex-col items-center mb-2">
      <AvatarUpload
        avatar={localUserAvatar}
        onAvatarChange={setLocalUserAvatar}
        size="medium"
        showEditButton
        inputRef={avatarInputRef}
      />

      <p className="text-[11px] text-gray-500">(200 x 200)</p>

      {/* Name Display/Edit */}
      <div className="text-white flex items-center gap-2 text-lg font-medium">
        {isEditingName ? (
          <input
            type="text"
            value={localUserName}
            onChange={(e) => setLocalUserName(e.target.value)}
            onBlur={() => setIsEditingName(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setIsEditingName(false);
            }}
            autoFocus
            className="bg-neutral-900/80 border-2 border-green-700/40 text-white px-2 py-1 rounded text-center focus:outline-none focus:border-green-500"
          />
        ) : (
          <>
            <div>{localUserName || userName}</div>
            <button onClick={handleEditName}>
              <Edit2 className="w-3.5 h-3.5 hover:text-green-400 transition-colors" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
