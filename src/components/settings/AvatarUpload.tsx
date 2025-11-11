import { User, Edit2 } from "lucide-react";
import {
  validateAndReadImageFile,
  IMAGE_VALIDATION,
} from "../../utils/fileValidation";
import { showError } from "../../utils/notifications";
import type { RefObject } from "react";

interface AvatarUploadProps {
  avatar: string;
  onAvatarChange: (avatar: string) => void;
  size?: "small" | "medium" | "large";
  showEditButton?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
}

const sizeClasses = {
  small: "w-12 h-12",
  medium: "w-18 h-18",
  large: "w-[100px] h-[100px]",
};

const iconSizes = {
  small: "w-6 h-6",
  medium: "w-12 h-12",
  large: "w-12 h-12",
};

const editButtonSizes = {
  small: "w-4 h-4",
  medium: "w-5 h-5",
  large: "w-7 h-7",
};

const editIconSizes = {
  small: "w-2 h-2",
  medium: "w-2.5 h-2.5",
  large: "w-3.5 h-3.5",
};

export function AvatarUpload({
  avatar,
  onAvatarChange,
  size = "medium",
  showEditButton = false,
  inputRef,
}: AvatarUploadProps) {
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await validateAndReadImageFile(
        file,
        IMAGE_VALIDATION.AVATAR
      );

      if (!result.success || !result.data) {
        showError(result.error || "Failed to upload avatar");
        return;
      }

      onAvatarChange(result.data);
    }
  };

  const handleEditClick = () => {
    inputRef?.current?.click();
  };

  return (
    <div className="relative mb-3">
      <div
        className={`${sizeClasses[size]} rounded-full bg-neutral-900/80 flex items-center justify-center overflow-hidden border-2 border-green-700/40`}
      >
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <User
            className={`${iconSizes[size]} text-green-500`}
            strokeWidth={1.5}
          />
        )}
      </div>

      {showEditButton && (
        <>
          <button
            onClick={handleEditClick}
            className={`absolute bottom-0 right-0 ${editButtonSizes[size]} bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center border-2 border-[#1a1a1a] transition-colors`}
          >
            <Edit2 className={`${editIconSizes[size]} text-white`} />
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </>
      )}
    </div>
  );
}
