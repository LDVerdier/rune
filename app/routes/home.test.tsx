import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router";
import Home from "./home";

afterEach(cleanup);

describe("Home", () => {
  it("renders the heading", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText("Rune")).toBeInTheDocument();
  });

});
