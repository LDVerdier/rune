import { describe, it, expect } from "vitest";
import {
  computeSoak,
  computeMove,
  computeEngagement,
  computeResponse,
} from "./secondary-scores";
import { INITIAL_ABILITY_RANKS } from "./abilities";
import { INITIAL_RANKS } from "./character-stats";

// ---------------------------------------------------------------------------
// Soak
// ---------------------------------------------------------------------------

describe("computeSoak", () => {
  it("returns stamina alone when no armor selected", () => {
    expect(computeSoak(2, null)).toBe(2);
  });

  it("returns stamina + armor prt", () => {
    // quiltedFur prt = 1
    expect(computeSoak(1, "quiltedFur")).toBe(2);
  });

  it("works with heavy armor", () => {
    // chainMail prt = 7
    expect(computeSoak(0, "chainMail")).toBe(7);
  });

  it("works with negative stamina", () => {
    expect(computeSoak(-2, "heavyLeather")).toBe(1); // -2 + 3
  });

  it("returns stamina when armor id is unknown", () => {
    expect(computeSoak(1, "nonexistent")).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Move
// ---------------------------------------------------------------------------

describe("computeMove", () => {
  it("returns 15 paces for sprint rank 0", () => {
    expect(computeMove(0)).toBe(15);
  });

  it("returns 20 paces for sprint rank 1", () => {
    expect(computeMove(1)).toBe(20);
  });

  it("returns 25 paces for sprint rank 2", () => {
    expect(computeMove(2)).toBe(25);
  });

  it("returns 30 paces for sprint rank 3", () => {
    expect(computeMove(3)).toBe(30);
  });

  it("clamps to max when rank exceeds table", () => {
    expect(computeMove(5)).toBe(30);
  });

  it("clamps to min when rank is negative", () => {
    expect(computeMove(-1)).toBe(15);
  });
});

// ---------------------------------------------------------------------------
// Engagement
// ---------------------------------------------------------------------------

describe("computeEngagement", () => {
  it("returns strength alone when all melee abilities are 0", () => {
    expect(computeEngagement(2, INITIAL_ABILITY_RANKS)).toBe(2);
  });

  it("picks the best melee weapon ability", () => {
    const ranks = { ...INITIAL_ABILITY_RANKS, SingleWeapon: 1, GreatWeapon: 3 };
    // Str 1 + GreatWeapon 3 = 4
    expect(computeEngagement(1, ranks)).toBe(4);
  });

  it("ignores non-melee abilities (Bows, ThrownWeapon)", () => {
    const ranks = { ...INITIAL_ABILITY_RANKS, Bows: 3, ThrownWeapon: 2 };
    // Str 1 + best melee = 0
    expect(computeEngagement(1, ranks)).toBe(1);
  });

  it("includes Brawling as a melee ability", () => {
    const ranks = { ...INITIAL_ABILITY_RANKS, Brawling: 2 };
    expect(computeEngagement(0, ranks)).toBe(2);
  });

  it("includes TwoWeapons as a melee ability", () => {
    const ranks = { ...INITIAL_ABILITY_RANKS, TwoWeapons: 3 };
    expect(computeEngagement(1, ranks)).toBe(4);
  });

  it("works with negative strength", () => {
    const ranks = { ...INITIAL_ABILITY_RANKS, SingleWeapon: 2 };
    expect(computeEngagement(-1, ranks)).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Response
// ---------------------------------------------------------------------------

describe("computeResponse", () => {
  it("returns 0 when all characteristics and abilities are 0", () => {
    expect(computeResponse(INITIAL_RANKS, INITIAL_ABILITY_RANKS)).toBe(0);
  });

  it("picks the highest among all candidate modifiers", () => {
    // Per 0 + Awareness 0 = 0
    // Dex 0 + Balance 0 = 0
    // Sta 0 + Bravery 0 = 0
    // Qik 3 + Dodge 2 = 5  ← winner
    // Str 0 + Sprint 0 = 0
    // Engagement: Str 0 + 0 = 0
    const ranks = { ...INITIAL_RANKS, Quickness: 3 };
    const abilities = { ...INITIAL_ABILITY_RANKS, Dodge: 2 };
    expect(computeResponse(ranks, abilities)).toBe(5);
  });

  it("considers Awareness (Per + Awareness)", () => {
    const ranks = { ...INITIAL_RANKS, Perception: 2 };
    const abilities = { ...INITIAL_ABILITY_RANKS, Awareness: 3 };
    // Per 2 + Awareness 3 = 5
    expect(computeResponse(ranks, abilities)).toBe(5);
  });

  it("considers Balance (Dex + Balance)", () => {
    const ranks = { ...INITIAL_RANKS, Dexterity: 3 };
    const abilities = { ...INITIAL_ABILITY_RANKS, Balance: 2 };
    // Dex 3 + Balance 2 = 5
    expect(computeResponse(ranks, abilities)).toBe(5);
  });

  it("considers Bravery (Sta + Bravery)", () => {
    const ranks = { ...INITIAL_RANKS, Stamina: 2 };
    const abilities = { ...INITIAL_ABILITY_RANKS, Bravery: 3 };
    expect(computeResponse(ranks, abilities)).toBe(5);
  });

  it("considers Sprint (Str + Sprint)", () => {
    const ranks = { ...INITIAL_RANKS, Strength: 1 };
    const abilities = { ...INITIAL_ABILITY_RANKS, Sprint: 3 };
    expect(computeResponse(ranks, abilities)).toBe(4);
  });

  it("considers Engagement (Str + best melee ability)", () => {
    const ranks = { ...INITIAL_RANKS, Strength: 2 };
    const abilities = { ...INITIAL_ABILITY_RANKS, GreatWeapon: 3 };
    // Engagement = Str 2 + GreatWeapon 3 = 5
    // Sprint = Str 2 + Sprint 0 = 2
    expect(computeResponse(ranks, abilities)).toBe(5);
  });

  it("works with negative characteristics", () => {
    // All candidates negative, picks the least negative
    const ranks = {
      ...INITIAL_RANKS,
      Strength: -2,
      Stamina: -1,
      Dexterity: -3,
      Quickness: -2,
      Perception: -3,
    };
    // Awareness: -3 + 0 = -3
    // Balance: -3 + 0 = -3
    // Bravery: -1 + 0 = -1  ← winner
    // Dodge: -2 + 0 = -2
    // Sprint: -2 + 0 = -2
    // Engagement: -2 + 0 = -2
    expect(computeResponse(ranks, INITIAL_ABILITY_RANKS)).toBe(-1);
  });

  it("engagement can win over individual abilities", () => {
    const ranks = { ...INITIAL_RANKS, Strength: 3 };
    const abilities = {
      ...INITIAL_ABILITY_RANKS,
      SingleWeapon: 3, // Engagement = 3 + 3 = 6
      Dodge: 2,        // Dodge = Qik 0 + 2 = 2
    };
    expect(computeResponse(ranks, abilities)).toBe(6);
  });
});
