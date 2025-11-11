export type WeaponType = "longbow" | "twohanded" | "singlehanded";

export interface DamageFormula {
  base: { count: number; sides: number };
  hunters: { count: number; sides: number } | null;
  gloomstalker: { count: number; sides: number } | null;
  zephyr: { count: number; sides: number } | null;
  bonus: number;
}

export interface DiceRoll {
  label: string; // "Base", "Htmk", "Dstk", etc.
  diceType: string; // "d6", "d8", etc.
  value: number;
}

export interface AttackResult {
  label: string;
  hitRoll: number;
  hitTotal: number;
  crit: boolean;
  success: boolean;
  total: number;
  rolls?: number[];
  diceBreakdown?: DiceRoll[]; // Detailed breakdown of each dice rolled
  hasDreadfulStrike?: boolean; // Whether Dreadful Strike was applied to this attack
}

export interface TooltipData {
  title: string;
  content: string;
}
