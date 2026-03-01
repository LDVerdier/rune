/**
 * Encumbrance computation for character creation.
 *
 * Encumbrance degree is determined by comparing the total Load of carried
 * equipment against thresholds that depend on the character's Strength rank.
 */

import { WEAPONS, SHIELDS, ARMORS } from "./equipment";

export type EncumbranceDegree =
  | "Light"
  | "Loaded"
  | "Overloaded"
  | "BetterPutSomethingDown"
  | "NoOneWillTakeThisMuch";

/**
 * Encumbrance thresholds indexed by Strength rank (-3 to 3).
 * Each entry is [Loaded, Overloaded, BetterPutSomethingDown, NoOneWillTakeThisMuch].
 * "Light" means load is strictly below the Loaded threshold.
 */
const THRESHOLDS: Record<number, readonly [number, number, number, number]> = {
  [-3]: [0.5, 1, 2, 4],
  [-2]: [1, 2, 4, 6],
  [-1]: [2, 4, 6, 8],
  [0]: [4, 6, 8, 10],
  [1]: [6, 8, 10, 12],
  [2]: [8, 10, 12, 14],
  [3]: [10, 12, 14, 16],
};

function getThresholds(
  strengthRank: number,
): readonly [number, number, number, number] {
  if (strengthRank <= -3) return THRESHOLDS[-3];
  if (strengthRank <= 3) return THRESHOLDS[strengthRank];
  // Extrapolate: add 2 per point above 3
  const extra = (strengthRank - 3) * 2;
  const base = THRESHOLDS[3];
  return [
    base[0] + extra,
    base[1] + extra,
    base[2] + extra,
    base[3] + extra,
  ];
}

/** Sum the Load of selected weapons, shield, and armor. */
export function computeTotalLoad(
  weaponIds: string[],
  shieldId: string | null,
  armorId: string | null,
): number {
  let total = 0;

  for (const id of weaponIds) {
    const weapon = WEAPONS.find((w) => w.id === id);
    if (weapon?.load != null) total += weapon.load;
  }

  if (shieldId) {
    const shield = SHIELDS.find((s) => s.id === shieldId);
    if (shield?.load != null) total += shield.load;
  }

  if (armorId) {
    const armor = ARMORS.find((a) => a.id === armorId);
    if (armor) total += armor.load;
  }

  return total;
}

/** Determine the encumbrance degree from Strength rank and total Load. */
export function computeEncumbranceDegree(
  strengthRank: number,
  totalLoad: number,
): EncumbranceDegree {
  const [loaded, overloaded, better, noOne] = getThresholds(strengthRank);

  if (totalLoad >= noOne) return "NoOneWillTakeThisMuch";
  if (totalLoad >= better) return "BetterPutSomethingDown";
  if (totalLoad >= overloaded) return "Overloaded";
  if (totalLoad >= loaded) return "Loaded";
  return "Light";
}

const DECREASE: Record<EncumbranceDegree, number> = {
  Light: 0,
  Loaded: 1,
  Overloaded: 3,
  BetterPutSomethingDown: 5,
  NoOneWillTakeThisMuch: 8,
};

/** Malus value derived from the encumbrance degree. */
export function computeEncumbranceDecrease(
  degree: EncumbranceDegree,
): number {
  return DECREASE[degree];
}
