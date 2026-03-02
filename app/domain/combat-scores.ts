/**
 * Combat score computation for character creation.
 *
 * Three score categories:
 * - Attack: depends on Dex (melee/unarmed) or Per (missile), ability rank,
 *   weapon atk rating, shield atk rating, and encumbrance decrease.
 * - Defense: depends on Qik, ability rank, weapon dfn rating, shield dfn
 *   rating, and encumbrance decrease. Only for weapons with dfn !== null.
 * - Damage: depends on Str and weapon dam rating. Melee/unarmed only.
 *
 * If the relevant ability has rank 0, a -3 penalty applies (attack & defense).
 */

import { effectiveAbilityScore } from "./ability-check";
import type { AbilityRanks } from "./abilities";
import {
  FIST_KICK,
  MISSILE_WEAPON_ABILITIES,
  WEAPON_ABILITY_NAMES,
  findShield,
  findWeapons,
} from "./equipment";
import type { ShieldDefinition, WeaponDefinition } from "./equipment";

export interface AttackScore {
  readonly kind: "melee" | "missile" | "unarmed";
  readonly weaponId: string | null;
  readonly score: number;
  readonly hasMissingAbilityPenalty: boolean;
}

export interface DefenseScore {
  readonly kind: "armed" | "unarmed";
  readonly weaponId: string | null;
  readonly score: number;
  readonly hasMissingAbilityPenalty: boolean;
}

export interface DamageScore {
  readonly kind: "armed" | "missile" | "unarmed";
  readonly weaponId: string | null;
  readonly score: number;
}

// ---------------------------------------------------------------------------
// Attack
// ---------------------------------------------------------------------------

/** Compute melee attack for a single weapon. */
export function computeMeleeAttack(
  dexterity: number,
  abilityRanks: AbilityRanks,
  weapon: WeaponDefinition,
  shield: ShieldDefinition | null,
  encumbranceDecrease: number,
): AttackScore {
  const abilityName = WEAPON_ABILITY_NAMES[weapon.ability];
  const abilityRank = abilityRanks[abilityName] ?? 0;

  return {
    kind: "melee",
    weaponId: weapon.id,
    score:
      dexterity +
      effectiveAbilityScore(abilityRank) +
      weapon.atk +
      (shield?.atk ?? 0) -
      encumbranceDecrease,
    hasMissingAbilityPenalty: abilityRank === 0,
  };
}

/** Compute missile attack for a single weapon. */
export function computeMissileAttack(
  perception: number,
  abilityRanks: AbilityRanks,
  weapon: WeaponDefinition,
  shield: ShieldDefinition | null,
  encumbranceDecrease: number,
): AttackScore {
  const abilityName = WEAPON_ABILITY_NAMES[weapon.ability];
  const abilityRank = abilityRanks[abilityName] ?? 0;

  return {
    kind: "missile",
    weaponId: weapon.id,
    score:
      perception +
      effectiveAbilityScore(abilityRank) +
      weapon.atk +
      (shield?.atk ?? 0) -
      encumbranceDecrease,
    hasMissingAbilityPenalty: abilityRank === 0,
  };
}

/** Compute unarmed attack (Fist/Kick + Brawling). */
export function computeUnarmedAttack(
  dexterity: number,
  abilityRanks: AbilityRanks,
  shield: ShieldDefinition | null,
  encumbranceDecrease: number,
): AttackScore {
  const brawlingRank = abilityRanks["Brawling"] ?? 0;

  return {
    kind: "unarmed",
    weaponId: null,
    score:
      dexterity +
      effectiveAbilityScore(brawlingRank) +
      FIST_KICK.atk +
      (shield?.atk ?? 0) -
      encumbranceDecrease,
    hasMissingAbilityPenalty: brawlingRank === 0,
  };
}

/**
 * Compute all attack scores for the character.
 * Returns one entry per selected weapon (melee or missile) plus unarmed.
 */
export function computeAllAttacks(
  dexterity: number,
  perception: number,
  abilityRanks: AbilityRanks,
  weaponIds: string[],
  shieldId: string | null,
  encumbranceDecrease: number,
): AttackScore[] {
  const shield = findShield(shieldId);

  const armed = findWeapons(weaponIds).map((weapon) =>
    MISSILE_WEAPON_ABILITIES.has(weapon.ability)
      ? computeMissileAttack(
          perception,
          abilityRanks,
          weapon,
          shield,
          encumbranceDecrease,
        )
      : computeMeleeAttack(
          dexterity,
          abilityRanks,
          weapon,
          shield,
          encumbranceDecrease,
        ),
  );

  return [
    ...armed,
    computeUnarmedAttack(dexterity, abilityRanks, shield, encumbranceDecrease),
  ];
}

