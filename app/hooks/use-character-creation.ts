import { useState } from "react";
import {
  BASE_POINTS,
  INITIAL_RANKS,
  canIncrease as charCanIncrease,
  nextCost as charNextCost,
  pointsSpent as characteristicPointsSpent,
  prevRefund as charPrevRefund,
  tryChangeRank,
} from "~/domain/character-stats";
import type { Characteristic, Ranks } from "~/domain/character-stats";
import {
  INITIAL_ABILITY_RANKS,
  abilityPointsSpent,
  canDecrease as canDecreaseAbility,
  canIncrease as canIncreaseAbility,
  nextCost as abilityNextCost,
  prevRefund as abilityPrevRefund,
  tryChangeRank as tryChangeAbilityRank,
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
import { computeWoundThreshold } from "~/domain/wound-threshold";
import { MAX_WEAPONS, canSelectWeapon as domainCanSelectWeapon } from "~/domain/equipment";
import {
  computeTotalLoad,
  computeEncumbranceDegree,
  computeEncumbranceDecrease,
} from "~/domain/encumbrance";

export function useCharacterCreation() {
  const [ranks, setRanks] = useState<Ranks>(() => ({ ...INITIAL_RANKS }));
  const [abilityRanks, setAbilityRanks] = useState<AbilityRanks>(
    () => ({ ...INITIAL_ABILITY_RANKS }),
  );
  const [extraHPPoints, setExtraHPPoints] = useState(0);
  const [selectedWeapons, setSelectedWeapons] = useState<string[]>([]);
  const [selectedShield, setSelectedShield] = useState<string | null>(null);
  const [selectedArmor, setSelectedArmor] = useState<string | null>(null);

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
      if (delta > 0 && !domainCanIncreaseExtraHP(hpBudget - prev)) return prev;
      return next;
    });
  }

  // --- Derived HP values ---
  const startingHP = computeStartingHP(ranks.Strength, ranks.Stamina);
  const hpPerPoint = domainExtraHPPerPoint(ranks.Stamina);
  const extraHPGain = computeExtraHPGain(extraHPPoints, ranks.Stamina);
  const totalHP = computeTotalHP(ranks.Strength, ranks.Stamina, extraHPPoints);
  const woundThreshold = computeWoundThreshold(ranks.Stamina);

  // --- Encumbrance ---
  const totalLoad = computeTotalLoad(selectedWeapons, selectedShield, selectedArmor);
  const encumbranceDegree = computeEncumbranceDegree(ranks.Strength, totalLoad);
  const encumbranceDecrease = computeEncumbranceDecrease(encumbranceDegree);

  // --- Reset ---
  function resetAll() {
    setRanks({ ...INITIAL_RANKS });
    setAbilityRanks({ ...INITIAL_ABILITY_RANKS });
    setExtraHPPoints(0);
    setSelectedWeapons([]);
    setSelectedShield(null);
    setSelectedArmor(null);
  }

  // --- Equipment operations ---
  function toggleWeapon(id: string) {
    setSelectedWeapons((prev) =>
      prev.includes(id)
        ? prev.filter((w) => w !== id)
        : prev.length < MAX_WEAPONS
          ? [...prev, id]
          : prev,
    );
  }

  function toggleShield(id: string) {
    setSelectedShield((prev) => (prev === id ? null : id));
  }

  function toggleArmor(id: string) {
    setSelectedArmor((prev) => (prev === id ? null : id));
  }

  return {
    // Shared pool
    remainingPoints: remaining,
    charSpent,
    abilSpent,

    // Characteristics
    ranks,
    changeRank,
    canIncrease: (char: Characteristic) =>
      charCanIncrease(ranks, char, charBudget),
    nextCost: (char: Characteristic) => charNextCost(ranks, char),
    prevRefund: (char: Characteristic) => charPrevRefund(ranks, char),

    // Abilities
    abilityRanks,
    changeAbilityRank,
    canIncreaseAbility: (name: string) =>
      canIncreaseAbility(abilityRanks, name, abilBudget),
    canDecreaseAbility: (name: string) =>
      canDecreaseAbility(abilityRanks, name),
    abilityNextCost: (name: string) => abilityNextCost(name),
    abilityPrevRefund: (name: string) => abilityPrevRefund(name),

    // Hit Points
    extraHPPoints,
    changeExtraHP,
    canIncreaseExtraHP: domainCanIncreaseExtraHP(remaining),
    canDecreaseExtraHP: domainCanDecreaseExtraHP(extraHPPoints),
    startingHP,
    hpPerPoint,
    extraHPGain,
    totalHP,
    woundThreshold,

    // Equipment
    selectedWeapons,
    selectedShield,
    selectedArmor,
    toggleWeapon,
    toggleShield,
    toggleArmor,
    canSelectWeapon: (id: string) => domainCanSelectWeapon(selectedWeapons, id),

    // Encumbrance
    totalLoad,
    encumbranceDegree,
    encumbranceDecrease,

    // Actions
    resetAll,
  };
}
