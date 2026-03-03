import { describe, it, expect } from "vitest";
import { effectiveAbilityScore, MISSING_ABILITY_PENALTY } from "./ability-check";
import {
  computeArmedInitiative,
  computeUnarmedInitiative,
  computeNonCombatInitiative,
  computeShieldInitiative,
  computeAllInitiatives,
} from "./initiative";
import { INITIAL_ABILITY_RANKS } from "./abilities";
import { WEAPONS, SHIELDS, ARMORS } from "./equipment";

const dagger = WEAPONS.find((w) => w.id === "dagger")!;
const vikingAxe = WEAPONS.find((w) => w.id === "vikingAxe")!;
const shortBow = WEAPONS.find((w) => w.id === "shortBow")!;
const buckler = SHIELDS.find((s) => s.id === "buckler")!;
const kiteShield = SHIELDS.find((s) => s.id === "kiteShield")!;
const heavyLeather = ARMORS.find((a) => a.id === "heavyLeather")!;
const chainMail = ARMORS.find((a) => a.id === "chainMail")!;

describe("effectiveAbilityScore", () => {
  it("returns the rank when rank > 0", () => {
    expect(effectiveAbilityScore(1)).toBe(1);
    expect(effectiveAbilityScore(2)).toBe(2);
    expect(effectiveAbilityScore(3)).toBe(3);
  });

  it("returns -3 when rank is 0", () => {
    expect(effectiveAbilityScore(0)).toBe(MISSING_ABILITY_PENALTY);
  });
});

describe("computeArmedInitiative", () => {
  it("computes basic armed initiative without equipment modifiers", () => {
    // Qik 2 + SingleWeapon 1 + dagger init 2 + 0 + 0 - 0 = 5
    const ranks = { ...INITIAL_ABILITY_RANKS, SingleWeapon: 1 };
    const result = computeArmedInitiative(2, ranks, dagger, null, null, 0);
    expect(result.score).toBe(5);
    expect(result.kind).toBe("armed");
    expect(result.weaponId).toBe("dagger");
    expect(result.hasMissingAbilityPenalty).toBe(false);
  });

  it("applies missing ability penalty when rank is 0", () => {
    // Qik 0 + (-3) + dagger init 2 + 0 + 0 - 0 = -1
    const result = computeArmedInitiative(
      0,
      INITIAL_ABILITY_RANKS,
      dagger,
      null,
      null,
      0,
    );
    expect(result.score).toBe(-1);
    expect(result.hasMissingAbilityPenalty).toBe(true);
  });

  it("includes armor and shield init modifiers", () => {
    // Qik 1 + GreatWeapon 2 + vikingAxe init 5 + heavyLeather init (-1) + kiteShield init (-1) - 0 = 6
    const ranks = { ...INITIAL_ABILITY_RANKS, GreatWeapon: 2 };
    const result = computeArmedInitiative(
      1,
      ranks,
      vikingAxe,
      heavyLeather,
      kiteShield,
      0,
    );
    expect(result.score).toBe(6);
  });

  it("subtracts encumbrance decrease", () => {
    // Qik 1 + SingleWeapon 1 + dagger init 2 + 0 + 0 - 3 = 1
    const ranks = { ...INITIAL_ABILITY_RANKS, SingleWeapon: 1 };
    const result = computeArmedInitiative(1, ranks, dagger, null, null, 3);
    expect(result.score).toBe(1);
  });

  it("uses the correct ability for bows", () => {
    // Qik 0 + Bows 3 + shortBow init 0 + 0 + 0 - 0 = 3
    const ranks = { ...INITIAL_ABILITY_RANKS, Bows: 3 };
    const result = computeArmedInitiative(0, ranks, shortBow, null, null, 0);
    expect(result.score).toBe(3);
    expect(result.hasMissingAbilityPenalty).toBe(false);
  });
});

describe("computeUnarmedInitiative", () => {
  it("computes unarmed initiative with Brawling", () => {
    // Qik 2 + Brawling 1 + fistKick init 1 + 0 + 0 - 0 = 4
    const ranks = { ...INITIAL_ABILITY_RANKS, Brawling: 1 };
    const result = computeUnarmedInitiative(2, ranks, null, null, 0);
    expect(result.score).toBe(4);
    expect(result.kind).toBe("unarmed");
    expect(result.weaponId).toBeNull();
    expect(result.hasMissingAbilityPenalty).toBe(false);
  });

  it("applies penalty when Brawling is 0", () => {
    // Qik 0 + (-3) + fistKick init 1 + 0 + 0 - 0 = -2
    const result = computeUnarmedInitiative(
      0,
      INITIAL_ABILITY_RANKS,
      null,
      null,
      0,
    );
    expect(result.score).toBe(-2);
    expect(result.hasMissingAbilityPenalty).toBe(true);
  });

  it("includes armor, shield, and encumbrance", () => {
    // Qik 1 + Brawling 2 + fistKick init 1 + chainMail init (-5) + buckler init 0 - 1 = -2
    const ranks = { ...INITIAL_ABILITY_RANKS, Brawling: 2 };
    const result = computeUnarmedInitiative(1, ranks, chainMail, buckler, 1);
    expect(result.score).toBe(-2);
  });
});

