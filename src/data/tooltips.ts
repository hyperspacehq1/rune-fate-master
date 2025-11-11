import type { TooltipData } from "../types";

export const TOOLTIPS: Record<string, TooltipData> = {
  dreadfulStrike: {
    title: "Dreadful Strike (Gloom Stalker Subclass)",
    content:
      "When you attack a creature and hit it with a weapon, you can deal an extra 2d6 Psychic damage. You can use this benefit only once per turn (3/day, regain on Long Rest).",
  },
  huntersMark: {
    title: "Hunter's Mark (Spell)",
    content:
      "1st-level divination\nCasting Time: 1 bonus action\nRange: 90 feet\nDuration: 1 hr\nYou mystically mark a creature as your quarry. You deal +1d6 damage on hits. If the target dies, you can mark a new one with a bonus action.",
  },
  zephyrStrike: {
    title: "Zephyr Strike (Spell)",
    content:
      "1st-level transmutation\nCasting Time: 1 bonus action\nRange: Self\nDuration: Concentration, 1 minute\nGrants movement like the wind. Once before the spell ends, you can roll attack with advantage and add +1d8 force damage on a hit.",
  },
};
