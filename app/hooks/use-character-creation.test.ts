import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCharacterCreation } from "./use-character-creation";
import { BASE_POINTS } from "~/domain/character-stats";
import { MAX_WEAPONS } from "~/domain/equipment";

describe("useCharacterCreation – initial state", () => {
  it("starts with all points available", () => {
    const { result } = renderHook(() => useCharacterCreation());
    expect(result.current.remainingPoints).toBe(BASE_POINTS);
  });

  it("starts with all characteristic ranks at 0", () => {
    const { result } = renderHook(() => useCharacterCreation());
    Object.values(result.current.ranks).forEach((r) => expect(r).toBe(0));
  });

  it("starts with all ability ranks at 0", () => {
    const { result } = renderHook(() => useCharacterCreation());
    Object.values(result.current.abilityRanks).forEach((r) => expect(r).toBe(0));
  });

  it("starts with totalHP of 22 (Str=0, Sta=0, no extra HP)", () => {
    const { result } = renderHook(() => useCharacterCreation());
    expect(result.current.totalHP).toBe(22);
  });

  it("starts with woundThreshold of 9 (Sta=0)", () => {
    const { result } = renderHook(() => useCharacterCreation());
    expect(result.current.woundThreshold).toBe(9);
  });

  it("starts with hpPerPoint of 4 (Sta=0)", () => {
    const { result } = renderHook(() => useCharacterCreation());
    expect(result.current.hpPerPoint).toBe(4);
  });

  it("starts with no equipment selected", () => {
    const { result } = renderHook(() => useCharacterCreation());
    expect(result.current.selectedWeapons).toEqual([]);
    expect(result.current.selectedShield).toBeNull();
    expect(result.current.selectedArmor).toBeNull();
  });
});

describe("useCharacterCreation – characteristic ranks", () => {
  it("increases a rank and deducts the cost", () => {
    const { result } = renderHook(() => useCharacterCreation());
    const cost = result.current.nextCost("Strength")!;

    act(() => result.current.changeRank("Strength", 1));

    expect(result.current.ranks.Strength).toBe(1);
    expect(result.current.remainingPoints).toBe(BASE_POINTS - cost);
  });

  it("decreases a rank and refunds the cost", () => {
    const { result } = renderHook(() => useCharacterCreation());
    act(() => result.current.changeRank("Strength", 1));
    act(() => result.current.changeRank("Strength", 1));

    const refund = result.current.prevRefund("Strength")!;
    const pointsBefore = result.current.remainingPoints;
    act(() => result.current.changeRank("Strength", -1));

    expect(result.current.ranks.Strength).toBe(1);
    expect(result.current.remainingPoints).toBe(pointsBefore + refund);
  });

  it("canIncrease returns false when no budget left", () => {
    const { result } = renderHook(() => useCharacterCreation());
    // Spend all points first by maxing a cheap characteristic
    act(() => result.current.changeRank("Strength", 1));
    act(() => result.current.changeRank("Strength", 1));
    act(() => result.current.changeRank("Strength", 1));
    act(() => result.current.changeRank("Stamina", 1));
    act(() => result.current.changeRank("Stamina", 1));
    act(() => result.current.changeRank("Stamina", 1));
    act(() => result.current.changeRank("Dexterity", 1));
    act(() => result.current.changeRank("Dexterity", 1));
    act(() => result.current.changeRank("Dexterity", 1));
    act(() => result.current.changeRank("Quickness", -1));

    expect(result.current.canIncrease("Communication")).toBe(
      result.current.nextCost("Communication")! <= result.current.remainingPoints,
    );
  });

  it("does not go below MIN_RANK", () => {
    const { result } = renderHook(() => useCharacterCreation());
    // Try to decrease below minimum
    act(() => result.current.changeRank("Strength", -1));
    act(() => result.current.changeRank("Strength", -1));
    act(() => result.current.changeRank("Strength", -1));
    act(() => result.current.changeRank("Strength", -1)); // should be clamped

    expect(result.current.ranks.Strength).toBe(-3);
  });
});

describe("useCharacterCreation – ability ranks", () => {
  it("increases an ability rank and deducts cost", () => {
    const { result } = renderHook(() => useCharacterCreation());
    const cost = result.current.abilityNextCost("Bows")!;

    act(() => result.current.changeAbilityRank("Bows", 1));

    expect(result.current.abilityRanks["Bows"]).toBe(1);
    expect(result.current.remainingPoints).toBe(BASE_POINTS - cost);
  });

  it("canDecreaseAbility returns false at rank 0", () => {
    const { result } = renderHook(() => useCharacterCreation());
    expect(result.current.canDecreaseAbility("Bows")).toBe(false);
  });

  it("canDecreaseAbility returns true above rank 0", () => {
    const { result } = renderHook(() => useCharacterCreation());
    act(() => result.current.changeAbilityRank("Bows", 1));
    expect(result.current.canDecreaseAbility("Bows")).toBe(true);
  });

  it("point pools are shared: ability spend reduces characteristic budget", () => {
    const { result } = renderHook(() => useCharacterCreation());
    act(() => result.current.changeAbilityRank("Bows", 1)); // costs 2
    expect(result.current.remainingPoints).toBe(BASE_POINTS - 2);
    // Characteristic also competes from the same pool
    expect(result.current.canIncrease("Intelligence")).toBe(
      result.current.nextCost("Intelligence")! <= result.current.remainingPoints,
    );
  });
});

