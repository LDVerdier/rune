import { describe, expect, it } from "vitest";
import {
  BASE_POINTS,
  CHARACTERISTICS,
  INITIAL_RANKS,
  MAX_RANK,
  MIN_RANK,
  canIncrease,
  nextCost,
  pointsSpent,
  prevRefund,
  remainingPoints,
  tryChangeRank,
} from "./character-stats";
import type { Ranks } from "./character-stats";

describe("INITIAL_RANKS", () => {
  it("has all characteristics at zero", () => {
    for (const c of CHARACTERISTICS) {
      expect(INITIAL_RANKS[c]).toBe(0);
    }
  });

  it("has full points available", () => {
    expect(remainingPoints(INITIAL_RANKS)).toBe(BASE_POINTS);
    expect(pointsSpent(INITIAL_RANKS)).toBe(0);
  });
});

describe("tryChangeRank", () => {
  it("returns null when exceeding max rank", () => {
    const ranks: Ranks = { ...INITIAL_RANKS, Strength: MAX_RANK };
    expect(tryChangeRank(ranks, "Strength", 1)).toBeNull();
  });

  it("returns null when going below min rank", () => {
    const ranks: Ranks = { ...INITIAL_RANKS, Strength: MIN_RANK };
    expect(tryChangeRank(ranks, "Strength", -1)).toBeNull();
  });

  it("returns null when move exceeds remaining points", () => {
    // Strength at rank 2 costs 8, going to rank 3 costs 16 — delta is 8.
    // Set remaining to less than 8 by spending elsewhere.
    const ranks: Ranks = {
      ...INITIAL_RANKS,
      Strength: 2,    // costs 8
      Stamina: 3,     // costs 16
      Dexterity: 3,   // costs 16
      Quickness: 3,   // costs 16
    };
    // Total spent: 8 + 16 + 16 + 16 = 56, remaining = 4
    expect(remainingPoints(ranks)).toBe(4);
    // Increasing Strength from 2→3 costs 8, but only 4 remain
    expect(tryChangeRank(ranks, "Strength", 1)).toBeNull();
  });

  it("returns valid new state on a legal increase", () => {
    const result = tryChangeRank(INITIAL_RANKS, "Strength", 1);
    expect(result).not.toBeNull();
    expect(result!.Strength).toBe(1);
    // Other characteristics unchanged
    expect(result!.Stamina).toBe(0);
  });

  it("returns valid new state on a legal decrease", () => {
    const result = tryChangeRank(INITIAL_RANKS, "Intelligence", -1);
    expect(result).not.toBeNull();
    expect(result!.Intelligence).toBe(-1);
  });
});

describe("pointsSpent / remainingPoints", () => {
  it("computes correctly for mixed ranks", () => {
    const ranks: Ranks = {
      ...INITIAL_RANKS,
      Strength: 2,      // 8
      Intelligence: -2,  // -4
    };
    expect(pointsSpent(ranks)).toBe(4);
    expect(remainingPoints(ranks)).toBe(56);
  });
});

describe("canIncrease", () => {
  it("returns false at max rank", () => {
    const ranks: Ranks = { ...INITIAL_RANKS, Strength: MAX_RANK };
    expect(canIncrease(ranks, "Strength")).toBe(false);
  });

  it("returns false when insufficient points", () => {
    const ranks: Ranks = {
      ...INITIAL_RANKS,
      Strength: 2,
      Stamina: 3,
      Dexterity: 3,
      Quickness: 3,
    };
    // remaining = 4, cost to go Strength 2→3 = 8
    expect(canIncrease(ranks, "Strength")).toBe(false);
  });

  it("returns true when affordable", () => {
    expect(canIncrease(INITIAL_RANKS, "Strength")).toBe(true);
  });
});

describe("nextCost", () => {
  it("returns null at max rank", () => {
    const ranks: Ranks = { ...INITIAL_RANKS, Strength: MAX_RANK };
    expect(nextCost(ranks, "Strength")).toBeNull();
  });

  it("returns cost delta for next rank", () => {
    // Strength 0→1 costs 4
    expect(nextCost(INITIAL_RANKS, "Strength")).toBe(4);
  });
});

describe("prevRefund", () => {
  it("returns null at min rank", () => {
    const ranks: Ranks = { ...INITIAL_RANKS, Strength: MIN_RANK };
    expect(prevRefund(ranks, "Strength")).toBeNull();
  });

  it("returns refund amount for previous rank", () => {
    const ranks: Ranks = { ...INITIAL_RANKS, Strength: 1 };
    // Strength rank 1 costs 4, rank 0 costs 0 — refund is 4
    expect(prevRefund(ranks, "Strength")).toBe(4);
  });

  it("returns correct refund for negative ranks", () => {
    const ranks: Ranks = { ...INITIAL_RANKS, Presence: 0 };
    // Presence rank 0 costs 0, rank -1 costs -2 — refund is 2
    expect(prevRefund(ranks, "Presence")).toBe(2);
  });
});
