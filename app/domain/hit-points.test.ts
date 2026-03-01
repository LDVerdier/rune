import { describe, expect, it } from "vitest";
import {
  EXTRA_HP_MIN,
  canDecreaseExtraHP,
  canIncreaseExtraHP,
  computeExtraHPGain,
  computeStartingHP,
  computeTotalHP,
  extraHPPerPoint,
} from "./hit-points";

describe("computeStartingHP", () => {
  it.each([
    // sum ≤ -4 → 18
    [-3, -3, 18],
    [-3, -1, 18],
    [-1, -3, 18],
    // sum -3 to -1 → 20
    [-2, -1, 20],
    [-1, -1, 20],
    [-1, 0, 20],
    [0, -3, 20],
    [0, -1, 20],
    // sum 0 → 22
    [0, 0, 22],
    [-1, 1, 22],
    // sum 1 to 3 → 24
    [1, 0, 24],
    [0, 1, 24],
    [1, 1, 24],
    [0, 3, 24],
    [3, 0, 24],
    [1, 2, 24],
    // sum 4 → 26
    [2, 2, 26],
    [1, 3, 26],
    // sum 5 → 28
    [2, 3, 28],
    [3, 2, 28],
    // sum 6 → 30
    [3, 3, 30],
  ])(
    "Strength %i + Stamina %i → %i HP",
    (str, sta, expected) => {
      expect(computeStartingHP(str, sta)).toBe(expected);
    },
  );
});

describe("extraHPPerPoint", () => {
  it.each([
    [-3, 1],
    [-2, 2],
    [-1, 3],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ])("Stamina %i → %i HP per point", (sta, expected) => {
    expect(extraHPPerPoint(sta)).toBe(expected);
  });
});

describe("computeExtraHPGain", () => {
  it("returns 0 when no points spent", () => {
    expect(computeExtraHPGain(0, 0)).toBe(0);
  });

  it("multiplies points by per-point value", () => {
    // Stamina 2 → 6 HP/pt, 3 pts → 18
    expect(computeExtraHPGain(3, 2)).toBe(18);
  });

  it("handles negative-stamina yield", () => {
    // Stamina -3 → 1 HP/pt, 5 pts → 5
    expect(computeExtraHPGain(5, -3)).toBe(5);
  });
});

describe("computeTotalHP", () => {
  it("adds starting HP and extra HP gain", () => {
    // Str 0 + Sta 0 → starting 22, 2 pts at Sta 0 (4 HP/pt) → 8 extra
    expect(computeTotalHP(0, 0, 2)).toBe(30);
  });

  it("works with negative characteristics", () => {
    // Str -3 + Sta -3 → sum -6 → starting 18, 1 pt at Sta -3 (1 HP/pt) → 1
    expect(computeTotalHP(-3, -3, 1)).toBe(19);
  });

  it("works with max characteristics and no extra", () => {
    // Str 3 + Sta 3 → sum 6 → starting 30, 0 extra
    expect(computeTotalHP(3, 3, 0)).toBe(30);
  });
});

describe("canIncreaseExtraHP", () => {
  it("returns true when budget >= 1", () => {
    expect(canIncreaseExtraHP(1)).toBe(true);
    expect(canIncreaseExtraHP(10)).toBe(true);
  });

  it("returns false when budget < 1", () => {
    expect(canIncreaseExtraHP(0)).toBe(false);
    expect(canIncreaseExtraHP(-1)).toBe(false);
  });
});

describe("canDecreaseExtraHP", () => {
  it("returns true when points spent > minimum", () => {
    expect(canDecreaseExtraHP(1)).toBe(true);
    expect(canDecreaseExtraHP(5)).toBe(true);
  });

  it("returns false when points spent is at minimum", () => {
    expect(canDecreaseExtraHP(EXTRA_HP_MIN)).toBe(false);
  });
});
