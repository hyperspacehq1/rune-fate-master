import type { WeaponType } from "../types";
import { Toggle, Radio, TooltipToggle } from "./FormControls";
import { TOOLTIPS } from "../data/tooltips";

interface MainCharacterSectionProps {
  mainName: string;
  mainPhoto: string;
  firstRound: boolean;
  setFirstRound: (value: boolean) => void;
  dreadfulStrike: boolean;
  setDreadfulStrike: (value: boolean) => void;
  huntersMark: boolean;
  setHuntersMark: (value: boolean) => void;
  zephyrStrike: boolean;
  setZephyrStrike: (value: boolean) => void;
  handleWeaponChange: (weapon: WeaponType) => void;
  weapon: WeaponType;
  totalDamage?: number;
}

export function MainCharacterSection({
  mainName,
  mainPhoto,
  firstRound,
  setFirstRound,
  dreadfulStrike,
  setDreadfulStrike,
  huntersMark,
  setHuntersMark,
  zephyrStrike,
  setZephyrStrike,
  handleWeaponChange,
  weapon,
  totalDamage,
}: MainCharacterSectionProps) {
  return (
    <div className="bg-neutral-900/90 rounded-xl overflow-hidden shadow-2xl h-[280px] border border-neutral-700/50 flex flex-col">
      {/* HEADER WITH PHOTO, NAME, TOTAL DAMAGE */}
      <div className="flex items-start gap-4 p-4 pb-1">
        <img
          src={mainPhoto}
          alt={mainName}
          className="w-[100px] h-[100px] object-cover rounded-lg shadow-lg flex-shrink-0"
        />

        <div className="flex flex-col gap-3 pt-1">
          <h2 className="font-bold text-white text-lg">{mainName}</h2>
          {totalDamage !== undefined && (
            <div className="bg-green-900/50 px-3 py-2 rounded-lg border border-green-700/50">
              <p className="text-sm font-semibold text-green-300">
                Total Damage : {totalDamage}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CONTROLS SECTION */}
      <div className="px-4 pb-3 pt-4 overflow-y-auto flex-1">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Toggle
            label="First Round"
            checked={firstRound}
            onChange={() => setFirstRound(!firstRound)}
          />
          <TooltipToggle
            label="Dreadful Strike"
            checked={dreadfulStrike}
            onChange={() => setDreadfulStrike(!dreadfulStrike)}
            tooltipId="dreadful-strike-tooltip"
            tooltipContent={`${TOOLTIPS.dreadfulStrike.title}\n\n${TOOLTIPS.dreadfulStrike.content}`}
          />
          <TooltipToggle
            label="Hunter's Mark"
            checked={huntersMark}
            onChange={() => setHuntersMark(!huntersMark)}
            tooltipId="hunters-mark-tooltip"
            tooltipContent={`${TOOLTIPS.huntersMark.title}\n\n${TOOLTIPS.huntersMark.content}`}
          />
          <TooltipToggle
            label="Zephyr Strike"
            checked={zephyrStrike}
            onChange={() => {
              const next = !zephyrStrike;
              setZephyrStrike(next);
              if (next) handleWeaponChange("longbow");
            }}
            tooltipId="zephyr-strike-tooltip"
            tooltipContent={`${TOOLTIPS.zephyrStrike.title}\n\n${TOOLTIPS.zephyrStrike.content}`}
          />
          <Radio
            name="weapon"
            label="Scimitar + Shortsword"
            checked={weapon === "twohanded"}
            onChange={() => handleWeaponChange("twohanded")}
          />
          <Radio
            name="weapon"
            label="Scimitar"
            checked={weapon === "singlehanded"}
            onChange={() => handleWeaponChange("singlehanded")}
          />
          <Radio
            name="weapon"
            label="Longbow (+2 Magic)"
            checked={weapon === "longbow"}
            onChange={() => handleWeaponChange("longbow")}
          />
        </div>
      </div>
    </div>
  );
}
export default MainCharacterSection;
