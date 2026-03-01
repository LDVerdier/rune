---
name: frontend-architecture
description: Apply the Domain → Hook → Route layered architecture when creating or refactoring frontend features. Use this skill when adding a new page/feature or when a route file mixes business logic with UI rendering.
---

# Frontend architecture: Domain → Hook → Route pattern

## Pattern: Domain → Hook → Route

All feature code must follow a three-layer separation:

| Layer | Location | React dependency | Responsibility |
|-------|----------|-----------------|----------------|
| **Domain** | `app/domain/<feature>.ts` | None | Constants, types, pure functions (game rules, validation, computation) |
| **Hook** | `app/hooks/use-<feature>.ts` | `useState` only | Thin adapter wiring React state to domain functions |
| **Route** | `app/routes/<page>.tsx` | Full | JSX rendering, imports hook and domain constants |

### Domain layer (`app/domain/`)

- **Zero React imports** — pure TypeScript only
- Export all constants, type aliases, and pure functions
- Functions accept state as arguments and return new state (no mutation)
- Use `null` return to signal invalid operations (e.g. `tryChangeRank` returns `Ranks | null`)
- Must be fully testable with plain Vitest (no DOM, no React)

### Hook layer (`app/hooks/`)

- Holds `useState` and wires it to domain functions
- Keeps the adapter thin (~25-40 lines) — no business logic here
- Delegates all computation and validation to domain functions
- Returns a clean API object for the route to consume

### Route layer (`app/routes/`)

- Pure rendering: JSX, event handlers, and presentation helpers
- Small presentation helpers (e.g. `rankTextColor`) stay in the route file if used only there
- Imports the hook for state + actions, domain module for constants/types
- No business logic — only UI concerns

### Tests

- Domain tests go in `app/domain/<feature>.test.ts` — plain Vitest, no React/DOM
- Hook tests (if needed) go in `app/hooks/use-<feature>.test.ts` — use `renderHook`
- Route tests go alongside the route file — use Testing Library

### When to apply

- **New feature/page**: scaffold all three layers from the start
- **Refactoring**: if a route file exceeds ~150 lines or mixes domain logic with JSX, extract into this pattern
- **Presentation-only helpers**: a single small function used only in one route stays in the route file — don't over-extract

### Reference implementation

- Domain: `app/domain/character-stats.ts`
- Hook: `app/hooks/use-character-stats.ts`
- Route: `app/routes/character-creation.tsx`
- Tests: `app/domain/character-stats.test.ts`
