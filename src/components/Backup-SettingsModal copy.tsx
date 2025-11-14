import { useState, useEffect } from "react";
import { showError } from "../utils/notifications";
import { FirstTimeSetup } from "./settings/FirstTimeSetup";
import { SettingsPanel } from "./settings/SettingsPanel";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  setUserName: (name: string) => void;
  userAvatar: string;
  setUserAvatar: (avatar: string) => void;
  onUploadBackground: (file: File) => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  showAllCharactersPanel: boolean;
  setShowAllCharactersPanel: (value: boolean) => void;
  onOpenAllCharacters: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  userName,
  setUserName,
  userAvatar,
  setUserAvatar,
  onUploadBackground,
  isDarkMode,
  setIsDarkMode,
  onOpenAllCharacters,
}: SettingsModalProps) {
  const [localUserName, setLocalUserName] = useState(userName);
  const [localUserAvatar, setLocalUserAvatar] = useState(userAvatar);
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalUserName(userName);
      setLocalUserAvatar(userAvatar);
      setIsEditingName(false);
    }
  }, [isOpen, userName, userAvatar]);

  if (!isOpen) return null;

  const isFirstTimeSetup = !userName;

  const handleSaveFirstTime = () => {
    if (localUserName.trim().length === 0) {
      showError("Please enter your name");
      return;
    }

    localStorage.setItem("userName", localUserName.trim());
    if (localUserAvatar) {
      try {
        localStorage.setItem("userAvatar", localUserAvatar);
      } catch (error) {
        console.error("Failed to save avatar:", error);
        showError("Failed to save avatar. The image might be too large.");
      }
    }

    setUserName(localUserName.trim());
    setUserAvatar(localUserAvatar);

    onClose();
  };

  const handleSaveChanges = () => {
    if (localUserName.trim().length > 0) {
      localStorage.setItem("userName", localUserName.trim());
      setUserName(localUserName.trim());
    }

    if (localUserAvatar !== userAvatar) {
      try {
        localStorage.setItem("userAvatar", localUserAvatar);
        setUserAvatar(localUserAvatar);
      } catch (error) {
        console.error("Failed to save avatar:", error);
        showError("Failed to save avatar. The image might be too large.");
      }
    }

    setIsEditingName(false);
    onClose();
  };

  if (isFirstTimeSetup) {
    return (
      <>
        <div className="fixed inset-0 z-30" onClick={onClose} />
        <FirstTimeSetup
          localUserName={localUserName}
          setLocalUserName={setLocalUserName}
          localUserAvatar={localUserAvatar}
          setLocalUserAvatar={setLocalUserAvatar}
          onSave={handleSaveFirstTime}
          onClose={onClose}
        />
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <SettingsPanel
        userName={userName}
        localUserName={localUserName}
        setLocalUserName={setLocalUserName}
        localUserAvatar={localUserAvatar}
        setLocalUserAvatar={setLocalUserAvatar}
        isEditingName={isEditingName}
        setIsEditingName={setIsEditingName}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onUploadBackground={onUploadBackground}
        onOpenAllCharacters={onOpenAllCharacters}
        onSaveChanges={handleSaveChanges}
      />
    </>
  );
}
