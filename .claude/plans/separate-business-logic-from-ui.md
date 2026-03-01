# Refactor: Separate business logic from UI in character-creation

## Context

`app/routes/character-creation.tsx` (285 lines) mixes domain constants, game rule logic, a UI helper, React state, and JSX rendering in a single file. This refactor extracts business logic into a pure TypeScript domain module and establishes the **Domain → Hook → Route** pattern as the standard for all future pages.

## Architecture: Pure Domain Module + Thin Hook Adapter

Three layers, each with a single responsibility:

| Layer | File | React dependency | Responsibility |
|-------|------|-----------------|----------------|
| Domain | `app/domain/character-stats.ts` | None | Constants, types, pure game logic |
| Hook | `app/hooks/use-character-stats.ts` | `useState` | Thin adapter wiring React state to domain functions |
| Route | `app/routes/character-creation.tsx` | Full | JSX rendering, consumes hook |

> `rankTextColor` is the only presentation helper. It stays in the route file since it's a single small function used only there — not worth a separate module.

## Step-by-step

### 1. Create `app/domain/character-stats.ts`

Extract from `character-creation.tsx`:
- `CHARACTERISTICS` array and `Characteristic` type
- `Ranks` type alias (`Record<Characteristic, number>`)
- `COST_TABLE`, `BASE_POINTS`, `MIN_RANK`, `MAX_RANK`
- `INITIAL_RANKS` constant

Add pure functions (currently inline in the component, refactored to accept `ranks: Ranks`):
- `pointsSpent(ranks)` → number
- `remainingPoints(ranks)` → number
- `tryChangeRank(ranks, char, delta)` → `Ranks | null` (returns null if invalid — replaces the current void function that silently no-ops)
- `canIncrease(ranks, char)` → boolean
- `nextCost(ranks, char)` → number | null
- `prevRefund(ranks, char)` → number | null

### 2. Create `app/hooks/use-character-stats.ts`

Thin hook (~25 lines) that:
- Holds `useState<Ranks>(() => ({ ...INITIAL_RANKS }))`
- Delegates to domain functions, e.g. `changeRank` calls `setRanks(prev => tryChangeRank(prev, char, delta) ?? prev)`
- Returns: `{ ranks, pointsSpent, remainingPoints, changeRank, resetAll, canIncrease, nextCost, prevRefund }`

Exports `BASE_POINTS` re-export from domain (so the route only imports from hook + domain constants).

### 3. Refactor `app/routes/character-creation.tsx`

- Remove all extracted constants, types, and functions
- Import `useCharacterStats` from hook, `CHARACTERISTICS` / `BASE_POINTS` / `MIN_RANK` from domain
- Keep: `meta()`, `rankTextColor()`, `useState` for the modal, and JSX
- Route file should go from ~285 lines to ~190 lines

### 4. Add domain tests: `app/domain/character-stats.test.ts`

Plain Vitest tests (no React, no DOM):
- `INITIAL_RANKS` has all zeros, full points available
- `tryChangeRank` respects min/max bounds (returns null)
- `tryChangeRank` rejects moves exceeding remaining points (returns null)
- `tryChangeRank` returns valid new state on legal moves
- `pointsSpent` / `remainingPoints` compute correctly
- `canIncrease` returns false at max rank or insufficient points
- `nextCost` / `prevRefund` edge cases

### 5. Run verification suite

```bash
npm run lint
npm run typecheck
npm run test
```

## Files modified/created

| Action | File |
|--------|------|
| Create | `app/domain/character-stats.ts` |
| Create | `app/domain/character-stats.test.ts` |
| Create | `app/hooks/use-character-stats.ts` |
| Modify | `app/routes/character-creation.tsx` |
