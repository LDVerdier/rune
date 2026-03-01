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

export function useCharacterCreation() {
  const [ranks, setRanks] = useState<Ranks>(() => ({ ...INITIAL_RANKS }));
  const [abilityRanks, setAbilityRanks] = useState<AbilityRanks>(
    () => ({ ...INITIAL_ABILITY_RANKS }),
  );

  const charSpent = characteristicPointsSpent(ranks);
  const abilSpent = abilityPointsSpent(abilityRanks);
  const remaining = BASE_POINTS - charSpent - abilSpent;

  // Effective budget for each sub-system
  const charBudget = BASE_POINTS - abilSpent;
  const abilBudget = BASE_POINTS - charSpent;

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

  // --- Reset ---
  function resetAll() {
    setRanks({ ...INITIAL_RANKS });
    setAbilityRanks({ ...INITIAL_ABILITY_RANKS });
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

    // Actions
    resetAll,
  };
}
