export const CHARACTERISTICS = [
  "Strength",
  "Stamina",
  "Dexterity",
  "Quickness",
  "Intelligence",
  "Perception",
  "Presence",
  "Communication",
] as const;

export type Characteristic = (typeof CHARACTERISTICS)[number];

export type Ranks = Record<Characteristic, number>;

// Cumulative cost at each rank (-3 to +3)
export const COST_TABLE: Record<Characteristic, Record<number, number>> = {
  Strength:      { [-3]: -12, [-2]: -8,  [-1]: -4, [0]: 0, [1]: 4, [2]: 8,  [3]: 16 },
  Stamina:       { [-3]: -16, [-2]: -10, [-1]: -6, [0]: 0, [1]: 4, [2]: 8,  [3]: 16 },
  Dexterity:     { [-3]: -12, [-2]: -8,  [-1]: -4, [0]: 0, [1]: 4, [2]: 8,  [3]: 16 },
  Quickness:     { [-3]: -12, [-2]: -8,  [-1]: -4, [0]: 0, [1]: 4, [2]: 8,  [3]: 16 },
  Intelligence:  { [-3]: -6,  [-2]: -4,  [-1]: -2, [0]: 0, [1]: 2, [2]: 4,  [3]: 8  },
  Perception:    { [-3]: -6,  [-2]: -4,  [-1]: -2, [0]: 0, [1]: 2, [2]: 4,  [3]: 8  },
  Presence:      { [-3]: -2,  [-2]: -2,  [-1]: -2, [0]: 0, [1]: 2, [2]: 4,  [3]: 8  },
  Communication: { [-3]: -2,  [-2]: -2,  [-1]: -2, [0]: 0, [1]: 2, [2]: 4,  [3]: 8  },
};

export const PATRON_DEITIES: Record<Characteristic, string> = {
  Strength: "Thor",
  Stamina: "Tyr",
  Dexterity: "Ull",
  Quickness: "Njord",
  Intelligence: "Loki",
  Perception: "Heimdal",
  Presence: "Odin",
  Communication: "Freyr",
};

export const BASE_POINTS = 60;
export const MIN_RANK = -3;
export const MAX_RANK = 3;

export const INITIAL_RANKS: Ranks = Object.fromEntries(
  CHARACTERISTICS.map((c) => [c, 0]),
) as Ranks;

export function pointsSpent(ranks: Ranks): number {
  return CHARACTERISTICS.reduce(
    (sum, c) => sum + COST_TABLE[c][ranks[c]],
    0,
  );
}

export function remainingPoints(ranks: Ranks): number {
  return BASE_POINTS - pointsSpent(ranks);
}

export function tryChangeRank(
  ranks: Ranks,
  char: Characteristic,
  delta: number,
): Ranks | null {
  const newRank = ranks[char] + delta;
  if (newRank < MIN_RANK || newRank > MAX_RANK) return null;

  const costDelta = COST_TABLE[char][newRank] - COST_TABLE[char][ranks[char]];
  if (costDelta > remainingPoints(ranks)) return null;

  return { ...ranks, [char]: newRank };
}

export function canIncrease(ranks: Ranks, char: Characteristic): boolean {
  if (ranks[char] >= MAX_RANK) return false;
  const costDelta =
    COST_TABLE[char][ranks[char] + 1] - COST_TABLE[char][ranks[char]];
  return costDelta <= remainingPoints(ranks);
}

export function nextCost(ranks: Ranks, char: Characteristic): number | null {
  if (ranks[char] >= MAX_RANK) return null;
  return COST_TABLE[char][ranks[char] + 1] - COST_TABLE[char][ranks[char]];
}

export function prevRefund(ranks: Ranks, char: Characteristic): number | null {
  if (ranks[char] <= MIN_RANK) return null;
  return COST_TABLE[char][ranks[char]] - COST_TABLE[char][ranks[char] - 1];
}
