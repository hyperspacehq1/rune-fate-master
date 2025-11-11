import { useState } from "react";
import { toast } from "react-toastify";
import type { WeaponType } from "../types";

export function useCharacterState() {
  const [creatureAC, setCreatureAC] = useState<number>(15);
  const [firstRound, setFirstRound] = useState<boolean>(true);
  const [dreadfulStrike, setDreadfulStrike] = useState<boolean>(true);
  const [huntersMark, setHuntersMark] = useState<boolean>(true);
  const [zephyrStrike, setZephyrStrike] = useState<boolean>(false);
  const [weapon, setWeapon] = useState<WeaponType>("longbow");

  const [secondaryActive, setSecondaryActive] = useState<boolean>(false);
  const [logoKey, setLogoKey] = useState<number>(0);

  const handleWeaponChange = (newWeapon: WeaponType): void => {
    if (
      zephyrStrike &&
      (newWeapon === "twohanded" || newWeapon === "singlehanded")
    ) {
      toast.error(
        "Deselect Zephyr Strike before making this selection. Zephyr Strike is reserved for Longbow attacks.",
        { position: "top-center" }
      );
      return;
    }
    setWeapon(newWeapon);
  };

  const triggerLogoAnimation = () => {
    setLogoKey((k) => k + 1);
  };

  return {
    creatureAC,
    setCreatureAC,
    firstRound,
    setFirstRound,
    dreadfulStrike,
    setDreadfulStrike,
    huntersMark,
    setHuntersMark,
    zephyrStrike,
    setZephyrStrike,
    weapon,
    handleWeaponChange,
    secondaryActive,
    setSecondaryActive,
    logoKey,
    triggerLogoAnimation,
  };
}
