import { ArrowRight, Settings as SettingsIcon } from "lucide-react";
import { useRef } from "react";
import { UserProfile } from "./UserProfile";
import { AppPreferences } from "./AppPreferences";

interface SettingsPanelProps {
  userName: string;
  localUserName: string;
  setLocalUserName: (name: string) => void;
  localUserAvatar: string;
  setLocalUserAvatar: (avatar: string) => void;
  isEditingName: boolean;
  setIsEditingName: (value: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  onUploadBackground: (file: File) => void;
  onOpenAllCharacters: () => void;
  onSaveChanges: () => void;
}

export function SettingsPanel({
  userName,
  localUserName,
  setLocalUserName,
  localUserAvatar,
  setLocalUserAvatar,
  isEditingName,
  setIsEditingName,
  isDarkMode,
  setIsDarkMode,
  onUploadBackground,
  onOpenAllCharacters,
  onSaveChanges,
}: SettingsPanelProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="fixed bottom-24 right-4 z-40 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#1a1a1a]/95 backdrop-blur-xl rounded-2xl shadow-2xl w-[340px] p-6 border border-green-700/30">
        {/* User Profile Section */}
        <UserProfile
          userName={userName}
          localUserName={localUserName}
          setLocalUserName={setLocalUserName}
          localUserAvatar={localUserAvatar}
          setLocalUserAvatar={setLocalUserAvatar}
          isEditingName={isEditingName}
          setIsEditingName={setIsEditingName}
          avatarInputRef={avatarInputRef}
        />

        {/* View All Characters Button */}
        <button
          onClick={onOpenAllCharacters}
          className="w-full bg-green-800/50 hover:bg-green-700/60 text-white py-3 rounded-xl transition-all mb-2 text-sm font-medium flex items-center justify-center gap-2"
        >
          View All Characters
          <ArrowRight className="h-4 w-4" />
        </button>

        {/* App Preferences Header */}
        <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-green-500" />
          App Preferences
        </h3>

        {/* Settings Options */}
        <AppPreferences
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onUploadBackground={onUploadBackground}
        />

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onSaveChanges}
            className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-medium transition-all text-sm"
          >
            Save Changes
          </button>
          <button className="w-full bg-transparent hover:bg-neutral-900/40 text-white py-3 rounded-xl font-medium transition-all text-sm border-2 border-green-700/40 hover:border-green-600/50">
            + Add New Character
          </button>
        </div>
      </div>
    </div>
  );
}
