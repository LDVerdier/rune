import type { CharacterData } from "./character";
import { CHARACTERISTICS, MIN_RANK, MAX_RANK, BASE_POINTS, pointsSpent } from "./character-stats";
import { ABILITIES, ABILITY_MIN_RANK, ABILITY_MAX_RANK, abilityPointsSpent } from "./abilities";
import { WEAPONS, SHIELDS, ARMORS, MAX_WEAPONS } from "./equipment";

const WEAPON_IDS = new Set(WEAPONS.map((w) => w.id));
const SHIELD_IDS = new Set(SHIELDS.map((s) => s.id));
const ARMOR_IDS = new Set(ARMORS.map((a) => a.id));

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateCharacter(data: CharacterData): ValidationResult {
  const errors: string[] = [];

  // Characteristic ranks in bounds
  for (const char of CHARACTERISTICS) {
    const rank = data.characteristicRanks[char];
    if (rank == null || rank < MIN_RANK || rank > MAX_RANK) {
      errors.push(`${char} rank out of bounds: ${rank}`);
    }
  }

  // Ability ranks in bounds
  for (const ability of ABILITIES) {
    const rank = data.abilityRanks[ability.name] ?? 0;
    if (rank < ABILITY_MIN_RANK || rank > ABILITY_MAX_RANK) {
      errors.push(`Ability ${ability.name} rank out of bounds: ${rank}`);
    }
  }

  // Extra HP points non-negative
  if (data.extraHpPoints < 0) {
    errors.push(`Extra HP points negative: ${data.extraHpPoints}`);
  }

  // Budget check
  const charCost = pointsSpent(data.characteristicRanks);
  const abilityCost = abilityPointsSpent(data.abilityRanks);
  const totalSpent = charCost + abilityCost + data.extraHpPoints;
  if (totalSpent > BASE_POINTS) {
    errors.push(`Budget exceeded: ${totalSpent} > ${BASE_POINTS}`);
  }

  // Weapons <= MAX_WEAPONS and valid IDs
  if (data.selectedWeapons.length > MAX_WEAPONS) {
    errors.push(`Too many weapons: ${data.selectedWeapons.length}`);
  }
  for (const id of data.selectedWeapons) {
    if (!WEAPON_IDS.has(id)) {
      errors.push(`Unknown weapon: ${id}`);
    }
  }

  // Valid shield ID
  if (data.selectedShield != null && !SHIELD_IDS.has(data.selectedShield)) {
    errors.push(`Unknown shield: ${data.selectedShield}`);
  }

  // Valid armor ID
  if (data.selectedArmor != null && !ARMOR_IDS.has(data.selectedArmor)) {
    errors.push(`Unknown armor: ${data.selectedArmor}`);
  }

  // Gender check
  if (data.gender !== "male" && data.gender !== "female") {
    errors.push(`Invalid gender: ${data.gender}`);
  }

  return { valid: errors.length === 0, errors };
}

export function isValidCharacteristicRank(rank: number): boolean {
  return rank >= MIN_RANK && rank <= MAX_RANK && Number.isInteger(rank);
}

export function isValidAbilityRank(rank: number): boolean {
  return rank >= ABILITY_MIN_RANK && rank <= ABILITY_MAX_RANK && Number.isInteger(rank);
}
