# Refactoring Plan: Code Design & Frontend Architecture Review

## Current State

The codebase already follows the Domain -> Hook -> Route pattern reasonably well:
- 7 domain modules with pure TypeScript, no React imports
- 1 hook (`useCharacterCreation`) that delegates most logic to domain functions
- Good test coverage on most domain files
- Components are generally well-scoped

The issues below are ordered by impact.

---

## 1. Split the god route: `character-creation.tsx` (659 lines)

**Violation:** Single responsibility, 150-line guideline (4.4x over).

The route manages 7 `useState` calls, 3 toggle functions, a derived `hasAllocations` flag, and renders 6 collapsible sections plus 3 modals plus a mobile sticky bar.

### Step 1a — Extract a `useCharacterCreationUI` hook

Move all UI-only state out of the route into `app/hooks/use-character-creation-ui.ts`:

- `heroName` / `setHeroName`
- `cognomen` / `setCognomen`
- `gender` / `setGender`
- `isResetOpen` / `setIsResetOpen`
- `isBackOpen` / `setIsBackOpen`
- `expandedItem` / `setExpandedItem` (and the `ExpandedItem` type)
- `isMobileSummaryOpen` / `setIsMobileSummaryOpen`
- The three toggle helpers: `toggleChar`, `toggleAbility`, `toggleEquipment`

The hook returns a clean API for the route to consume. Estimated size: ~50 lines.

### Step 1b — Extract section components

Each collapsible section becomes its own component in `app/components/`:

| Component | Lines extracted | Props |
|-----------|---------------|-------|
| `CharacteristicsSection` | ~50 lines (220-271) | ranks, expand state, change handlers, i18n |
| `AbilitiesSection` | ~90 lines (273-362) | abilityRanks, expand state, change handlers |
| `ExtraHPSection` | ~50 lines (364-414) | extraHP state, change handlers |
| `WeaponsSection` | ~40 lines (416-455) | selectedWeapons, toggle, expand |
| `ShieldsSection` | ~35 lines (457-490) | selectedShield, toggle, expand |
| `ArmorsSection` | ~35 lines (492-525) | selectedArmor, toggle, expand |

Each section receives its data as props from the route, keeping them presentation-only.

### Step 1c — Extract `MobileSummaryBar`

