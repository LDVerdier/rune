/**
 * Hit-point computation for character creation.
 *
 * Starting HP depends on the combined Strength + Stamina ranks.
 * Extra HP can be purchased with creation points; the yield per
 * point spent depends on the Stamina rank.
 */

// ── Starting Hit Points ────────────────────────────────────────────

/**
 * Look-up: combined Strength + Stamina → starting hit points.
 *
 * Sums that fall in a range (e.g. -3 to -1) all map to the same value.
 * Sums ≤ -4 are clamped to 18.
 */
export function computeStartingHP(
  strengthRank: number,
  staminaRank: number,
): number {
  const sum = strengthRank + staminaRank;

  if (sum <= -4) return 18;
  if (sum <= -1) return 20;
  if (sum === 0) return 22;
  if (sum <= 3) return 24;
  if (sum === 4) return 26;
  if (sum === 5) return 28;
  /* sum >= 6 */ return 30;
}

// ── Extra Hit Points ───────────────────────────────────────────────

/**
 * How many extra HP one creation point buys, by Stamina rank.
 *
 * Stamina  Extra HP
 *   -3       +1
 *   -2       +2
 *   -1       +3
 *    0       +4
 *    1       +5
 *    2       +6
 *    3       +7
 */
const EXTRA_HP_PER_POINT: Record<number, number> = {
  [-3]: 1,
  [-2]: 2,
  [-1]: 3,
  [0]: 4,
  [1]: 5,
  [2]: 6,
  [3]: 7,
};

/** HP gained per creation point spent, based on Stamina rank. */
export function extraHPPerPoint(staminaRank: number): number {
  return EXTRA_HP_PER_POINT[staminaRank] ?? 4;
}

/** Total extra HP gained for `pointsSpent` creation points at the given Stamina rank. */
export function computeExtraHPGain(
  pointsSpent: number,
  staminaRank: number,
): number {
  return pointsSpent * extraHPPerPoint(staminaRank);
}

/** Grand total hit points (starting + extra). */
export function computeTotalHP(
  strengthRank: number,
  staminaRank: number,
  extraHPPointsSpent: number,
): number {
  return (
    computeStartingHP(strengthRank, staminaRank) +
    computeExtraHPGain(extraHPPointsSpent, staminaRank)
  );
}

// ── Budget guards ──────────────────────────────────────────────────

export const EXTRA_HP_MIN = 0;

/** Can the player buy one more extra-HP point? Each costs 1 creation point. */
export function canIncreaseExtraHP(budget: number): boolean {
  return budget >= 1;
}

/** Can the player remove one extra-HP point? */
export function canDecreaseExtraHP(extraHPPointsSpent: number): boolean {
  return extraHPPointsSpent > EXTRA_HP_MIN;
}
