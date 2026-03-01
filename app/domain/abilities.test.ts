import { describe, expect, it } from "vitest";
import {
  ABILITIES,
  ABILITY_MAX_RANK,
  ABILITY_MIN_RANK,
  INITIAL_ABILITY_RANKS,
  abilityNextCost,
  abilityPointsSpent,
  abilityPrevRefund,
  abilitiesBySet,
  canDecreaseAbility,
  canIncreaseAbility,
  tryChangeAbilityRank,
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

describe("tryChangeAbilityRank", () => {
  it("returns null when exceeding max rank", () => {
    const ranks = { ...INITIAL_ABILITY_RANKS, Bows: ABILITY_MAX_RANK };
    expect(tryChangeAbilityRank(ranks, "Bows", 1, 60)).toBeNull();
  });

  it("returns null when going below min rank", () => {
    const ranks = { ...INITIAL_ABILITY_RANKS, Bows: ABILITY_MIN_RANK };
    expect(tryChangeAbilityRank(ranks, "Bows", -1, 60)).toBeNull();
  });

  it("returns null when move exceeds budget", () => {
    // Bows is Primary (cost 2 per rank), budget is 1
    expect(tryChangeAbilityRank(INITIAL_ABILITY_RANKS, "Bows", 1, 1)).toBeNull();
  });

  it("returns null for unknown ability", () => {
    expect(tryChangeAbilityRank(INITIAL_ABILITY_RANKS, "FakeAbility", 1, 60)).toBeNull();
  });

  it("returns valid new state on a legal increase", () => {
    const result = tryChangeAbilityRank(INITIAL_ABILITY_RANKS, "Bows", 1, 60);
    expect(result).not.toBeNull();
    expect(result!.Bows).toBe(1);
    expect(result!.Balance).toBe(0);
  });

  it("returns valid new state on a legal decrease", () => {
    const ranks = { ...INITIAL_ABILITY_RANKS, Balance: 2 };
    const result = tryChangeAbilityRank(ranks, "Balance", -1, 60);
    expect(result).not.toBeNull();
    expect(result!.Balance).toBe(1);
  });

  it("accounts for already-spent points in budget", () => {
    // Spend 4 pts on Bows (Primary, rank 2), budget is 5 → 1 remaining
    const ranks = { ...INITIAL_ABILITY_RANKS, Bows: 2 };
    // Balance is Secondary (cost 1) — should succeed with 1 remaining
    expect(tryChangeAbilityRank(ranks, "Balance", 1, 5)).not.toBeNull();
    // Awareness is Primary (cost 2) — should fail with 1 remaining
    expect(tryChangeAbilityRank(ranks, "Awareness", 1, 5)).toBeNull();
  });
});

describe("canIncreaseAbility", () => {
  it("returns false at max rank", () => {
    const ranks = { ...INITIAL_ABILITY_RANKS, Bows: ABILITY_MAX_RANK };
    expect(canIncreaseAbility(ranks, "Bows", 60)).toBe(false);
  });

  it("returns false when insufficient budget", () => {
    expect(canIncreaseAbility(INITIAL_ABILITY_RANKS, "Bows", 1)).toBe(false);
  });

  it("returns true when affordable", () => {
    expect(canIncreaseAbility(INITIAL_ABILITY_RANKS, "Bows", 60)).toBe(true);
  });

  it("returns false for unknown ability", () => {
    expect(canIncreaseAbility(INITIAL_ABILITY_RANKS, "FakeAbility", 60)).toBe(false);
  });
});

describe("canDecreaseAbility", () => {
  it("returns false at min rank", () => {
    expect(canDecreaseAbility(INITIAL_ABILITY_RANKS, "Bows")).toBe(false);
  });

  it("returns true above min rank", () => {
    const ranks = { ...INITIAL_ABILITY_RANKS, Bows: 1 };
    expect(canDecreaseAbility(ranks, "Bows")).toBe(true);
  });
});

describe("abilityNextCost / abilityPrevRefund", () => {
  it("returns 2 for Primary abilities", () => {
    expect(abilityNextCost("Bows")).toBe(2);
    expect(abilityPrevRefund("Bows")).toBe(2);
  });

  it("returns 1 for Secondary abilities", () => {
    expect(abilityNextCost("Balance")).toBe(1);
    expect(abilityPrevRefund("Balance")).toBe(1);
  });

  it("returns null for unknown ability", () => {
    expect(abilityNextCost("FakeAbility")).toBeNull();
    expect(abilityPrevRefund("FakeAbility")).toBeNull();
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
