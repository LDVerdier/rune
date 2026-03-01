import { describe, it, expect } from "vitest";
import {
  computeTotalLoad,
  computeEncumbranceDegree,
  computeEncumbranceDecrease,
} from "./encumbrance";

describe("computeTotalLoad", () => {
  it("returns 0 when no equipment is selected", () => {
    expect(computeTotalLoad([], null, null)).toBe(0);
  });

  it("sums weapon loads", () => {
    // dagger: 0.25, handAxe: 0.5
    expect(computeTotalLoad(["dagger", "handAxe"], null, null)).toBe(0.75);
  });

  it("ignores weapons with null load", () => {
    // fistKick has load: null
    expect(computeTotalLoad(["fistKick"], null, null)).toBe(0);
  });

  it("includes shield load", () => {
    // roundShield: 0.5
    expect(computeTotalLoad([], "roundShield", null)).toBe(0.5);
  });

  it("includes armor load", () => {
    // chainMail: 2.5
    expect(computeTotalLoad([], null, "chainMail")).toBe(2.5);
  });

  it("sums all equipment together", () => {
    // dagger: 0.25 + buckler: 0.25 + heavyLeather: 1.5
    expect(computeTotalLoad(["dagger"], "buckler", "heavyLeather")).toBe(2);
  });
});

describe("computeEncumbranceDegree", () => {
  it("returns Light when load is below the Loaded threshold", () => {
    expect(computeEncumbranceDegree(0, 3.9)).toBe("Light");
  });

  it("returns Loaded at exactly the Loaded threshold", () => {
    expect(computeEncumbranceDegree(0, 4)).toBe("Loaded");
  });

  it("returns Overloaded at exactly the Overloaded threshold", () => {
    expect(computeEncumbranceDegree(0, 6)).toBe("Overloaded");
  });

  it("returns BetterPutSomethingDown at its threshold", () => {
    expect(computeEncumbranceDegree(0, 8)).toBe("BetterPutSomethingDown");
  });

  it("returns NoOneWillTakeThisMuch at its threshold", () => {
    expect(computeEncumbranceDegree(0, 10)).toBe("NoOneWillTakeThisMuch");
  });

  it("handles Strength -3 thresholds", () => {
    expect(computeEncumbranceDegree(-3, 0.4)).toBe("Light");
    expect(computeEncumbranceDegree(-3, 0.5)).toBe("Loaded");
    expect(computeEncumbranceDegree(-3, 1)).toBe("Overloaded");
    expect(computeEncumbranceDegree(-3, 2)).toBe("BetterPutSomethingDown");
    expect(computeEncumbranceDegree(-3, 4)).toBe("NoOneWillTakeThisMuch");
  });

  it("handles Strength 3 thresholds", () => {
    expect(computeEncumbranceDegree(3, 9.9)).toBe("Light");
    expect(computeEncumbranceDegree(3, 10)).toBe("Loaded");
    expect(computeEncumbranceDegree(3, 12)).toBe("Overloaded");
    expect(computeEncumbranceDegree(3, 14)).toBe("BetterPutSomethingDown");
    expect(computeEncumbranceDegree(3, 16)).toBe("NoOneWillTakeThisMuch");
  });

  it("extrapolates for Strength 4", () => {
    // Str 3 thresholds: [10, 12, 14, 16] + 2 = [12, 14, 16, 18]
    expect(computeEncumbranceDegree(4, 11.9)).toBe("Light");
    expect(computeEncumbranceDegree(4, 12)).toBe("Loaded");
    expect(computeEncumbranceDegree(4, 14)).toBe("Overloaded");
    expect(computeEncumbranceDegree(4, 16)).toBe("BetterPutSomethingDown");
    expect(computeEncumbranceDegree(4, 18)).toBe("NoOneWillTakeThisMuch");
  });

  it("extrapolates for Strength 5", () => {
    // Str 3 thresholds: [10, 12, 14, 16] + 4 = [14, 16, 18, 20]
    expect(computeEncumbranceDegree(5, 13.9)).toBe("Light");
    expect(computeEncumbranceDegree(5, 14)).toBe("Loaded");
    expect(computeEncumbranceDegree(5, 16)).toBe("Overloaded");
    expect(computeEncumbranceDegree(5, 18)).toBe("BetterPutSomethingDown");
    expect(computeEncumbranceDegree(5, 20)).toBe("NoOneWillTakeThisMuch");
  });

  it("clamps for Strength below -3", () => {
    // Should use the same thresholds as -3
    expect(computeEncumbranceDegree(-4, 0.4)).toBe("Light");
    expect(computeEncumbranceDegree(-4, 0.5)).toBe("Loaded");
  });
});

describe("computeEncumbranceDecrease", () => {
  it("maps Light to 0", () => {
    expect(computeEncumbranceDecrease("Light")).toBe(0);
  });

  it("maps Loaded to 1", () => {
    expect(computeEncumbranceDecrease("Loaded")).toBe(1);
  });

  it("maps Overloaded to 3", () => {
    expect(computeEncumbranceDecrease("Overloaded")).toBe(3);
  });

  it("maps BetterPutSomethingDown to 5", () => {
    expect(computeEncumbranceDecrease("BetterPutSomethingDown")).toBe(5);
  });

  it("maps NoOneWillTakeThisMuch to 8", () => {
    expect(computeEncumbranceDecrease("NoOneWillTakeThisMuch")).toBe(8);
  });
});
