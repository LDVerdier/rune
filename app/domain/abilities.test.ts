import { describe, expect, it } from "vitest";
import {
  ABILITIES,
  ABILITY_MAX_RANK,
  ABILITY_MIN_RANK,
  INITIAL_ABILITY_RANKS,
  nextCost,
  abilityPointsSpent,
  prevRefund,
  abilitiesBySet,
  canDecrease,
  canIncrease,
  tryChangeRank,
} from "./abilities";

describe("INITIAL_ABILITY_RANKS", () => {
  it("has all abilities at zero", () => {
    for (const a of ABILITIES) {
      expect(INITIAL_ABILITY_RANKS[a.name]).toBe(0);
    }
  });

  it("has zero points spent", () => {
    expect(abilityPointsSpent(INITIAL_ABILITY_RANKS)).toBe(0);
  });
});

describe("abilityPointsSpent", () => {
  it("computes correctly for mixed Primary and Secondary ranks", () => {
    const ranks = {
      ...INITIAL_ABILITY_RANKS,
      Bows: 2,       // Primary: 2 * 2 = 4
      Balance: 3,    // Secondary: 3 * 1 = 3
      Awareness: 1,  // Primary: 1 * 2 = 2
    };
    expect(abilityPointsSpent(ranks)).toBe(9);
  });
});

describe("tryChangeRank", () => {
  it("returns null when exceeding max rank", () => {
    const ranks = { ...INITIAL_ABILITY_RANKS, Bows: ABILITY_MAX_RANK };
    expect(tryChangeRank(ranks, "Bows", 1, 60)).toBeNull();
  });

  it("returns null when going below min rank", () => {
    const ranks = { ...INITIAL_ABILITY_RANKS, Bows: ABILITY_MIN_RANK };
    expect(tryChangeRank(ranks, "Bows", -1, 60)).toBeNull();
  });

  it("returns null when move exceeds budget", () => {
    // Bows is Primary (cost 2 per rank), budget is 1
    expect(tryChangeRank(INITIAL_ABILITY_RANKS, "Bows", 1, 1)).toBeNull();
  });

  it("returns null for unknown ability", () => {
    expect(tryChangeRank(INITIAL_ABILITY_RANKS, "FakeAbility", 1, 60)).toBeNull();
  });

  it("returns valid new state on a legal increase", () => {
    const result = tryChangeRank(INITIAL_ABILITY_RANKS, "Bows", 1, 60);
    expect(result).not.toBeNull();
    expect(result!.Bows).toBe(1);
    expect(result!.Balance).toBe(0);
  });

  it("returns valid new state on a legal decrease", () => {
    const ranks = { ...INITIAL_ABILITY_RANKS, Balance: 2 };
    const result = tryChangeRank(ranks, "Balance", -1, 60);
    expect(result).not.toBeNull();
    expect(result!.Balance).toBe(1);
  });

  it("accounts for already-spent points in budget", () => {
    // Spend 4 pts on Bows (Primary, rank 2), budget is 5 → 1 remaining
    const ranks = { ...INITIAL_ABILITY_RANKS, Bows: 2 };
    // Balance is Secondary (cost 1) — should succeed with 1 remaining
    expect(tryChangeRank(ranks, "Balance", 1, 5)).not.toBeNull();
    // Awareness is Primary (cost 2) — should fail with 1 remaining
    expect(tryChangeRank(ranks, "Awareness", 1, 5)).toBeNull();
  });
});

describe("canIncrease", () => {
  it("returns false at max rank", () => {
    const ranks = { ...INITIAL_ABILITY_RANKS, Bows: ABILITY_MAX_RANK };
    expect(canIncrease(ranks, "Bows", 60)).toBe(false);
  });

  it("returns false when insufficient budget", () => {
    expect(canIncrease(INITIAL_ABILITY_RANKS, "Bows", 1)).toBe(false);
  });

  it("returns true when affordable", () => {
    expect(canIncrease(INITIAL_ABILITY_RANKS, "Bows", 60)).toBe(true);
  });

  it("returns false for unknown ability", () => {
    expect(canIncrease(INITIAL_ABILITY_RANKS, "FakeAbility", 60)).toBe(false);
  });
});

describe("canDecrease", () => {
  it("returns false at min rank", () => {
    expect(canDecrease(INITIAL_ABILITY_RANKS, "Bows")).toBe(false);
  });

  it("returns true above min rank", () => {
    const ranks = { ...INITIAL_ABILITY_RANKS, Bows: 1 };
    expect(canDecrease(ranks, "Bows")).toBe(true);
  });
});

describe("nextCost / prevRefund", () => {
  it("returns 2 for Primary abilities", () => {
    expect(nextCost("Bows")).toBe(2);
    expect(prevRefund("Bows")).toBe(2);
  });

  it("returns 1 for Secondary abilities", () => {
    expect(nextCost("Balance")).toBe(1);
    expect(prevRefund("Balance")).toBe(1);
  });

  it("returns null for unknown ability", () => {
    expect(nextCost("FakeAbility")).toBeNull();
    expect(prevRefund("FakeAbility")).toBeNull();
  });
});

describe("abilitiesBySet", () => {
  it("groups abilities by their set", () => {
    const grouped = abilitiesBySet();
    expect(grouped.Fighting.length).toBe(8);
    expect(grouped.Miscellaneous.length).toBe(1);
    expect(grouped.Miscellaneous[0].name).toBe("DivineAwareness");
  });

  it("includes all abilities across groups", () => {
    const grouped = abilitiesBySet();
    const total =
      grouped.Fighting.length +
      grouped.Exploratory.length +
      grouped.Interaction.length +
      grouped.Miscellaneous.length;
    expect(total).toBe(ABILITIES.length);
  });
});
