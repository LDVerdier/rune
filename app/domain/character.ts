import type { Ranks } from "./character-stats";
import type { AbilityRanks } from "./abilities";

export type Gender = "male" | "female";

export interface CharacterData {
  heroName: string;
  cognomen: string;
  gender: Gender;
  characteristicRanks: Ranks;
  abilityRanks: AbilityRanks;
  extraHpPoints: number;
  selectedWeapons: string[];
  selectedShield: string | null;
  selectedArmor: string | null;
}

export interface SavedCharacter extends CharacterData {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
