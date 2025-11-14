import React, { useState } from "react";

interface Props {
  onClose: () => void;
  current: any; // character data
  onSaved: () => void; // reloads character from API
}

const SettingsModal: React.FC<Props> = ({ onClose, current, onSaved }) => {
  const [name, setName] = useState(current?.name || "");
  const [companionName, setCompanionName] = useState(current?.companion_name || "");

  const [charFile, setCharFile] = useState<File | null>(null);
  const [compActiveFile, setCompActiveFile] = useState<File | null>(null);
  const [compInactiveFile, setCompInactiveFile] = useState<File | null>(null);

  const uploadFile = async (file: File) => {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload-character-image", {
      method: "POST",
      body: form
    });

    const json = await res.json();
    return json.url;
  };

  const save = async () => {
    let payload: any = {
      name,
      companion_name: companionName
    };

    if (charFile) payload.image = await uploadFile(charFile);
    if (compActiveFile) payload.companion_image_active = await uploadFile(compActiveFile);
    if (compInactiveFile) payload.companion_image_inactive = await uploadFile(compInactiveFile);

    await fetch("/api/update-character", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 animate-fadeIn">
      <div className="bg-zinc-900/90 p-6 rounded-xl w-full max-w-lg border border-zinc-700 shadow-lg animate-fadeInIos">

        <h2 className="text-xl font-semibold text-white mb-4">
          Character Settings
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-zinc-300">Character Name</label>
            <input
              className="w-full bg-black/50 border border-zinc-700 rounded-md px-3 py-2 text-white"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300">Companion Name</label>
            <input
              className="w-full bg-black/50 border border-zinc-700 rounded-md px-3 py-2 text-white"
              value={companionName}
              onChange={e => setCompanionName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300">Character Image</label>
            <input
              type="file"
              className="w-full text-white"
              onChange={e => setCharFile(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300">Companion Active Image</label>
            <input
              type="file"
              className="w-full text-white"
              onChange={e => setCompActiveFile(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300">Companion Inactive Image</label>
            <input
              type="file"
              className="w-full text-white"
              onChange={e => setCompInactiveFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-zinc-700 hover:bg-zinc-600 text-white"
          >
            Cancel
          </button>

          <button
            onClick={save}
            className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;
