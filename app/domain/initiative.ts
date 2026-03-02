/**
 * Initiative score computation for character creation.
 *
 * Initiative depends on the Quickness characteristic, relevant ability rank,
 * weapon/armor/shield init ratings, and encumbrance decrease.
 *
 * Three variants:
 * - Armed: one score per selected weapon
 * - Unarmed: uses Brawling + Fist/Kick init
 * - Non-Combat: uses Sprint (no weapon init)
 *
 * If the relevant ability has rank 0, a -3 penalty applies.
 */

import type { AbilityRanks } from "./abilities";
import {
  ARMORS,
  SHIELDS,
  WEAPON_ABILITY_NAMES,
  WEAPONS,
} from "./equipment";
import type {
  ArmorDefinition,
  ShieldDefinition,
  WeaponDefinition,
} from "./equipment";

export interface InitiativeScore {
  readonly kind: "armed" | "unarmed" | "nonCombat";
  readonly weaponId: string | null;
  readonly score: number;
  readonly hasMissingAbilityPenalty: boolean;
}

/** Penalty applied when the character has rank 0 in the required ability. */
export const MISSING_ABILITY_PENALTY = -3;

const FIST_KICK_ID = "fistKick";

/**
 * Returns the rank if the character has the ability (rank > 0),
 * otherwise returns -3 (missing ability penalty).
 */
export function effectiveAbilityScore(abilityRank: number): number {
  return abilityRank > 0 ? abilityRank : MISSING_ABILITY_PENALTY;
}

/** Compute armed initiative for a single weapon. */
export function computeArmedInitiative(
  quickness: number,
  abilityRanks: AbilityRanks,
  weapon: WeaponDefinition,
  armor: ArmorDefinition | null,
  shield: ShieldDefinition | null,
  encumbranceDecrease: number,
): InitiativeScore {
  const abilityName = WEAPON_ABILITY_NAMES[weapon.ability];
  const abilityRank = abilityRanks[abilityName] ?? 0;

  return {
    kind: "armed",
    weaponId: weapon.id,
    score:
      quickness +
      effectiveAbilityScore(abilityRank) +
      weapon.init +
      (armor?.init ?? 0) +
      (shield?.init ?? 0) -
      encumbranceDecrease,
    hasMissingAbilityPenalty: abilityRank === 0,
  };
}

/** Compute unarmed initiative (Fist/Kick + Brawling). */
export function computeUnarmedInitiative(
  quickness: number,
  abilityRanks: AbilityRanks,
  armor: ArmorDefinition | null,
  shield: ShieldDefinition | null,
  encumbranceDecrease: number,
): InitiativeScore {
  const brawlingRank = abilityRanks["Brawling"] ?? 0;
  const fistKick = WEAPONS.find((w) => w.id === FIST_KICK_ID)!;

  return {
    kind: "unarmed",
    weaponId: null,
    score:
      quickness +
      effectiveAbilityScore(brawlingRank) +
      fistKick.init +
      (armor?.init ?? 0) +
      (shield?.init ?? 0) -
      encumbranceDecrease,
    hasMissingAbilityPenalty: brawlingRank === 0,
  };
}

/** Compute non-combat initiative (Sprint, no weapon). */
export function computeNonCombatInitiative(
  quickness: number,
  abilityRanks: AbilityRanks,
  armor: ArmorDefinition | null,
  shield: ShieldDefinition | null,
  encumbranceDecrease: number,
): InitiativeScore {
  const sprintRank = abilityRanks["Sprint"] ?? 0;

  return {
    kind: "nonCombat",
    weaponId: null,
    score:
      quickness +
      effectiveAbilityScore(sprintRank) +
      (armor?.init ?? 0) +
      (shield?.init ?? 0) -
      encumbranceDecrease,
    hasMissingAbilityPenalty: sprintRank === 0,
  };
}

/**
 * Compute all initiative scores for the character.
 * Returns one entry per selected weapon (armed), plus unarmed and non-combat.
 */
export function computeAllInitiatives(
  quickness: number,
  abilityRanks: AbilityRanks,
  weaponIds: string[],
  shieldId: string | null,
  armorId: string | null,
  encumbranceDecrease: number,
): InitiativeScore[] {
  const armor = armorId
    ? (ARMORS.find((a) => a.id === armorId) ?? null)
    : null;
  const shield = shieldId
    ? (SHIELDS.find((s) => s.id === shieldId) ?? null)
    : null;

  const armed = weaponIds
    .map((id) => WEAPONS.find((w) => w.id === id))
    .filter((w): w is WeaponDefinition => w != null)
    .map((weapon) =>
      computeArmedInitiative(
        quickness,
        abilityRanks,
        weapon,
        armor,
        shield,
        encumbranceDecrease,
      ),
    );

  return [
    ...armed,
    computeUnarmedInitiative(
      quickness,
      abilityRanks,
      armor,
      shield,
      encumbranceDecrease,
    ),
    computeNonCombatInitiative(
      quickness,
      abilityRanks,
      armor,
      shield,
      encumbranceDecrease,
    ),
  ];
}
