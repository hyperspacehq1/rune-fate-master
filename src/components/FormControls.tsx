import { Tooltip } from "react-tooltip";
import { Check } from "lucide-react";

interface TooltipToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  tooltipId: string;
  tooltipContent: string;
}

export function TooltipToggle({
  label,
  checked,
  onChange,
  tooltipId,
  tooltipContent,
}: TooltipToggleProps) {
  return (
    <>
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
          />
          <div className="w-5 h-5 border-2 border-green-600 rounded bg-neutral-800 peer-checked:bg-green-600 peer-checked:border-green-500 transition-all flex items-center justify-center">
            {checked && (
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            )}
          </div>
        </div>
        <span className="text-white group-hover:text-green-400 transition-colors">
          {label}
        </span>
        <button
          data-tooltip-id={tooltipId}
          data-tooltip-content={tooltipContent}
          type="button"
          className="ml-1 text-green-400 hover:text-green-300 text-lg"
          onClick={(e) => e.preventDefault()}
        >
          📜
        </button>
      </label>
      <Tooltip
        id={tooltipId}
        place="right"
        style={{ maxWidth: "400px", whiteSpace: "pre-wrap", zIndex: 1 }}
      />
    </>
  );
}

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-5 h-5 border-2 border-green-600 rounded bg-neutral-800 peer-checked:bg-green-600 peer-checked:border-green-500 transition-all flex items-center justify-center">
          {checked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
        </div>
      </div>
      <span className="text-white group-hover:text-green-400 transition-colors">
        {label}
      </span>
    </label>
  );
}

interface RadioProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

export function Radio({ name, label, checked, onChange }: RadioProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input
          type="radio"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-5 h-5 border-2 border-green-600 rounded-full bg-neutral-800 peer-checked:border-green-500 transition-all flex items-center justify-center">
          {checked && (
            <div className="w-3 h-3 bg-green-500 flex items-center justify-center rounded-full"></div>
          )}
        </div>
      </div>
      <span className="text-white group-hover:text-green-400 transition-colors">
        {label}
      </span>
    </label>
  );
}
