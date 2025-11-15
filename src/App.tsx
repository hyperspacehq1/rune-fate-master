import React, { useState } from "react";

interface SettingsModalProps {
  onClose: () => void;
  current: any;
  onSaved: () => void; // callback to reload character from API
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  current,
  onSaved
}) => {
  const [name, setName] = useState<string>(current?.name || "");
  const [companionName, setCompanionName] = useState<string>(
    current?.companion_name || ""
  );

  const [charFile, setCharFile] = useState<File | null>(null);
  const [compActiveFile, setCompActiveFile] = useState<File | null>(null);
  const [compInactiveFile, setCompInactiveFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload-character-image", {
      method: "POST",
      body: form
    });

    if (!res.ok) {
      throw new Error("Image upload failed");
    }

    const json = await res.json();
    if (!json.url) {
      throw new Error("Upload did not return a URL");
    }

    return json.url as string;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const payload: any = {
        name,
        companion_name: companionName
      };

      if (charFile) {
        payload.image = await uploadFile(charFile);
      }
      if (compActiveFile) {
        payload.companion_image_active = await uploadFile(compActiveFile);
      }
      if (compInactiveFile) {
        payload.companion_image_inactive = await uploadFile(compInactiveFile);
      }

      const res = await fetch("/api/update-character", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update character");
      }

      await onSaved();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Unexpected error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-emerald-500/50 bg-zinc-950/95 shadow-[0_0_40px_rgba(16,185,129,0.6)] p-6 sm:p-7">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-emerald-300 tracking-[0.12em]">
            CHARACTER SETTINGS
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-emerald-300 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 tracking-[0.14em] mb-1">
              CHARACTER NAME
            </label>
            <input
              className="w-full bg-black/60 border border-emerald-700/60 rounded-md px-3 py-2 text-sm text-emerald-100 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 tracking-[0.14em] mb-1">
              COMPANION NAME
            </label>
            <input
              className="w-full bg-black/60 border border-emerald-700/60 rounded-md px-3 py-2 text-sm text-emerald-100 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              value={companionName}
              onChange={e => setCompanionName(e.target.value)}
            />
          </div>

          {/* PREVIEW ROW */}
          <div className="grid grid-cols-3 gap-3 text-[10px] text-zinc-400">
            <div className="flex flex-col items-center">
              <span className="mb-1 tracking-[0.14em]">CHARACTER</span>
              <div className="w-16 h-16 rounded-md overflow-hidden bg-black/70 border border-emerald-600/60 flex items-center justify-center">
                {current?.image ? (
                  <img
                    src={current.image}
                    alt="Character"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[9px] text-emerald-500 text-center px-1">
                    No image
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="mb-1 tracking-[0.14em] text-center">
                COMPANION
                <br />
                ACTIVE
              </span>
              <div className="w-16 h-16 rounded-md overflow-hidden bg-black/70 border border-emerald-600/60 flex items-center justify-center">
                {current?.companion_image_active ? (
                  <img
                    src={current.companion_image_active}
                    alt="Companion Active"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[9px] text-emerald-500 text-center px-1">
                    No image
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="mb-1 tracking-[0.14em] text-center">
                COMPANION
                <br />
                INACTIVE
              </span>
              <div className="w-16 h-16 rounded-md overflow-hidden bg-black/70 border border-emerald-600/60 flex items-center justify-center">
                {current?.companion_image_inactive ? (
                  <img
                    src={current.companion_image_inactive}
                    alt="Companion Inactive"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[9px] text-emerald-500 text-center px-1">
                    No image
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* FILE INPUTS */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 tracking-[0.14em] mb-1">
                CHARACTER IMAGE
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-xs text-zinc-300"
                onChange={e => setCharFile(e.target.files?.[0] || null)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 tracking-[0.14em] mb-1">
                COMPANION ACTIVE IMAGE
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-xs text-zinc-300"
                onChange={e => setCompActiveFile(e.target.files?.[0] || null)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 tracking-[0.14em] mb-1">
                COMPANION INACTIVE IMAGE
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-xs text-zinc-300"
                onChange={e =>
                  setCompInactiveFile(e.target.files?.[0] || null)
                }
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 mt-1">Error: {error}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm rounded-md border border-zinc-500 text-zinc-200 hover:bg-zinc-800 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm rounded-md bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.7)] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
