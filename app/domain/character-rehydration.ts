import type { CharacterData } from "./character";
import type { CharacterSheetData } from "~/services/pdf-export";
import { computeTotalHP } from "./hit-points";
import { computeWoundThreshold } from "./wound-threshold";
import {
  computeTotalLoad,
  computeEncumbranceDegree,
  computeEncumbranceDecrease,
} from "./encumbrance";
import { computeAllInitiatives } from "./initiative";
import {
  computeAllAttacks,
  computeAllDefenses,
  computeAllDamages,
} from "./combat-scores";
import {
  computeSoak,
  computeMove,
  computeEngagement,
  computeResponse,
} from "./secondary-scores";

export function rehydrateCharacter(data: CharacterData): CharacterSheetData {
  const ranks = data.characteristicRanks;
  const abilityRanks = data.abilityRanks;

  const totalHP = computeTotalHP(ranks.Strength, ranks.Stamina, data.extraHpPoints);
  const woundThreshold = computeWoundThreshold(ranks.Stamina);

  const totalLoad = computeTotalLoad(
    data.selectedWeapons,
    data.selectedShield,
    data.selectedArmor,
  );
  const encumbranceDegree = computeEncumbranceDegree(ranks.Strength, totalLoad);
  const encumbranceDecrease = computeEncumbranceDecrease(encumbranceDegree);

  const initiativeScores = computeAllInitiatives(
    ranks.Quickness,
    abilityRanks,
    data.selectedWeapons,
    data.selectedShield,
    data.selectedArmor,
    encumbranceDecrease,
  );

  const attackScores = computeAllAttacks(
    ranks.Dexterity,
    ranks.Perception,
    abilityRanks,
    data.selectedWeapons,
    data.selectedShield,
    encumbranceDecrease,
  );

  const defenseScores = computeAllDefenses(
    ranks.Quickness,
    abilityRanks,
    data.selectedWeapons,
    data.selectedShield,
    encumbranceDecrease,
  );

  const damageScores = computeAllDamages(
    ranks.Strength,
    data.selectedWeapons,
    data.selectedShield,
  );

  const soakScore = computeSoak(ranks.Stamina, data.selectedArmor);
  const moveScore = computeMove(abilityRanks["Sprint"] ?? 0);
  const engagementScore = computeEngagement(ranks.Strength, abilityRanks);
  const responseScore = computeResponse(ranks, abilityRanks);

  return {
    heroName: data.heroName,
    cognomen: data.cognomen,
    totalHP,
    woundThreshold,
    ranks,
    abilityRanks,
    selectedWeapons: data.selectedWeapons,
    selectedShield: data.selectedShield,
    selectedArmor: data.selectedArmor,
    totalLoad,
    encumbranceDegree,
    encumbranceDecrease,
    initiativeScores,
    attackScores,
    defenseScores,
    damageScores,
    soakScore,
    moveScore,
    engagementScore,
    responseScore,
  };
}
