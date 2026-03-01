/**
 * Wound-threshold computation for character creation.
 *
 * The wound threshold depends solely on the Stamina rank.
 */

const WOUND_THRESHOLD: Record<number, number> = {
  [-3]: 2,
  [-2]: 4,
  [-1]: 6,
  [0]: 9,
  [1]: 12,
  [2]: 15,
  [3]: 18,
};

/** Wound threshold (in hit points) for the given Stamina rank. */
export function computeWoundThreshold(staminaRank: number): number {
  return WOUND_THRESHOLD[staminaRank] ?? 9;
}