describe("computeNonCombatInitiative", () => {
  it("computes non-combat initiative with Sprint", () => {
    // Qik 3 + Sprint 2 + 0 + 0 - 0 = 5
    const ranks = { ...INITIAL_ABILITY_RANKS, Sprint: 2 };
    const result = computeNonCombatInitiative(3, ranks, null, null, 0);
    expect(result.score).toBe(5);
    expect(result.kind).toBe("nonCombat");
    expect(result.weaponId).toBeNull();
    expect(result.hasMissingAbilityPenalty).toBe(false);
  });

  it("applies penalty when Sprint is 0", () => {
    // Qik 1 + (-3) + 0 + 0 - 0 = -2
    const result = computeNonCombatInitiative(
      1,
      INITIAL_ABILITY_RANKS,
      null,
      null,
      0,
    );
    expect(result.score).toBe(-2);
    expect(result.hasMissingAbilityPenalty).toBe(true);
  });

  it("includes armor, shield, and encumbrance", () => {
    // Qik 2 + Sprint 1 + heavyLeather init (-1) + kiteShield init (-1) - 3 = -2
    const ranks = { ...INITIAL_ABILITY_RANKS, Sprint: 1 };
    const result = computeNonCombatInitiative(
      2,
      ranks,
      heavyLeather,
      kiteShield,
      3,
    );
    expect(result.score).toBe(-2);
  });
});

describe("computeShieldInitiative", () => {
  it("computes shield initiative without extra shield modifier", () => {
    // Qik 2 + SingleWeapon 1 + buckler init 0 + 0 - 0 = 3
    const ranks = { ...INITIAL_ABILITY_RANKS, SingleWeapon: 1 };
    const result = computeShieldInitiative(2, ranks, buckler, null, 0);
    expect(result.score).toBe(3);
    expect(result.kind).toBe("armed");
    expect(result.weaponId).toBe("buckler");
    expect(result.hasMissingAbilityPenalty).toBe(false);
  });

  it("applies missing ability penalty when rank is 0", () => {
    // Qik 0 + (-3) + kiteShield init (-1) + 0 - 0 = -4
    const result = computeShieldInitiative(0, INITIAL_ABILITY_RANKS, kiteShield, null, 0);
    expect(result.score).toBe(-4);
    expect(result.hasMissingAbilityPenalty).toBe(true);
  });

  it("includes armor and encumbrance", () => {
    // Qik 1 + SingleWeapon 2 + kiteShield init (-1) + chainMail init (-5) - 1 = -4
    const ranks = { ...INITIAL_ABILITY_RANKS, SingleWeapon: 2 };
    const result = computeShieldInitiative(1, ranks, kiteShield, chainMail, 1);
    expect(result.score).toBe(-4);
  });
});

describe("computeAllInitiatives", () => {
  it("returns unarmed and nonCombat when no weapons selected", () => {
    const result = computeAllInitiatives(
      0,
      INITIAL_ABILITY_RANKS,
      [],
      null,
      null,
      0,
    );
    expect(result).toHaveLength(2);
    expect(result[0].kind).toBe("unarmed");
    expect(result[1].kind).toBe("nonCombat");
  });

  it("returns armed entries before unarmed and nonCombat", () => {
    const result = computeAllInitiatives(
      0,
      INITIAL_ABILITY_RANKS,
      ["dagger", "shortBow"],
      null,
      null,
      0,
    );
    expect(result).toHaveLength(4);
    expect(result[0].kind).toBe("armed");
    expect(result[0].weaponId).toBe("dagger");
    expect(result[1].kind).toBe("armed");
    expect(result[1].weaponId).toBe("shortBow");
    expect(result[2].kind).toBe("unarmed");
    expect(result[3].kind).toBe("nonCombat");
  });

  it("passes armor and shield to all scores", () => {
    const ranks = { ...INITIAL_ABILITY_RANKS, SingleWeapon: 1 };
    const result = computeAllInitiatives(
      0,
      ranks,
      ["dagger"],
      "kiteShield",
      "chainMail",
      0,
    );
    expect(result).toHaveLength(4);
    // Armed (dagger): 0 + 1 + 2 + (-5) + (-1) - 0 = -3
    expect(result[0].score).toBe(-3);
    expect(result[0].weaponId).toBe("dagger");
    // Shield (kiteShield): 0 + 1 + (-1) + (-5) - 0 = -5
    expect(result[1].score).toBe(-5);
    expect(result[1].weaponId).toBe("kiteShield");
    // Unarmed: 0 + (-3) + 1 + (-5) + (-1) - 0 = -8
    expect(result[2].score).toBe(-8);
    // NonCombat: 0 + (-3) + (-5) + (-1) - 0 = -9
    expect(result[3].score).toBe(-9);
  });
});
