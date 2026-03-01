import { describe, it, expect } from "vitest";
import { deriveCognomen } from "./names";

describe("deriveCognomen", () => {
  it("appends 'sson' for male gender", () => {
    expect(deriveCognomen("Bjorn", "male")).toBe("Bjornsson");
  });

  it("appends 'sdottir' for female gender", () => {
    expect(deriveCognomen("Bjorn", "female")).toBe("Bjornsdottir");
  });

  it("works with short names", () => {
    expect(deriveCognomen("An", "male")).toBe("Ansson");
    expect(deriveCognomen("An", "female")).toBe("Ansdottir");
  });
});
