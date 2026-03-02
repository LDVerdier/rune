import { describe, it, expect } from "vitest";
import {
  computeMeleeAttack,
  computeMissileAttack,
  computeUnarmedAttack,
  computeAllAttacks,
  computeArmedDefense,
  computeUnarmedDefense,
  computeAllDefenses,
  computeArmedDamage,
  computeMissileDamage,
  computeUnarmedDamage,
  computeAllDamages,
} from "./combat-scores";
import { INITIAL_ABILITY_RANKS } from "./abilities";
import { WEAPONS, SHIELDS } from "./equipment";

const dagger = WEAPONS.find((w) => w.id === "dagger")!;
const vikingAxe = WEAPONS.find((w) => w.id === "vikingAxe")!;
const shortBow = WEAPONS.find((w) => w.id === "shortBow")!;
const sling = WEAPONS.find((w) => w.id === "sling")!;
const buckler = SHIELDS.find((s) => s.id === "buckler")!;
const kiteShield = SHIELDS.find((s) => s.id === "kiteShield")!;

// ---------------------------------------------------------------------------
// Attack
// ---------------------------------------------------------------------------

describe("computeMeleeAttack", () => {
  it("computes basic melee attack without modifiers", () => {
    // Dex 2 + SingleWeapon 1 + dagger atk 1 + 0 - 0 = 4
    const ranks = { ...INITIAL_ABILITY_RANKS, SingleWeapon: 1 };
    const result = computeMeleeAttack(2, ranks, dagger, null, 0);
    expect(result.score).toBe(4);
    expect(result.kind).toBe("melee");
    expect(result.weaponId).toBe("dagger");
    expect(result.hasMissingAbilityPenalty).toBe(false);
  });

  it("applies missing ability penalty when rank is 0", () => {
    // Dex 0 + (-3) + dagger atk 1 + 0 - 0 = -2
    const result = computeMeleeAttack(0, INITIAL_ABILITY_RANKS, dagger, null, 0);
    expect(result.score).toBe(-2);
    expect(result.hasMissingAbilityPenalty).toBe(true);
  });

  it("includes shield atk modifier", () => {
    // Dex 1 + SingleWeapon 2 + dagger atk 1 + kiteShield atk (-1) - 0 = 3
    const ranks = { ...INITIAL_ABILITY_RANKS, SingleWeapon: 2 };
    const result = computeMeleeAttack(1, ranks, dagger, kiteShield, 0);
    expect(result.score).toBe(3);
  });

  it("subtracts encumbrance decrease", () => {
    // Dex 1 + SingleWeapon 1 + dagger atk 1 + 0 - 3 = 0
    const ranks = { ...INITIAL_ABILITY_RANKS, SingleWeapon: 1 };
    const result = computeMeleeAttack(1, ranks, dagger, null, 3);
    expect(result.score).toBe(0);
  });
});

describe("computeMissileAttack", () => {
  it("uses perception for missile attack", () => {
    // Per 3 + Bows 2 + shortBow atk 0 + 0 - 0 = 5
    const ranks = { ...INITIAL_ABILITY_RANKS, Bows: 2 };
    const result = computeMissileAttack(3, ranks, shortBow, null, 0);
    expect(result.score).toBe(5);
    expect(result.kind).toBe("missile");
    expect(result.weaponId).toBe("shortBow");
    expect(result.hasMissingAbilityPenalty).toBe(false);
  });

  it("applies missing ability penalty when rank is 0", () => {
    // Per 0 + (-3) + shortBow atk 0 + 0 - 0 = -3
    const result = computeMissileAttack(0, INITIAL_ABILITY_RANKS, shortBow, null, 0);
    expect(result.score).toBe(-3);
    expect(result.hasMissingAbilityPenalty).toBe(true);
  });

  it("includes shield atk modifier", () => {
    // Per 1 + ThrownWeapon 1 + sling atk 2 + buckler atk 0 - 0 = 4
    const ranks = { ...INITIAL_ABILITY_RANKS, ThrownWeapon: 1 };
    const result = computeMissileAttack(1, ranks, sling, buckler, 0);
    expect(result.score).toBe(4);
  });
});

