import { useState } from "react";
import {
  INITIAL_RANKS,
  tryChangeRank,
  pointsSpent as domainPointsSpent,
  remainingPoints as domainRemainingPoints,
  canIncrease as domainCanIncrease,
  nextCost as domainNextCost,
  prevRefund as domainPrevRefund,
} from "~/domain/character-stats";
import type { Characteristic, Ranks } from "~/domain/character-stats";

export function useCharacterStats() {
  const [ranks, setRanks] = useState<Ranks>(() => ({ ...INITIAL_RANKS }));

  const spent = domainPointsSpent(ranks);
  const remaining = domainRemainingPoints(ranks);

  function changeRank(char: Characteristic, delta: number) {
    setRanks((prev) => tryChangeRank(prev, char, delta) ?? prev);
  }

  function resetAll() {
    setRanks({ ...INITIAL_RANKS });
  }

  return {
    ranks,
    pointsSpent: spent,
    remainingPoints: remaining,
    changeRank,
    resetAll,
    canIncrease: (char: Characteristic) => domainCanIncrease(ranks, char),
    nextCost: (char: Characteristic) => domainNextCost(ranks, char),
    prevRefund: (char: Characteristic) => domainPrevRefund(ranks, char),
  };
}
