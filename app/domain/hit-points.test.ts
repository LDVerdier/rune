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
    // sum ≤ -4 → 37
    [-3, -3, 37],
    [-3, -1, 37],
    [-1, -3, 37],
    // sum -3 to -1 → 40
    [-2, -1, 40],
    [-1, -1, 40],
    [-1, 0, 40],
    [0, -3, 40],
    [0, -1, 40],
    // sum 0 → 44
    [0, 0, 44],
    [-1, 1, 44],
    // sum 1 to 3 → 48
    [1, 0, 48],
    [0, 1, 48],
    [1, 1, 48],
    [0, 3, 48],
    [3, 0, 48],
    [1, 2, 48],
    // sum 4 → 52
    [2, 2, 52],
    [1, 3, 52],
    // sum 5 → 56
    [2, 3, 56],
    [3, 2, 56],
    // sum 6 → 60
    [3, 3, 60],
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
    // Str 0 + Sta 0 → starting 44, 2 pts at Sta 0 (4 HP/pt) → 8 extra
    expect(computeTotalHP(0, 0, 2)).toBe(52);
  });

  it("works with negative characteristics", () => {
    // Str -3 + Sta -3 → sum -6 → starting 37, 1 pt at Sta -3 (1 HP/pt) → 1
    expect(computeTotalHP(-3, -3, 1)).toBe(38);
  });

  it("works with max characteristics and no extra", () => {
    // Str 3 + Sta 3 → sum 6 → starting 60, 0 extra
    expect(computeTotalHP(3, 3, 0)).toBe(60);
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
