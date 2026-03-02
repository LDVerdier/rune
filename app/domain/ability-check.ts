/**
 * Shared utility for ability-based score computation.
 *
 * When a character lacks a required ability (rank 0), a fixed penalty
 * applies instead of the rank value.
 */

/** Penalty applied when the character has rank 0 in the required ability. */
export const MISSING_ABILITY_PENALTY = -3;

/**
 * Returns the rank if the character has the ability (rank > 0),
 * otherwise returns -3 (missing ability penalty).
 */
export function effectiveAbilityScore(abilityRank: number): number {
  return abilityRank > 0 ? abilityRank : MISSING_ABILITY_PENALTY;
}
