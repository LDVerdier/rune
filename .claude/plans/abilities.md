# Plan: Implement Abilities in Character Creation

## Context

The character creation page already has a working Characteristics section with a 60-point pool. We need to add an Abilities section that shares the same pool. Abilities have a simpler linear cost model (Primary: 2 pts/rank, Secondary: 1 pt/rank, range 0–3) but richer metadata (set, governing characteristic, load, equipment, charts).

## Architecture

Follows existing Domain → Hook → Route pattern:

```
domain/character-stats.ts  (modify: add optional budget param)
domain/abilities.ts        (new: ability types, data, pure functions)
hooks/use-character-creation.ts (new: unified hook replacing use-character-stats)
components/StatCard.tsx    (new: extracted reusable card component)
routes/character-creation.tsx (modify: use new hook, add abilities section)
i18n/locales/en.json + fr.json (modify: add ability translations)
```

## Step 1 — Modify `app/domain/character-stats.ts`

Add optional `budget` parameter to shared-pool functions (backward-compatible):

- `remainingPoints(ranks, budget = BASE_POINTS)`
- `tryChangeRank(ranks, char, delta, budget = BASE_POINTS)`
- `canIncrease(ranks, char, budget = BASE_POINTS)`

No changes to `pointsSpent`, `nextCost`, `prevRefund` (they don't check affordability against the pool).

## Step 2 — Create `app/domain/abilities.ts`

Types and constants:
- `AbilitySet`: `"Fighting" | "Exploratory" | "Interaction" | "Miscellaneous"`
- `AbilityCategory`: `"Primary" | "Secondary"`
- `AbilityDefinition`: `{ name, set, category, governingCharacteristics, load?, equipment?, chart? }`
- `AbilityRanks`: `Record<string, number>` (ability name → rank 0–3)
- `ABILITY_MIN_RANK = 0`, `ABILITY_MAX_RANK = 3`
- `COST_PER_RANK`: Primary → 2, Secondary → 1
- `ABILITIES`: readonly array of all 44 ability definitions (see data below)
- `INITIAL_ABILITY_RANKS`: all abilities at 0

Pure functions:
- `abilityPointsSpent(abilityRanks)` — sum of `rank × costPerRank` for each ability
- `tryChangeAbilityRank(abilityRanks, name, delta, budget)` → new ranks or null
- `canIncreaseAbility(abilityRanks, name, budget)` → boolean
- `canDecreaseAbility(abilityRanks, name)` → boolean
- `abilityNextCost(name)` / `abilityPrevRefund(name)` → cost per rank for that ability's category
- `abilitiesBySet()` → abilities grouped by set

Chart data for abilities with charts (Balance, Climb, Jump, Sprint, Swim, Bargain) stored in a `ABILITY_CHARTS` map.

### Ability Data (from descriptions, authoritative source)

**Fighting (all Primary):** Bows (Perception), Brawling (Dexterity), Chain Weapon (Dexterity), Great Weapon (Dexterity), Longshaft Weapon (Dexterity), Single Weapon (Dexterity), Thrown Weapon (Perception), Two Weapons (Dexterity)

**Exploratory — Primary:** Awareness (Perception), Dodge (Quickness), Healer (Perception/Dexterity, load 1), Sprint (Strength), Stealth (Dexterity), Traps (Dexterity, load 0.5)

**Exploratory — Secondary:** Animal Handling (Presence), Balance (Dexterity), Bravery (Stamina), Climb (Strength, load 2), Jump (Strength), Lore (Intelligence), Map (Intelligence, load 0.5), Pick Lock (Dexterity, load 0.5), Pursuit (Perception), Repair (Dexterity, load 1), Ride (Dexterity), Seamanship (variable), Ski (Dexterity, load 4), Sleep (Stamina), Survival (Intelligence, load 0.25), Swim (Strength/Stamina)

**Interaction (all Secondary):** Bargain (Communication), Carouse (Stamina), Deception (Presence), Demeanor (Communication), Disguise (Intelligence), Gamble (variable, load 0.5), Insight (Communication), Leadership (Presence), Music (Communication, load 3), Runes (Intelligence), Sing (Stamina), Skald (Intelligence/Presence)

**Miscellaneous:** Divine Awareness (Primary, Presence)

## Step 3 — Create `app/domain/abilities.test.ts`

Tests following `character-stats.test.ts` pattern:
- Initial state: all ranks 0, 0 points spent
- Point calculation: mixed Primary + Secondary ranks
- `tryChangeAbilityRank`: valid changes, null on max exceeded, null on budget exceeded
- `canIncreaseAbility`: false at max, false insufficient budget, true when affordable
- `canDecreaseAbility`: false at 0, true above 0
- `abilitiesBySet`: correct groupings and counts

Also update `character-stats.test.ts` to test the new optional `budget` parameter.

## Step 4 — Create `app/hooks/use-character-creation.ts`

Unified hook that owns ALL state (both characteristic ranks and ability ranks). Replaces `useCharacterStats`.

```
useCharacterCreation() → {
  // Shared pool
  remainingPoints, totalPointsSpent,
  // Characteristics
  ranks, changeRank, canIncrease, nextCost, prevRefund,
  // Abilities
  abilityRanks, changeAbilityRank, canIncreaseAbility, canDecreaseAbility,
  abilityNextCost, abilityPrevRefund,
  // Actions
  resetAll (resets both)
}
```

Computes effective budgets: `charBudget = BASE_POINTS - abilitySpent`, `abilBudget = BASE_POINTS - charSpent`.

Delete `app/hooks/use-character-stats.ts` (only used in character-creation route).

## Step 5 — Create `app/components/StatCard.tsx`

Extract the reusable expandable card pattern from the current characteristic cards:

Props: `name, rank, isExpanded, onToggle, onIncrease, onDecrease, canIncrease, canDecrease, increaseTooltip, decreaseTooltip, rankColorFn, children (expanded content)`

Uses: HeroUI Card/CardBody/Button/Tooltip, Framer Motion AnimatePresence. Same UI as current characteristic cards.

## Step 6 — Update `app/routes/character-creation.tsx`

1. Replace `useCharacterStats()` with `useCharacterCreation()`
2. Use `StatCard` for characteristic cards (same UI, less inline JSX)
3. Add Abilities section after characteristics, separated by Divider + section header
4. Abilities grouped by set (Fighting, Exploratory, Interaction, Miscellaneous) with set headers
5. Each ability renders as a `StatCard` with expanded content showing: description, governing characteristic(s), category + cost, load/equipment if applicable, chart if applicable
6. Expanded item state: discriminated union `{ type: "characteristic", id } | { type: "ability", id } | null` (only one item expanded at a time across both sections)
7. Update reset modal text to mention both characteristics and abilities
8. Ability rank colors: 0 → gray-400, 1 → green-400, 2 → green-500, 3 → green-600

## Step 7 — Update i18n (`en.json` + `fr.json`)

Add under `"abilities"` key:
- `sectionTitle`: "Abilities" / "Compétences"
- `sets.Fighting`, `sets.Exploratory`, `sets.Interaction`, `sets.Miscellaneous`
- `categories.Primary`, `categories.Secondary`
- For each of 44 abilities: `[Name]` (display name) and `[Name].description` (full description)
- Metadata labels: governing characteristic, load, equipment
- Chart labels and footnotes where applicable
- Update `creation.resetModal.title` and `creation.resetModal.body` to include abilities

## Verification

1. `npm run lint` — no lint errors
2. `npm run typecheck` — no type errors
3. `npm run test` — all tests pass (existing + new ability tests)
4. Manual: open character creation page, verify:
   - Abilities section appears after characteristics
   - Grouped by set with headers
   - +/- buttons work, cost deducted from shared pool
   - Increasing ability reduces points available for characteristics and vice versa
   - Max rank 3 enforced, min rank 0 enforced
   - Expand/collapse works, shows full description + metadata
   - Reset clears both characteristics and abilities
   - Language switch shows French translations
