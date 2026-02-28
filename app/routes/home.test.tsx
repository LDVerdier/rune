import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, it, expect } from "vitest";
import Home from "./home";

afterEach(cleanup);

describe("Home", () => {
  it("renders the heading", () => {
    render(<Home />);
    expect(screen.getByText("Rune")).toBeInTheDocument();
  });

  it("renders the welcome message", () => {
    render(<Home />);
    expect(screen.getByText("Welcome to Rune.")).toBeInTheDocument();
  });
});
