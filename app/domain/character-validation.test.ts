import { describe, it, expect } from "vitest";
import { validateCharacter } from "./character-validation";
import type { CharacterData } from "./character";
import { INITIAL_RANKS } from "./character-stats";
import { INITIAL_ABILITY_RANKS } from "./abilities";

function makeValid(overrides?: Partial<CharacterData>): CharacterData {
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

describe("validateCharacter", () => {
  it("accepts a valid default character", () => {
    const result = validateCharacter(makeValid());
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("accepts a character with some points spent", () => {
    const result = validateCharacter(
      makeValid({
        characteristicRanks: { ...INITIAL_RANKS, Strength: 2, Stamina: 1 },
        selectedWeapons: ["vikingBroadsword"],
        selectedShield: "roundShield",
        selectedArmor: "heavyLeather",
      }),
    );
    expect(result.valid).toBe(true);
  });

  it("rejects characteristic rank out of bounds", () => {
    const result = validateCharacter(
      makeValid({
        characteristicRanks: { ...INITIAL_RANKS, Strength: 5 },
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("Strength rank out of bounds");
  });

  it("rejects ability rank out of bounds", () => {
    const result = validateCharacter(
      makeValid({
        abilityRanks: { ...INITIAL_ABILITY_RANKS, Brawling: 5 },
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("Brawling rank out of bounds");
  });

  it("rejects budget exceeded", () => {
    const result = validateCharacter(
      makeValid({
        characteristicRanks: {
          ...INITIAL_RANKS,
          Strength: 3,
          Stamina: 3,
          Dexterity: 3,
          Quickness: 3,
        },
        extraHpPoints: 10,
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Budget exceeded"))).toBe(true);
  });

  it("rejects too many weapons", () => {
    const result = validateCharacter(
      makeValid({
        selectedWeapons: [
          "dagger",
          "mace",
          "shortBow",
          "vikingBroadsword",
        ],
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("Too many weapons");
  });

  it("rejects unknown weapon ID", () => {
    const result = validateCharacter(
      makeValid({ selectedWeapons: ["unknownWeapon"] }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("Unknown weapon");
  });

  it("rejects unknown shield ID", () => {
    const result = validateCharacter(
      makeValid({ selectedShield: "unknownShield" }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("Unknown shield");
  });

  it("rejects unknown armor ID", () => {
    const result = validateCharacter(
      makeValid({ selectedArmor: "unknownArmor" }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("Unknown armor");
  });

  it("rejects negative extra HP", () => {
    const result = validateCharacter(makeValid({ extraHpPoints: -1 }));
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("Extra HP points negative");
  });

  it("rejects invalid gender", () => {
    const result = validateCharacter(
      makeValid({ gender: "other" as "male" }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("Invalid gender");
  });
});
