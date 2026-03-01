import { useState } from "react";
import {
  BASE_POINTS,
  INITIAL_RANKS,
  canIncrease as domainCanIncreaseChar,
  nextCost as domainNextCost,
  pointsSpent as characteristicPointsSpent,
  prevRefund as domainPrevRefund,
  tryChangeRank,
} from "~/domain/character-stats";
import type { Characteristic, Ranks } from "~/domain/character-stats";
import {
  INITIAL_ABILITY_RANKS,
  abilityNextCost as domainAbilityNextCost,
  abilityPointsSpent,
  abilityPrevRefund as domainAbilityPrevRefund,
  canDecreaseAbility as domainCanDecreaseAbility,
  canIncreaseAbility as domainCanIncreaseAbility,
  tryChangeAbilityRank,
} from "~/domain/abilities";
import type { AbilityRanks } from "~/domain/abilities";
import {
  canDecreaseExtraHP as domainCanDecreaseExtraHP,
  canIncreaseExtraHP as domainCanIncreaseExtraHP,
  computeExtraHPGain,
  computeStartingHP,
  computeTotalHP,
  extraHPPerPoint as domainExtraHPPerPoint,
} from "~/domain/hit-points";

export function useCharacterCreation() {
  const [ranks, setRanks] = useState<Ranks>(() => ({ ...INITIAL_RANKS }));
  const [abilityRanks, setAbilityRanks] = useState<AbilityRanks>(
    () => ({ ...INITIAL_ABILITY_RANKS }),
  );
  const [extraHPPoints, setExtraHPPoints] = useState(0);

  const charSpent = characteristicPointsSpent(ranks);
  const abilSpent = abilityPointsSpent(abilityRanks);
  const remaining = BASE_POINTS - charSpent - abilSpent - extraHPPoints;

  // Effective budget for each sub-system
  const charBudget = BASE_POINTS - abilSpent - extraHPPoints;
  const abilBudget = BASE_POINTS - charSpent - extraHPPoints;
  const hpBudget = BASE_POINTS - charSpent - abilSpent;

  // --- Characteristic operations ---
  function changeRank(char: Characteristic, delta: number) {
    setRanks((prev) => tryChangeRank(prev, char, delta, charBudget) ?? prev);
  }

  // --- Ability operations ---
  function changeAbilityRank(name: string, delta: number) {
    setAbilityRanks((prev) =>
      tryChangeAbilityRank(prev, name, delta, abilBudget) ?? prev,
    );
  }

  // --- Extra Hit Points operations ---
  function changeExtraHP(delta: number) {
    setExtraHPPoints((prev) => {
      const next = prev + delta;
      if (next < 0) return prev;
      if (delta > 0 && !domainCanIncreaseExtraHP(hpBudget)) return prev;
      return next;
    });
  }

  // --- Derived HP values ---
  const startingHP = computeStartingHP(ranks.Strength, ranks.Stamina);
  const hpPerPoint = domainExtraHPPerPoint(ranks.Stamina);
  const extraHPGain = computeExtraHPGain(extraHPPoints, ranks.Stamina);
  const totalHP = computeTotalHP(ranks.Strength, ranks.Stamina, extraHPPoints);

  // --- Reset ---
  function resetAll() {
    setRanks({ ...INITIAL_RANKS });
    setAbilityRanks({ ...INITIAL_ABILITY_RANKS });
    setExtraHPPoints(0);
  }

  return {
    // Shared pool
    remainingPoints: remaining,

    // Characteristics
    ranks,
    changeRank,
    canIncrease: (char: Characteristic) =>
      domainCanIncreaseChar(ranks, char, charBudget),
    nextCost: (char: Characteristic) => domainNextCost(ranks, char),
    prevRefund: (char: Characteristic) => domainPrevRefund(ranks, char),

    // Abilities
    abilityRanks,
    changeAbilityRank,
    canIncreaseAbility: (name: string) =>
      domainCanIncreaseAbility(abilityRanks, name, abilBudget),
    canDecreaseAbility: (name: string) =>
      domainCanDecreaseAbility(abilityRanks, name),
    abilityNextCost: (name: string) => domainAbilityNextCost(name),
    abilityPrevRefund: (name: string) => domainAbilityPrevRefund(name),

    // Hit Points
    extraHPPoints,
    changeExtraHP,
    canIncreaseExtraHP: domainCanIncreaseExtraHP(hpBudget),
    canDecreaseExtraHP: domainCanDecreaseExtraHP(extraHPPoints),
    startingHP,
    hpPerPoint,
    extraHPGain,
    totalHP,

    // Actions
    resetAll,
  };
}
