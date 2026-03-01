/**
 * Hit-point computation for character creation.
 *
 * Starting HP depends on the combined Strength + Stamina ranks.
 * Extra HP can be purchased with creation points; the yield per
 * point spent depends on the Stamina rank.
 */

// ── Starting Hit Points ────────────────────────────────────────────

export interface StartingHPEntry {
  /** Minimum Str+Sta sum for this tier (inclusive). `null` = unbounded below. */
  readonly min: number | null;
  /** Maximum Str+Sta sum for this tier (inclusive). `null` = unbounded above. */
  readonly max: number | null;
  /** Starting HP for characters in this tier. */
  readonly hp: number;
}

/** Lookup table: combined Strength + Stamina → starting hit points. */
export const STARTING_HP_TABLE: readonly StartingHPEntry[] = [
  { min: null, max: -4, hp: 18 },
  { min: -3, max: -1, hp: 20 },
  { min: 0, max: 0, hp: 22 },
  { min: 1, max: 3, hp: 24 },
  { min: 4, max: 4, hp: 26 },
  { min: 5, max: 5, hp: 28 },
  { min: 6, max: null, hp: 30 },
];

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
  const entry = STARTING_HP_TABLE.find(
    (e) => (e.min === null || sum >= e.min) && (e.max === null || sum <= e.max),
  );
  return entry?.hp ?? 22;
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
const EXTRA_HP_PER_POINT: readonly { stamina: number; hp: number }[] = [
  { stamina: -3, hp: 1 },
  { stamina: -2, hp: 2 },
  { stamina: -1, hp: 3 },
  { stamina: 0, hp: 4 },
  { stamina: 1, hp: 5 },
  { stamina: 2, hp: 6 },
  { stamina: 3, hp: 7 },
];

/** Exported table for UI reference display. */
export { EXTRA_HP_PER_POINT };

const EXTRA_HP_MAP = new Map(EXTRA_HP_PER_POINT.map((e) => [e.stamina, e.hp]));

/** HP gained per creation point spent, based on Stamina rank. */
export function extraHPPerPoint(staminaRank: number): number {
  return EXTRA_HP_MAP.get(staminaRank) ?? 4;
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

// ── State transition ─────────────────────────────────────────────

/**
 * Attempt to change the extra-HP point allocation by `delta`.
 * Returns the new value, or `null` if the change is invalid.
 */
export function tryChangeExtraHP(
  current: number,
  delta: number,
  budget: number,
): number | null {
  const next = current + delta;
  if (next < 0) return null;
  if (delta > 0 && !canIncreaseExtraHP(budget - current)) return null;
  return next;
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