The mobile sticky bar + modal (lines 554-656) becomes `app/components/MobileSummaryBar.tsx`. It receives summary data as props and manages its own open/close state (since it's self-contained UI interaction).

**Target:** Route file drops to ~150 lines — imports, hook calls, layout grid, and section composition.

---

## 2. Move inline business logic from hook to domain

**Violation:** Hook layer should be a thin adapter, not contain business rules.

### Step 2a — `tryChangeExtraHP` in `app/domain/hit-points.ts`

Current (`use-character-creation.ts:70-77`):
```ts
function changeExtraHP(delta: number) {
  setExtraHPPoints((prev) => {
    const next = prev + delta;
    if (next < 0) return prev;
    if (delta > 0 && !domainCanIncreaseExtraHP(hpBudget - prev)) return prev;
    return next;
  });
}
```

Extract to domain:
```ts
// app/domain/hit-points.ts
export function tryChangeExtraHP(current: number, delta: number, budget: number): number | null {
  const next = current + delta;
  if (next < 0) return null;
  if (delta > 0 && !canIncreaseExtraHP(budget - current)) return null;
  return next;
}
```

Hook becomes:
```ts
function changeExtraHP(delta: number) {
  setExtraHPPoints((prev) => tryChangeExtraHP(prev, delta, hpBudget) ?? prev);
}
```

This matches the existing `tryChangeRank` pattern exactly.

### Step 2b — `tryToggleWeapon` in `app/domain/equipment.ts`

Current (`use-character-creation.ts:102-109`):
```ts
function toggleWeapon(id: string) {
  setSelectedWeapons((prev) =>
    prev.includes(id)
      ? prev.filter((w) => w !== id)
      : prev.length < MAX_WEAPONS ? [...prev, id] : prev,
  );
}
```

Extract to domain:
```ts
// app/domain/equipment.ts
export function tryToggleWeapon(selected: string[], id: string): string[] {
  if (selected.includes(id)) return selected.filter((w) => w !== id);
  if (selected.length < MAX_WEAPONS) return [...selected, id];
  return selected;
}
```

Hook becomes:
```ts
function toggleWeapon(id: string) {
  setSelectedWeapons((prev) => tryToggleWeapon(prev, id));
}
```

---

## 3. Move `hasAllocations` to domain

**Violation:** Business logic in route file.

Current (`character-creation.tsx:104-107`):
```ts
const hasAllocations =
  Object.values(ranks).some((r) => r !== 0) ||
  Object.values(abilityRanks).some((r) => r !== 0) ||
  extraHPPoints !== 0;
```

This answers a domain question ("has the player made any choices?"). Move to `app/domain/character-stats.ts` as:
```ts
export function hasAnyAllocations(ranks: Ranks, abilityRanks: AbilityRanks, extraHP: number): boolean
```

Expose in the hook's return value so the route can consume it directly.

---

## 4. Make `abilitiesBySet()` a module-level constant

**Issue:** Called on every render in two components, but `ABILITIES` is static data.

Current: `abilitiesBySet()` is a function that groups the `ABILITIES` array every time it's called.

Replace with a pre-computed constant:
```ts
// app/domain/abilities.ts
export const ABILITIES_BY_SET: Record<AbilitySet, AbilityDefinition[]> = { ... };
```

Update consumers in `character-creation.tsx` and `CharacterSummary.tsx` to use the constant directly.

---

## 5. Add missing domain tests

**Violation:** Testing strategy — domain logic should be covered.

### Step 5a — `app/domain/equipment.test.ts`

Test `canSelectWeapon` and the new `tryToggleWeapon`:
- toggling adds/removes correctly
- respects MAX_WEAPONS cap
- `canSelectWeapon` returns true for selected items and when under cap

### Step 5b — `app/domain/names.test.ts`

Test `deriveCognomen`:
- male: `deriveCognomen("Bjorn", "male")` -> `"Bjornsson"`
- female: `deriveCognomen("Bjorn", "female")` -> `"Bjornsdottir"`

---

## 6. Eliminate duplicated HP threshold data in `HPBreakdownPopover`

**Violation:** Shared intent = same data, currently duplicated.

`HPBreakdownPopover.tsx` has `STARTING_HP_ROWS` (lines 18-61) that encode the same Strength+Stamina -> HP thresholds as `computeStartingHP` in `hit-points.ts`. If game rules change, both files must be updated independently.

Move the threshold data to the domain and expose a structured lookup table:
```ts
// app/domain/hit-points.ts
export const STARTING_HP_TABLE: { min: number; max: number; hp: number }[] = [
  { min: -Infinity, max: -4, hp: 18 },
  ...
];
```

`computeStartingHP` uses this table internally, and `HPBreakdownPopover` consumes it for display. Single source of truth.

---

## What NOT to refactor

The following were reviewed and deemed acceptable:

- **`utils/formatting.ts` (24 lines):** The file name has a qualifier ("formatting") and the functions are used by multiple components. Small enough to leave as-is.
- **`abilities.ts` (307 lines):** Mostly data (177 lines of `ABILITIES` definitions). The data and logic are tightly coupled (same domain), and separating them would add a file-navigation cost with no meaningful benefit. If it grows further, split data into `abilities-data.ts`.
- **`CharacterSummary.tsx` (303 lines):** Pure rendering with no business logic. It's a single list of labeled rows — extracting sub-components would fragment the visual structure without adding clarity.
- **`StatCard.tsx` (132 lines):** Under the 150-line guideline, pure presentation, well-focused.
- **`use-character-creation.ts` (172 lines):** Slightly over 150 lines but will shrink after moving `toggleWeapon` and `changeExtraHP` logic to domain. After step 2, it should be ~155 lines, which is acceptable for a hook wiring 6 pieces of state.
- **`toggleShield` / `toggleArmor` in hook:** Trivial one-liners (toggle between value and null). Not worth extracting to domain.

---

## Execution order

1. **Step 2** (domain extractions) — smallest, safest refactoring, unblocks everything else
2. **Step 5** (missing tests) — quick to add and validates step 2
3. **Step 3** (`hasAllocations` to domain)
4. **Step 4** (`abilitiesBySet` constant)
5. **Step 6** (HP threshold dedup)
6. **Step 1** (route decomposition) — largest change, but mechanically straightforward once the domain layer is clean
