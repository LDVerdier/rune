/**
 * Secondary score computation for character creation.
 *
 * Four scores:
 * - Soak: Sta + Armor Prt
 * - Move: derived from Sprint ability rank (15/20/25/30 paces)
 * - Engagement: Str + best melee weapon Ability rank
 * - Response: highest overall modifier (governing Characteristic + Ability)
 *   among Awareness, Balance, Bravery, Dodge, Sprint, or Engagement
 */

import type { AbilityRanks } from "./abilities";
import type { Ranks } from "./character-stats";
import { ARMORS } from "./equipment";

/** Sprint rank → full move in paces. */
const MOVE_BY_SPRINT: readonly number[] = [15, 20, 25, 30];

/** Melee weapon ability names (excludes Bows and ThrownWeapon). */
const MELEE_WEAPON_ABILITIES = [
  "Brawling",
  "ChainWeapon",
  "GreatWeapon",
  "LongshaftWeapon",
  "SingleWeapon",
  "TwoWeapons",
] as const;

/** Soak = Stamina + Armor Protection rating. */
export function computeSoak(
  stamina: number,
  armorId: string | null,
): number {
  const armor = armorId ? ARMORS.find((a) => a.id === armorId) : null;
  return stamina + (armor?.prt ?? 0);
}

/** Move = full-action sprint distance based on Sprint rank. */
export function computeMove(sprintRank: number): number {
  const clamped = Math.min(Math.max(sprintRank, 0), MOVE_BY_SPRINT.length - 1);
  return MOVE_BY_SPRINT[clamped];
}

/** Engagement = Strength + best melee weapon Ability rank. */
export function computeEngagement(
  strength: number,
  abilityRanks: AbilityRanks,
): number {
  const bestMelee = Math.max(
    ...MELEE_WEAPON_ABILITIES.map((name) => abilityRanks[name] ?? 0),
  );
  return strength + bestMelee;
}

/**
 * Response = highest overall modifier among Awareness, Balance, Bravery,
 * Dodge, Sprint, or Engagement.
 *
 * Each modifier = governing Characteristic rank + Ability rank.
 * Engagement uses its own formula (Str + best melee weapon Ability).
 */
export function computeResponse(
  ranks: Ranks,
  abilityRanks: AbilityRanks,
): number {
  const candidates = [
    ranks.Perception + (abilityRanks["Awareness"] ?? 0),   // Awareness
    ranks.Dexterity + (abilityRanks["Balance"] ?? 0),      // Balance
    ranks.Stamina + (abilityRanks["Bravery"] ?? 0),        // Bravery
    ranks.Quickness + (abilityRanks["Dodge"] ?? 0),        // Dodge
    ranks.Strength + (abilityRanks["Sprint"] ?? 0),        // Sprint
    computeEngagement(ranks.Strength, abilityRanks),       // Engagement
  ];
  return Math.max(...candidates);
}