describe("computeUnarmedAttack", () => {
  it("computes unarmed attack with Brawling", () => {
    // Dex 2 + Brawling 1 + fistKick atk 0 + 0 - 0 = 3
    const ranks = { ...INITIAL_ABILITY_RANKS, Brawling: 1 };
    const result = computeUnarmedAttack(2, ranks, null, 0);
    expect(result.score).toBe(3);
    expect(result.kind).toBe("unarmed");
    expect(result.weaponId).toBeNull();
    expect(result.hasMissingAbilityPenalty).toBe(false);
  });

  it("applies penalty when Brawling is 0", () => {
    // Dex 0 + (-3) + fistKick atk 0 + 0 - 0 = -3
    const result = computeUnarmedAttack(0, INITIAL_ABILITY_RANKS, null, 0);
    expect(result.score).toBe(-3);
    expect(result.hasMissingAbilityPenalty).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Defense
// ---------------------------------------------------------------------------

describe("computeArmedDefense", () => {
  it("computes basic armed defense", () => {
    // Qik 2 + SingleWeapon 1 + dagger dfn 2 + 0 - 0 = 5
    const ranks = { ...INITIAL_ABILITY_RANKS, SingleWeapon: 1 };
    const result = computeArmedDefense(2, ranks, dagger, null, 0);
    expect(result.score).toBe(5);
    expect(result.kind).toBe("armed");
    expect(result.weaponId).toBe("dagger");
    expect(result.hasMissingAbilityPenalty).toBe(false);
  });

  it("applies missing ability penalty when rank is 0", () => {
    // Qik 0 + (-3) + dagger dfn 2 + 0 - 0 = -1
    const result = computeArmedDefense(0, INITIAL_ABILITY_RANKS, dagger, null, 0);
    expect(result.score).toBe(-1);
    expect(result.hasMissingAbilityPenalty).toBe(true);
  });

  it("includes shield dfn modifier", () => {
    // Qik 1 + GreatWeapon 2 + vikingAxe dfn 4 + kiteShield dfn 4 - 0 = 11
    const ranks = { ...INITIAL_ABILITY_RANKS, GreatWeapon: 2 };
    const result = computeArmedDefense(1, ranks, vikingAxe, kiteShield, 0);
    expect(result.score).toBe(11);
  });

  it("subtracts encumbrance decrease", () => {
    // Qik 1 + SingleWeapon 1 + dagger dfn 2 + 0 - 3 = 1
    const ranks = { ...INITIAL_ABILITY_RANKS, SingleWeapon: 1 };
    const result = computeArmedDefense(1, ranks, dagger, null, 3);
    expect(result.score).toBe(1);
  });
});

describe("computeUnarmedDefense", () => {
  it("computes unarmed defense with Brawling", () => {
    // Qik 2 + Brawling 1 + fistKick dfn 0 + 0 - 0 = 3
    const ranks = { ...INITIAL_ABILITY_RANKS, Brawling: 1 };
    const result = computeUnarmedDefense(2, ranks, null, 0);
    expect(result.score).toBe(3);
    expect(result.kind).toBe("unarmed");
    expect(result.weaponId).toBeNull();
    expect(result.hasMissingAbilityPenalty).toBe(false);
  });

  it("applies penalty when Brawling is 0", () => {
    // Qik 0 + (-3) + fistKick dfn 0 + 0 - 0 = -3
    const result = computeUnarmedDefense(0, INITIAL_ABILITY_RANKS, null, 0);
    expect(result.score).toBe(-3);
    expect(result.hasMissingAbilityPenalty).toBe(true);
  });

  it("includes shield dfn modifier", () => {
    // Qik 1 + Brawling 2 + fistKick dfn 0 + buckler dfn 2 - 0 = 5
    const ranks = { ...INITIAL_ABILITY_RANKS, Brawling: 2 };
    const result = computeUnarmedDefense(1, ranks, buckler, 0);
    expect(result.score).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// Damage
// ---------------------------------------------------------------------------

describe("computeArmedDamage", () => {
  it("computes damage as Str + weapon dam", () => {
    // Str 2 + dagger dam 3 = 5
    const result = computeArmedDamage(2, dagger);
    expect(result.score).toBe(5);
    expect(result.kind).toBe("armed");
    expect(result.weaponId).toBe("dagger");
  });

  it("works with negative strength", () => {
    // Str -2 + vikingAxe dam 10 = 8
    const result = computeArmedDamage(-2, vikingAxe);
    expect(result.score).toBe(8);
  });
});

describe("computeMissileDamage", () => {
  it("computes missile damage as weapon dam only (no Str)", () => {
    // shortBow dam 6
    const result = computeMissileDamage(shortBow);
    expect(result.score).toBe(6);
    expect(result.kind).toBe("missile");
    expect(result.weaponId).toBe("shortBow");
  });

  it("computes thrown weapon damage", () => {
    // sling dam 3
    const result = computeMissileDamage(sling);
    expect(result.score).toBe(3);
    expect(result.kind).toBe("missile");
  });
});

describe("computeUnarmedDamage", () => {
  it("computes unarmed damage as Str + 0", () => {
    // Str 1 + fistKick dam 0 = 1
    const result = computeUnarmedDamage(1);
    expect(result.score).toBe(1);
    expect(result.kind).toBe("unarmed");
    expect(result.weaponId).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Aggregators
// ---------------------------------------------------------------------------

describe("computeAllAttacks", () => {
  it("returns unarmed only when no weapons selected", () => {
    const result = computeAllAttacks(0, 0, INITIAL_ABILITY_RANKS, [], null, 0);
    expect(result).toHaveLength(1);
    expect(result[0].kind).toBe("unarmed");
  });

  it("classifies melee vs missile correctly", () => {
    const result = computeAllAttacks(
      0,
      0,
      INITIAL_ABILITY_RANKS,
      ["dagger", "shortBow"],
      null,
      0,
    );
    expect(result).toHaveLength(3);
    expect(result[0].kind).toBe("melee");
    expect(result[0].weaponId).toBe("dagger");
    expect(result[1].kind).toBe("missile");
    expect(result[1].weaponId).toBe("shortBow");
    expect(result[2].kind).toBe("unarmed");
  });

  it("returns armed entries before unarmed", () => {
    const result = computeAllAttacks(
      0,
      0,
      INITIAL_ABILITY_RANKS,
      ["vikingAxe"],
      null,
      0,
    );
    expect(result).toHaveLength(2);
    expect(result[0].kind).toBe("melee");
    expect(result[1].kind).toBe("unarmed");
  });
});

describe("computeAllDefenses", () => {
  it("returns unarmed only when no weapons selected", () => {
    const result = computeAllDefenses(0, INITIAL_ABILITY_RANKS, [], null, 0);
    expect(result).toHaveLength(1);
    expect(result[0].kind).toBe("unarmed");
  });

  it("filters out weapons with dfn === null", () => {
    // shortBow has dfn: null, dagger has dfn: 2
    const result = computeAllDefenses(
      0,
      INITIAL_ABILITY_RANKS,
      ["dagger", "shortBow"],
      null,
      0,
    );
    expect(result).toHaveLength(2); // dagger + unarmed (shortBow excluded)
    expect(result[0].kind).toBe("armed");
    expect(result[0].weaponId).toBe("dagger");
    expect(result[1].kind).toBe("unarmed");
  });

  it("includes all weapons with numeric dfn", () => {
    const result = computeAllDefenses(
      0,
      INITIAL_ABILITY_RANKS,
      ["dagger", "vikingAxe"],
      null,
      0,
    );
    expect(result).toHaveLength(3); // dagger + vikingAxe + unarmed
  });
});

describe("computeAllDamages", () => {
  it("returns unarmed only when no weapons selected", () => {
    const result = computeAllDamages(0, []);
    expect(result).toHaveLength(1);
    expect(result[0].kind).toBe("unarmed");
  });

  it("includes missile weapons with weapon dam only", () => {
    // shortBow is Bows (missile), dagger is Single (melee)
    const result = computeAllDamages(2, ["dagger", "shortBow"]);
    expect(result).toHaveLength(3); // dagger + shortBow + unarmed
    expect(result[0].kind).toBe("armed");
    expect(result[0].weaponId).toBe("dagger");
    expect(result[0].score).toBe(5); // Str 2 + dagger dam 3
    expect(result[1].kind).toBe("missile");
    expect(result[1].weaponId).toBe("shortBow");
    expect(result[1].score).toBe(6); // shortBow dam 6 (no Str)
    expect(result[2].kind).toBe("unarmed");
  });

  it("includes thrown weapons with weapon dam only", () => {
    // sling is Thrown (missile), dam 3
    const result = computeAllDamages(2, ["sling"]);
    expect(result).toHaveLength(2); // sling + unarmed
    expect(result[0].kind).toBe("missile");
    expect(result[0].score).toBe(3); // sling dam 3 (no Str)
    expect(result[1].kind).toBe("unarmed");
    expect(result[1].score).toBe(2); // Str 2 + 0
  });

  it("computes correct melee damage values", () => {
    // Str 2 + dagger dam 3 = 5
    const result = computeAllDamages(2, ["dagger"]);
    expect(result[0].score).toBe(5);
    expect(result[1].score).toBe(2); // unarmed: Str 2 + 0
  });

  it("excludes weapons with special damage", () => {
    // barbNet has dam: "special" — should be filtered out
    const result = computeAllDamages(2, ["barbNet"]);
    expect(result).toHaveLength(1);
    expect(result[0].kind).toBe("unarmed");
  });
});
