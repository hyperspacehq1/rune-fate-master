import React, { useState, useMemo } from "react";

const SettingsModal = ({ onClose, current, onSaved }) => {
  // Basic fields
  const [name, setName] = useState(current?.name || "");
  const [companionName, setCompanionName] = useState(
    current?.companion_name || ""
  );

  // Image files
  const [charFile, setCharFile] = useState(null);
  const [compActiveFile, setCompActiveFile] = useState(null);
  const [compInactiveFile, setCompInactiveFile] = useState(null);

  // UI state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Helper: generate preview URLs (local file wins, then existing URL)
  const getPreview = (file, existingUrl) => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return existingUrl || null;
  };

  const charPreview = useMemo(
    () => getPreview(charFile, current?.image),
    [charFile, current]
  );
  const compActivePreview = useMemo(
    () => getPreview(compActiveFile, current?.companion_image_active),
    [compActiveFile, current]
  );
  const compInactivePreview = useMemo(
    () => getPreview(compInactiveFile, current?.companion_image_inactive),
    [compInactiveFile, current]
  );

  const uploadFile = async (file) => {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload-character-image", {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      throw new Error("Image upload failed");
    }

    const json = await res.json();
    if (!json.url) {
      throw new Error("Upload did not return a URL");
    }

    return json.url;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const payload = {
        name,
        companion_name: companionName,
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update character");
      }

      setSuccess("Character updated successfully.");
      await onSaved();
      // Small delay so you actually see the success before closing
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Unexpected error");
    } finally {
      setSaving(false);
    }
  };

  const renderDropZone = ({
    label,
    file,
    setFile,
    preview,
    helper,
    id,
  }) => (
    <div className="space-y-2">
      <p className="text-[10px] tracking-[0.16em] text-zinc-400 uppercase">
        {label}
      </p>
      <div className="flex items-center gap-3">
        {/* Preview box */}
        <div className="w-16 h-16 rounded-md overflow-hidden bg-black/70 border border-emerald-600/60 flex items-center justify-center">
          {preview ? (
            <img
              src={preview}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[9px] text-emerald-500 text-center px-1">
              No image
            </span>
          )}
        </div>

        {/* Drop zone */}
        <label
          htmlFor={id}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              setFile(e.dataTransfer.files[0]);
            }
          }}
          className="flex-1 border border-dashed border-emerald-700/70 rounded-md px-3 py-2 text-xs text-emerald-100 bg-black/40 cursor-pointer hover:bg-black/70 hover:border-emerald-400 transition-colors"
        >
          <div className="flex justify-between items-center">
            <span className="truncate">
              {file
                ? file.name
                : "Click or drag & drop an image (.png, .jpg, .webp)"}
            </span>
            <span className="text-emerald-400 text-[10px] ml-2">
              BROWSE
            </span>
          </div>
          {helper && (
            <p className="mt-1 text-[10px] text-zinc-500">{helper}</p>
          )}
          <input
            id={id}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setFile(f);
            }}
          />
        </label>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl border border-emerald-500/50 bg-zinc-950/95 shadow-[0_0_40px_rgba(16,185,129,0.6)] p-6 sm:p-7 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-emerald-300 tracking-[0.16em]">
              CHARACTER SETTINGS
            </h2>
            <p className="text-[11px] text-zinc-500 mt-1 tracking-[0.12em]">
              UPDATE NAME, COMPANION & VISUALS
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-emerald-300 text-xl leading-none"
            disabled={saving}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-1">
          {/* LEFT: NAME FIELDS */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 tracking-[0.14em] mb-1">
                CHARACTER NAME
              </label>
              <input
                className="w-full bg-black/60 border border-emerald-700/60 rounded-md px-3 py-2 text-sm text-emerald-100 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 tracking-[0.14em] mb-1">
                COMPANION NAME
              </label>
              <input
                className="w-full bg-black/60 border border-emerald-700/60 rounded-md px-3 py-2 text-sm text-emerald-100 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                value={companionName}
                onChange={(e) => setCompanionName(e.target.value)}
                disabled={saving}
              />
            </div>

            {error && (
              <div className="mt-3 text-xs text-red-400 bg-red-950/40 border border-red-700/60 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-3 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-700/60 rounded-md px-3 py-2">
                {success}
              </div>
            )}
          </div>

          {/* RIGHT: IMAGE AREAS */}
          <div className="space-y-4">
            {renderDropZone({
              label: "CHARACTER IMAGE",
              file: charFile,
              setFile: setCharFile,
              preview: charPreview,
              helper: "Used for the main portrait in the left panel.",
              id: "char-image-input",
            })}

            {renderDropZone({
              label: "COMPANION IMAGE (ACTIVE)",
              file: compActiveFile,
              setFile: setCompActiveFile,
              preview: compActivePreview,
              helper: "Displayed when the companion is active.",
              id: "companion-active-input",
            })}

            {renderDropZone({
              label: "COMPANION IMAGE (INACTIVE)",
              file: compInactiveFile,
              setFile: setCompInactiveFile,
              preview: compInactivePreview,
              helper: "Fallback image for inactive / off-screen state.",
              id: "companion-inactive-input",
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm rounded-md border border-zinc-600 text-zinc-300 hover:bg-zinc-800/70 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-[0_0_15px_rgba(16,185,129,0.7)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && (
              <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
            )}
            <span>{saving ? "Saving…" : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
