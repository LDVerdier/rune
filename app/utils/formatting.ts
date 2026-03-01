/** Formats a signed rank number: +1, 0, -2, etc. */
export function formatRank(rank: number): string {
  if (rank > 0) return `+${rank}`;
  return String(rank);
}

/** Tailwind text-color class for a characteristic rank (-3 … +3). */
export function charRankColor(rank: number): string {
  if (rank === -3) return "text-red-500";
  if (rank === -2) return "text-orange-400";
  if (rank === -1) return "text-yellow-400";
  if (rank === 0) return "text-gray-400";
  if (rank === 1) return "text-green-400";
  if (rank === 2) return "text-green-500";
  return "text-green-600";
}

/** Tailwind text-color class for an ability rank (0 … +3). */
export function abilityRankColor(rank: number): string {
  if (rank === 0) return "text-gray-400";
  if (rank === 1) return "text-green-400";
  if (rank === 2) return "text-green-500";
  return "text-green-600";
}