describe("useCharacterCreation – extra HP", () => {
  it("buying 1 extra HP point costs 1 creation point", () => {
    const { result } = renderHook(() => useCharacterCreation());
    act(() => result.current.changeExtraHP(1));
    expect(result.current.extraHPPoints).toBe(1);
    expect(result.current.remainingPoints).toBe(BASE_POINTS - 1);
  });

  it("extraHPGain reflects current Stamina rank", () => {
    const { result } = renderHook(() => useCharacterCreation());
    act(() => result.current.changeExtraHP(2));
    // Stamina=0 → 4 HP per point
    expect(result.current.extraHPGain).toBe(8);
  });

  it("totalHP updates after buying extra HP", () => {
    const { result } = renderHook(() => useCharacterCreation());
    act(() => result.current.changeExtraHP(1));
    expect(result.current.totalHP).toBe(22 + result.current.hpPerPoint);
  });

  it("canDecreaseExtraHP is false when no extra HP purchased", () => {
    const { result } = renderHook(() => useCharacterCreation());
    expect(result.current.canDecreaseExtraHP).toBe(false);
  });

  it("canDecreaseExtraHP is true after buying extra HP", () => {
    const { result } = renderHook(() => useCharacterCreation());
    act(() => result.current.changeExtraHP(1));
    expect(result.current.canDecreaseExtraHP).toBe(true);
  });
});

describe("useCharacterCreation – HP derivations from Stamina", () => {
  it("woundThreshold and hpPerPoint update when Stamina changes", () => {
    const { result } = renderHook(() => useCharacterCreation());
    act(() => result.current.changeRank("Stamina", 1));
    expect(result.current.woundThreshold).toBe(12); // Sta=+1
    expect(result.current.hpPerPoint).toBe(5);       // Sta=+1
  });
});

describe("useCharacterCreation – equipment", () => {
  it("toggleWeapon selects a weapon", () => {
    const { result } = renderHook(() => useCharacterCreation());
    act(() => result.current.toggleWeapon("shortsword"));
    expect(result.current.selectedWeapons).toContain("shortsword");
  });

  it("toggleWeapon deselects an already-selected weapon", () => {
    const { result } = renderHook(() => useCharacterCreation());
    act(() => result.current.toggleWeapon("shortsword"));
    act(() => result.current.toggleWeapon("shortsword"));
    expect(result.current.selectedWeapons).not.toContain("shortsword");
  });

  it("cannot select more than MAX_WEAPONS weapons", () => {
    const { result } = renderHook(() => useCharacterCreation());
    act(() => result.current.toggleWeapon("shortsword"));
    act(() => result.current.toggleWeapon("dagger"));
    act(() => result.current.toggleWeapon("handAxe"));
    act(() => result.current.toggleWeapon("mace")); // beyond limit

    expect(result.current.selectedWeapons).toHaveLength(MAX_WEAPONS);
    expect(result.current.selectedWeapons).not.toContain("mace");
  });

  it("canSelectWeapon returns false when limit reached and weapon not selected", () => {
    const { result } = renderHook(() => useCharacterCreation());
    act(() => result.current.toggleWeapon("shortsword"));
    act(() => result.current.toggleWeapon("dagger"));
    act(() => result.current.toggleWeapon("handAxe"));

    expect(result.current.canSelectWeapon("mace")).toBe(false);
    expect(result.current.canSelectWeapon("shortsword")).toBe(true); // already selected
  });

  it("toggleShield selects and deselects single-select", () => {
    const { result } = renderHook(() => useCharacterCreation());
    act(() => result.current.toggleShield("buckler"));
    expect(result.current.selectedShield).toBe("buckler");

    act(() => result.current.toggleShield("roundShield"));
    expect(result.current.selectedShield).toBe("roundShield"); // replaced

    act(() => result.current.toggleShield("roundShield"));
    expect(result.current.selectedShield).toBeNull(); // deselected
  });

  it("toggleArmor selects and deselects single-select", () => {
    const { result } = renderHook(() => useCharacterCreation());
    act(() => result.current.toggleArmor("quiltedFur"));
    expect(result.current.selectedArmor).toBe("quiltedFur");

    act(() => result.current.toggleArmor("quiltedFur"));
    expect(result.current.selectedArmor).toBeNull();
  });
});

describe("useCharacterCreation – resetAll", () => {
  it("resets everything to initial state", () => {
    const { result } = renderHook(() => useCharacterCreation());
    act(() => result.current.changeRank("Strength", 1));
    act(() => result.current.changeAbilityRank("Bows", 1));
    act(() => result.current.changeExtraHP(2));
    act(() => result.current.toggleWeapon("shortsword"));
    act(() => result.current.toggleShield("buckler"));
    act(() => result.current.toggleArmor("quiltedFur"));

    act(() => result.current.resetAll());

    expect(result.current.remainingPoints).toBe(BASE_POINTS);
    expect(result.current.ranks.Strength).toBe(0);
    expect(result.current.abilityRanks["Bows"]).toBe(0);
    expect(result.current.extraHPPoints).toBe(0);
    expect(result.current.selectedWeapons).toEqual([]);
    expect(result.current.selectedShield).toBeNull();
    expect(result.current.selectedArmor).toBeNull();
  });
});