// ---------------------------------------------------------------------------
// Defense
// ---------------------------------------------------------------------------

/** Compute armed defense for a single weapon (only weapons with dfn !== null). */
export function computeArmedDefense(
  quickness: number,
  abilityRanks: AbilityRanks,
  weapon: WeaponDefinition,
  shield: ShieldDefinition | null,
  encumbranceDecrease: number,
): DefenseScore {
  const abilityName = WEAPON_ABILITY_NAMES[weapon.ability];
  const abilityRank = abilityRanks[abilityName] ?? 0;

  return {
    kind: "armed",
    weaponId: weapon.id,
    score:
      quickness +
      effectiveAbilityScore(abilityRank) +
      (weapon.dfn ?? 0) +
      (shield?.dfn ?? 0) -
      encumbranceDecrease,
    hasMissingAbilityPenalty: abilityRank === 0,
  };
}

/** Compute unarmed defense (Fist/Kick + Brawling). */
export function computeUnarmedDefense(
  quickness: number,
  abilityRanks: AbilityRanks,
  shield: ShieldDefinition | null,
  encumbranceDecrease: number,
): DefenseScore {
  const brawlingRank = abilityRanks["Brawling"] ?? 0;

  return {
    kind: "unarmed",
    weaponId: null,
    score:
      quickness +
      effectiveAbilityScore(brawlingRank) +
      (FIST_KICK.dfn ?? 0) +
      (shield?.dfn ?? 0) -
      encumbranceDecrease,
    hasMissingAbilityPenalty: brawlingRank === 0,
  };
}

/**
 * Compute all defense scores for the character.
 * Returns one entry per selected weapon that has dfn !== null, plus unarmed.
 */
export function computeAllDefenses(
  quickness: number,
  abilityRanks: AbilityRanks,
  weaponIds: string[],
  shieldId: string | null,
  encumbranceDecrease: number,
): DefenseScore[] {
  const shield = findShield(shieldId);

  const armed = findWeapons(weaponIds)
    .filter((w) => w.dfn !== null)
    .map((weapon) =>
      computeArmedDefense(
        quickness,
        abilityRanks,
        weapon,
        shield,
        encumbranceDecrease,
      ),
    );

  return [
    ...armed,
    computeUnarmedDefense(quickness, abilityRanks, shield, encumbranceDecrease),
  ];
}

// ---------------------------------------------------------------------------
// Damage
// ---------------------------------------------------------------------------

/** Compute damage for a single melee weapon (Str + weapon dam). */
export function computeArmedDamage(
  strength: number,
  weapon: WeaponDefinition,
): DamageScore {
  return {
    kind: "armed",
    weaponId: weapon.id,
    score: strength + (typeof weapon.dam === "number" ? weapon.dam : 0),
  };
}

/** Compute damage for a single missile weapon (weapon dam only, no Str). */
export function computeMissileDamage(weapon: WeaponDefinition): DamageScore {
  return {
    kind: "missile",
    weaponId: weapon.id,
    score: typeof weapon.dam === "number" ? weapon.dam : 0,
  };
}

/** Compute unarmed damage (Fist/Kick). */
export function computeUnarmedDamage(strength: number): DamageScore {
  return {
    kind: "unarmed",
    weaponId: null,
    score: strength + (typeof FIST_KICK.dam === "number" ? FIST_KICK.dam : 0),
  };
}

/**
 * Compute all damage scores for the character.
 * Melee: Str + weapon dam. Missile: weapon dam only. Plus unarmed.
 */
export function computeAllDamages(
  strength: number,
  weaponIds: string[],
): DamageScore[] {
  const weapons = findWeapons(weaponIds).filter(
    (w) => typeof w.dam === "number",
  );

  const melee = weapons
    .filter((w) => !MISSILE_WEAPON_ABILITIES.has(w.ability))
    .map((weapon) => computeArmedDamage(strength, weapon));

  const missile = weapons
    .filter((w) => MISSILE_WEAPON_ABILITIES.has(w.ability))
    .map((weapon) => computeMissileDamage(weapon));

  return [...melee, ...missile, computeUnarmedDamage(strength)];
}
