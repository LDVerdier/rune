import { describe, expect, it } from "vitest";
import { computeWoundThreshold } from "./wound-threshold";

describe("computeWoundThreshold", () => {
  it.each([
    [-3, 2],
    [-2, 4],
    [-1, 6],
    [0, 9],
    [1, 12],
    [2, 15],
    [3, 18],
  ])("Stamina %i → wound threshold %i", (stamina, expected) => {
    expect(computeWoundThreshold(stamina)).toBe(expected);
  });

  it("falls back to 9 for out-of-range stamina", () => {
    expect(computeWoundThreshold(5)).toBe(9);
    expect(computeWoundThreshold(-5)).toBe(9);
  });
});
