import { describe, it, expect } from "vitest";
import { canSelectWeapon, tryToggleWeapon, MAX_WEAPONS } from "./equipment";

describe("canSelectWeapon", () => {
  it("returns true when weapon is already selected", () => {
    expect(canSelectWeapon(["dagger", "mace"], "dagger")).toBe(true);
  });

  it("returns true when under the weapon cap", () => {
    expect(canSelectWeapon(["dagger"], "mace")).toBe(true);
  });

  it("returns true when selection is empty", () => {
    expect(canSelectWeapon([], "dagger")).toBe(true);
  });

  it("returns false when at cap and weapon not selected", () => {
    const selected = ["dagger", "mace", "shortBow"];
    expect(selected.length).toBe(MAX_WEAPONS);
    expect(canSelectWeapon(selected, "handAxe")).toBe(false);
  });
});

describe("tryToggleWeapon", () => {
  it("adds a weapon when not selected and under cap", () => {
    expect(tryToggleWeapon(["dagger"], "mace")).toEqual(["dagger", "mace"]);
  });

  it("removes a weapon when already selected", () => {
    expect(tryToggleWeapon(["dagger", "mace"], "dagger")).toEqual(["mace"]);
  });

  it("returns same array when at cap and weapon not selected", () => {
    const selected = ["dagger", "mace", "shortBow"];
    const result = tryToggleWeapon(selected, "handAxe");
    expect(result).toEqual(selected);
  });

  it("adds to empty selection", () => {
    expect(tryToggleWeapon([], "dagger")).toEqual(["dagger"]);
  });

  it("removes last weapon leaving empty array", () => {
    expect(tryToggleWeapon(["dagger"], "dagger")).toEqual([]);
  });
});
