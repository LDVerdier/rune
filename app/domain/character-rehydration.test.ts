import { describe, it, expect } from "vitest";
import { rehydrateCharacter } from "./character-rehydration";
import type { CharacterData } from "./character";
import { INITIAL_RANKS } from "./character-stats";
import { INITIAL_ABILITY_RANKS } from "./abilities";

function makeCharacter(overrides?: Partial<CharacterData>): CharacterData {
  return {
    heroName: "Ragnar",
    cognomen: "Lothbrok",
    gender: "male",
    characteristicRanks: { ...INITIAL_RANKS },
    abilityRanks: { ...INITIAL_ABILITY_RANKS },
    extraHpPoints: 0,
    selectedWeapons: [],
    selectedShield: null,
    selectedArmor: null,
    ...overrides,
  };
}

describe("rehydrateCharacter", () => {
  it("returns correct basic sheet data for default character", () => {
    const sheet = rehydrateCharacter(makeCharacter());
    expect(sheet.heroName).toBe("Ragnar");
    expect(sheet.cognomen).toBe("Lothbrok");
    expect(sheet.totalHP).toBe(22); // Str 0 + Sta 0 → 22
    expect(sheet.woundThreshold).toBe(9); // Sta 0 → 9
    expect(sheet.totalLoad).toBe(0);
    expect(sheet.encumbranceDegree).toBe("Light");
    expect(sheet.encumbranceDecrease).toBe(0);
    expect(sheet.soakScore).toBe(0); // Sta 0, no armor
    expect(sheet.moveScore).toBe(15); // Sprint 0 → 15
    expect(sheet.engagementScore).toBe(0); // Str 0, no abilities
    expect(sheet.responseScore).toBe(0);
  });

  it("computes HP with extra points and Stamina", () => {
    const sheet = rehydrateCharacter(
      makeCharacter({
        characteristicRanks: { ...INITIAL_RANKS, Stamina: 2, Strength: 1 },
        extraHpPoints: 3,
      }),
    );
    // Str 1 + Sta 2 = 3 → starting HP 24
    // Extra: 3 points × 6 HP/pt (Sta 2) = 18
    expect(sheet.totalHP).toBe(42);
    expect(sheet.woundThreshold).toBe(15); // Sta 2 → 15
  });

  it("includes weapon data in initiative/attack/defense/damage scores", () => {
    const sheet = rehydrateCharacter(
      makeCharacter({
        selectedWeapons: ["vikingBroadsword"],
        selectedShield: "roundShield",
        selectedArmor: "heavyLeather",
      }),
    );
    // Should have armed + shield + unarmed + nonCombat initiatives
    expect(sheet.initiativeScores.length).toBeGreaterThanOrEqual(4);
    expect(sheet.attackScores.length).toBeGreaterThanOrEqual(3);
    expect(sheet.defenseScores.length).toBeGreaterThanOrEqual(3);
    expect(sheet.damageScores.length).toBeGreaterThanOrEqual(3);
    expect(sheet.soakScore).toBe(3); // Sta 0 + heavyLeather prt 3
    expect(sheet.totalLoad).toBeGreaterThan(0);
  });

  it("preserves weapon/shield/armor selections", () => {
    const sheet = rehydrateCharacter(
      makeCharacter({
        selectedWeapons: ["dagger", "mace"],
        selectedShield: "buckler",
        selectedArmor: "chainMail",
      }),
    );
    expect(sheet.selectedWeapons).toEqual(["dagger", "mace"]);
    expect(sheet.selectedShield).toBe("buckler");
    expect(sheet.selectedArmor).toBe("chainMail");
  });
});
