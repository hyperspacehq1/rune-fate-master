import { useState } from "react";
import type { WeaponType, AttackResult, DiceRoll } from "../types";
import { DEX_BONUS, SECONDARY_HIT_BONUS } from "../constants";

interface UseAttackRollsProps {
  weapon: WeaponType;
  firstRound: boolean;
  huntersMark: boolean;
  zephyrStrike: boolean;
  dreadfulStrike: boolean;
  creatureAC: number;
  secondaryActive: boolean;
}

export function useAttackRolls({
  weapon,
  firstRound,
  huntersMark,
  zephyrStrike,
  dreadfulStrike,
  creatureAC,
  secondaryActive,
}: UseAttackRollsProps) {
  const [attackResultsMain, setAttackResultsMain] = useState<AttackResult[]>([]);
  const [attackResultsSecondary, setAttackResultsSecondary] = useState<AttackResult[]>([]);

  const rollDie = (sides: number): number => Math.floor(Math.random() * sides) + 1;

  const getMainHitBonus = (): number => (weapon === "longbow" ? 9 : 7);

  const getAttackLabels = (): string[] =>
    firstRound
      ? weapon === "longbow"
        ? ["1st Attack", "2nd Attack", "Gloomstalker"]
        : weapon === "twohanded"
        ? ["1st Attack", "2nd Attack", "Gloomstalker", "Shortsword"]
        : ["1st Attack", "2nd Attack", "Gloomstalker"]
      : weapon === "longbow"
      ? ["1st Attack", "2nd Attack"]
      : weapon === "twohanded"
      ? ["1st Attack", "2nd Attack", "Shortsword"]
      : ["1st Attack", "2nd Attack"];

  const rollMain = (): void => {
    const results: AttackResult[] = [];

    for (const label of getAttackLabels()) {
      const roll1 = rollDie(20);
      const roll2 = zephyrStrike ? rollDie(20) : 0;
      const hitRoll = zephyrStrike ? Math.max(roll1, roll2) : roll1;
      const crit = hitRoll === 20;
      const hitTotal = hitRoll + getMainHitBonus();
      const success = hitTotal >= creatureAC;

      const isLongbow = weapon === "longbow";
      const baseSides = isLongbow ? 8 : 6;
      const gloomActive = firstRound && label === "Gloomstalker";
      const zephyrActive = zephyrStrike && isLongbow && label !== "Shortsword";

      // Double dice on crits
      const mult = crit ? 2 : 1;

      const diceBreakdown: DiceRoll[] = [];
      const rolls: number[] = [];

      // 🟦 Base damage
      for (let i = 0; i < mult; i++) {
        const value = rollDie(baseSides);
        rolls.push(value);
        diceBreakdown.push({ label: "Base", diceType: `d${baseSides}`, value });
      }

      // 🟣 Hunter’s Mark
      if (huntersMark) {
        for (let i = 0; i < mult; i++) {
          const value = rollDie(6);
          rolls.push(value);
          diceBreakdown.push({ label: "Htmk", diceType: "d6", value });
        }
      }

      // 🟢 Gloomstalker
      if (gloomActive) {
        for (let i = 0; i < mult; i++) {
          const value = rollDie(8);
          rolls.push(value);
          diceBreakdown.push({ label: "Gloom", diceType: "d8", value });
        }
      }

      // 🔵 Zephyr Strike
      if (zephyrActive) {
        for (let i = 0; i < mult; i++) {
          const value = rollDie(8);
          rolls.push(value);
          diceBreakdown.push({ label: "Zeph", diceType: "d8", value });
        }
      }

      // 🧮 Totals
      const total = rolls.reduce((a, b) => a + b, 0) + DEX_BONUS + (isLongbow ? 2 : 0);

      results.push({
        label,
        hitRoll,
        hitTotal,
        crit,
        success,
        total,
        rolls,
        diceBreakdown,
        hasDreadfulStrike: false,
      });
    }

    // ⚡ Dreadful Strike applies after success
   if (dreadfulStrike) {
  const hit = results.find((r) => r.success);
  if (hit) {
    // 🧠 Dreadful Strike = 2d6 psychic (double dice on crit)
    const mult = hit.crit ? 4 : 2; // 2 dice normally, 4 on crit
    const dreadfulRolls = Array.from({ length: mult }, () => rollDie(6));
    const extra = dreadfulRolls.reduce((a, b) => a + b, 0);

    dreadfulRolls.forEach((value) =>
      hit.diceBreakdown?.push({ label: "Dstk", diceType: "d6", value })
    );

    hit.total += extra;
    hit.hasDreadfulStrike = true;
  }
}

    setAttackResultsMain(results);
  };

  const rollSecondary = (): void => {
    const roll = rollDie(20);
    const crit = roll === 20;
    const hitTotal = roll + SECONDARY_HIT_BONUS;
    const success = hitTotal >= creatureAC;

    const mult = crit ? 2 : 1;
    const diceBreakdown: DiceRoll[] = [];
    const rolls: number[] = [];

    for (let i = 0; i < mult; i++) {
      const value = rollDie(8);
      rolls.push(value);
      diceBreakdown.push({ label: "Base", diceType: "d8", value });
    }

    const dmg = rolls.reduce((a, b) => a + b, 0) + 10;

    setAttackResultsSecondary([
      {
        label: "Bite Attack",
        hitRoll: roll,
        hitTotal,
        crit,
        success,
        total: dmg,
        diceBreakdown,
        hasDreadfulStrike: false,
      },
    ]);
  };

  const rollAll = (): void => {
    rollMain();
    secondaryActive ? rollSecondary() : setAttackResultsSecondary([]);
  };

  const clearResults = (): void => {
    setAttackResultsMain([]);
    setAttackResultsSecondary([]);
  };

  const getAttackIcon = (label: string): string =>
    weapon === "longbow" ? "🏹" : label.includes("Bite") ? "🦷" : "⚔️";

  const totalMain = attackResultsMain
    .filter((r) => r.success)
    .reduce((a, b) => a + b.total, 0);
  const totalSec = attackResultsSecondary
    .filter((r) => r.success)
    .reduce((a, b) => a + b.total, 0);
  const totalCombined = totalMain + totalSec;

  return {
    attackResultsMain,
    attackResultsSecondary,
    rollAll,
    clearResults,
    getAttackIcon,
    totalMain,
    totalSec,
    totalCombined,
  };
}
