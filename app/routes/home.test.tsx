import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import Home from "./home";

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useRouteLoaderData: () => ({ user: null }),
  };
});

afterEach(cleanup);

describe("Home", () => {
  it("renders the heading", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </I18nextProvider>
    );
    expect(screen.getByText("Rune")).toBeInTheDocument();
  });
});
