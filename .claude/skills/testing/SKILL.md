---
name: testing
description: Apply project testing patterns when writing or reviewing tests. Use this skill when creating new test files, adding tests to existing features, or reviewing test quality.
tools: Read, Glob, Grep
---

# Testing Skill

Write tests that follow the project's established patterns. Every domain function, hook, and user-facing component must be tested.

## Test Layers

### Domain Tests (`app/domain/<feature>.test.ts`)

Pure Vitest tests against pure functions. No React, no DOM, no mocks.

```ts
import { describe, it, expect } from "vitest";
import { myFunction, MY_CONSTANT } from "~/domain/my-feature";

describe("myFunction", () => {
  it("returns expected result for valid input", () => {
    const result = myFunction(input);
    expect(result.score).toBe(4); // comment explaining calculation
  });

  it("returns null for invalid input", () => {
    expect(myFunction(invalid)).toBeNull();
  });
});
```

**Rules:**
- Import only from `vitest` and `~/domain/*`
- Use real constants from domain (no mocks)
- Add inline comments explaining non-obvious calculations
- Test edge cases: zero values, max values, null/invalid returns
- Group related tests in `describe` blocks

### Hook Tests (`app/hooks/<hook>.test.ts`)

Use `renderHook` from Testing Library. Wrap state changes in `act()`.

```ts
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useMyHook } from "~/hooks/use-my-hook";

describe("useMyHook", () => {
  it("has correct initial state", () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe(0);
  });

  it("updates state correctly", () => {
    const { result } = renderHook(() => useMyHook());
    act(() => result.current.increment());
    expect(result.current.value).toBe(1);
  });
});
```

**Rules:**
- Import `renderHook` and `act` from `@testing-library/react`
- Always wrap state mutations in `act()`
- Test initial state, transitions, derived values, and boundary conditions
- No mocks — hooks wire real domain functions to React state

### Component / Route Tests (`app/routes/<route>.test.tsx`)

Use Testing Library with required providers.

```tsx
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { MyComponent } from "~/routes/my-route";

afterEach(cleanup);

describe("MyComponent", () => {
  it("renders expected content", () => {
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <MyComponent />
        </I18nextProvider>
      </MemoryRouter>
    );
    expect(screen.getByText("Expected text")).toBeInTheDocument();
  });
});
```

**Rules:**
- Always wrap in `MemoryRouter` + `I18nextProvider`
- Use `afterEach(cleanup)`
- Query with `screen.getByText`, `screen.getByRole`, etc.
- Test user interactions with `userEvent` or `fireEvent`
- Test visible output, not implementation details

## File Naming

- Test files live next to the file they test: `app/domain/foo.test.ts`
- Match the source file name exactly: `foo.ts` → `foo.test.ts`

## Running Tests

- All tests: `npm run test`
- Watch mode: `npm run test:watch`
- Single file: `npx vitest run app/domain/foo.test.ts`
- Coverage: `npx vitest run --coverage`

## Reference Files

- Domain test example: `app/domain/combat-scores.test.ts`
- Hook test example: `app/hooks/use-character-creation.test.ts`
- Route test example: `app/routes/home.test.tsx`

## Checklist

Before marking test work as complete:
- [ ] Every public function in the domain file has at least one test
- [ ] Edge cases covered (zero, max, null, invalid)
- [ ] Hook initial state and all transitions tested
- [ ] No mocks where pure functions suffice
- [ ] Tests pass: `npm run test`
