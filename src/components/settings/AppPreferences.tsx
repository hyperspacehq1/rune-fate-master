import { Upload } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";

interface AppPreferencesProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  onUploadBackground: (file: File) => void;
}

export function AppPreferences({
  isDarkMode,
  setIsDarkMode,
  onUploadBackground,
}: AppPreferencesProps) {
  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadBackground(file);
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Upload Background */}
      <div className="flex items-center justify-between">
        <span className="text-white/90 text-sm flex items-center gap-2">
          <Upload className="w-4 h-4 text-green-500" />
          Upload Background
        </span>
        <label className="bg-green-800/50 hover:bg-green-700/60 text-white text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors">
          Choose File
          <input
            type="file"
            accept="image/*"
            onChange={handleBackgroundUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Dark/Light Mode */}
      <div className="flex items-center justify-between">
        <span className="text-white/90 text-sm">Dark/Light Mode</span>
        <Switch.Root
          checked={isDarkMode}
          onCheckedChange={setIsDarkMode}
          className="w-11 h-6 bg-neutral-800 rounded-full relative border-2 border-green-700/50 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-500 transition-all cursor-pointer"
        >
          <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform duration-200 translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
        </Switch.Root>
      </div>

      {/* Sound Effects */}
      <div className="flex items-center justify-between">
        <span className="text-white/90 text-sm">Sound Effects</span>
        <Switch.Root
          checked={false}
          onCheckedChange={() => {}}
          className="w-11 h-6 bg-neutral-800 rounded-full relative border-2 border-green-700/50 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-500 transition-all cursor-pointer"
        >
          <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform duration-200 translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
        </Switch.Root>
      </div>
    </div>
  );
}
