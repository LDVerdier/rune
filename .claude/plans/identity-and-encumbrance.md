# Plan: Identity & Encumbrance Features

## Overview

Four features to implement on the character creation page:
1. Gender selection
2. Name suggestion (dependent on gender)
3. Cognomen with derivation from father's name (dependent on gender)
4. Important Numbers section (Encumbrance)

The first three are closely related (identity block) and will be implemented in dependency order.

---

## UI Component Recommendation: Name/Cognomen Suggestion

For the "suggest a name" and "suggest a cognomen" CTAs, a **Popover** is the most semantically appropriate component:
- Already used in the project (HPBreakdownPopover, WoundThresholdPopover)
- Better than a Dropdown for long lists (80+ names): allows a multi-column grid layout
- Triggered by a small button, shows a scrollable panel, auto-closes on selection
- Not a Modal (too heavy), not a Select/Autocomplete (not a form field, just assistance)

The CTA button label: **"Suggest"** / **"Suggérer"** — short, meaningful in both EN and FR, conveys the idea of creative assistance without being too literal.

---

## Feature 1: Gender Selection
**Status: [X] Done**

### What
Add a gender selector (male/female) just before the Name input, preset to male. Not exported in PDF.

### Implementation

#### 1.1 State
- Add `gender` state (`"male" | "female"`) to `character-creation.tsx` with default `"male"` (local state, like `heroName`)
- No changes to the hook or domain — this is a UI-only concern at creation

#### 1.2 i18n
- `en.json` / `fr.json`: Add keys under `creation`:
  - `creation.gender` → "Gender" / "Genre"
  - `creation.genderMale` → "Male" / "Masculin"
  - `creation.genderFemale` → "Female" / "Féminin"

#### 1.3 UI
- Use HeroUI **RadioGroup** with two **Radio** buttons (horizontal layout)
  - Semantic: a binary exclusive choice is best represented by radio buttons
  - HeroUI RadioGroup supports horizontal orientation out of the box
- Place between the Divider and the Name input
- Styling: match existing dark theme (small size, gray-400 labels)

#### 1.4 Reset
- On `resetAll`, also reset `gender` to `"male"` and clear `heroName`

### Files touched
- `app/routes/character-creation.tsx`
- `app/i18n/locales/en.json`
- `app/i18n/locales/fr.json`

---

## Feature 2: Name Suggestion
**Status: [X] Done**

### What
Add a CTA button next to the Name input. On click, show a Popover with a list of Viking names (male or female depending on the selected gender). On click on a name, fill the input.

### Implementation

#### 2.1 Data
- Create `app/domain/names.ts` with:
  - `MALE_NAMES: string[]` — the 88 male names from the spec
  - `FEMALE_NAMES: string[]` — the 20 female names from the spec

#### 2.2 i18n
- Add keys:
  - `creation.suggestName` → "Suggest" / "Suggérer" (button label)

#### 2.3 UI Component: `NameSuggestionPopover`
- Create `app/components/NameSuggestionPopover.tsx`
- Props: `names: string[]`, `onSelect: (name: string) => void`
- Trigger: small Button with text "Suggest"
- Content: scrollable Popover with names in a multi-column grid (2-3 columns)
- On click on a name, call `onSelect`, close the Popover
- Styling: match dark theme, names as clickable text items with hover highlight

#### 2.4 Integration
- In `character-creation.tsx`, place button next to the Name input (inside the same `div`, flex row)
- Pass `gender === "male" ? MALE_NAMES : FEMALE_NAMES` and `onSelect={setHeroName}`

### Files touched
- `app/domain/names.ts` (new)
- `app/components/NameSuggestionPopover.tsx` (new)
- `app/routes/character-creation.tsx`
- `app/i18n/locales/en.json`
- `app/i18n/locales/fr.json`

---

## Feature 3: Cognomen
**Status: [ ] Not started**

### What
Add an optional Cognomen input. Next to it, a CTA that shows male names with the label "Derive from father's name". On click, the cognomen is computed: name + "-sson" (male) or name + "-sdottir" (female).

### Implementation

#### 3.1 State
- Add `cognomen` state (string) to `character-creation.tsx`

#### 3.2 i18n
- Add keys:
  - `creation.cognomen` → "Cognomen" / "Surnom"
  - `creation.cognomenPlaceholder` → "e.g. Thorkelsson" / "ex. Thorkelsson"
  - `creation.suggestCognomen` → "Suggest" / "Suggérer"
  - `creation.deriveFromFather` → "Derive from father's name" / "Dériver du nom du père"

#### 3.3 Domain logic
- Add to `app/domain/names.ts`:
  - `deriveCognomen(fatherName: string, gender: "male" | "female"): string`
  - Returns `fatherName + "sson"` for male, `fatherName + "sdottir"` for female

#### 3.4 UI Component: `CognomenSuggestionPopover`
- Reuse `NameSuggestionPopover` pattern, or make it generic enough to share
- Actually, better to make `NameSuggestionPopover` accept a `title` prop and an `onSelect` that receives the raw name, then apply the derivation outside
- The Popover header shows "Derive from father's name"
- The list always shows male names (regardless of the character's gender)
- On selection of "Thorkel", the cognomen input fills with "Thorkelsson" or "Thorkelsdottir"

#### 3.5 Integration
- Place Cognomen input below the Name input
- Layout: flex row with input + Suggest button (same pattern as Name)

### Files touched
- `app/domain/names.ts` (add derivation function)
- `app/components/NameSuggestionPopover.tsx` (add `title` prop)
- `app/routes/character-creation.tsx`
- `app/i18n/locales/en.json`
- `app/i18n/locales/fr.json`

---

## Feature 4: Important Numbers — Encumbrance
**Status: [ ] Not started**

### What
Add an "Important Numbers" section displaying:
1. **Encumbrance degree** — derived from Strength rank + total Load of carried equipment
2. **Encumbrance Decrease** — a malus value derived from the encumbrance degree

### Implementation

#### 4.1 Domain: `app/domain/encumbrance.ts` (new)

Types:
```typescript
type EncumbranceDegree = "Light" | "Loaded" | "Overloaded" | "BetterPutSomethingDown" | "NoOneWillTakeThisMuch";
```

Encumbrance threshold table (indexed by Strength rank):
| Str | Light (below) | Loaded | Overloaded | BetterPut | NoOne |
|-----|---------------|--------|------------|-----------|-------|
| -3  | < 0.5         | 0.5    | 1          | 2         | 4     |
| -2  | < 1           | 1      | 2          | 4         | 6     |
| -1  | < 2           | 2      | 4          | 6         | 8     |
|  0  | < 4           | 4      | 6          | 8         | 10    |
|  1  | < 6           | 6      | 8          | 10        | 12    |
|  2  | < 8           | 8      | 10         | 12        | 14    |
|  3  | < 10          | 10     | 12         | 14        | 16    |
| 4+  | extrapolate: add 2 per point above 3                  |

Functions:
- `computeTotalLoad(weaponIds: string[], shieldId: string | null, armorId: string | null): number`
  - Sums up `load` property of selected weapons, shield, and armor
  - Weapons with `load: null` contribute 0
- `computeEncumbranceDegree(strengthRank: number, totalLoad: number): EncumbranceDegree`
  - Looks up the table using strength rank and total load
  - For strength >= 4, extrapolate: thresholds are `[base+2*(str-3)]` for each column
- `computeEncumbranceDecrease(degree: EncumbranceDegree): number`
  - Light → 0, Loaded → 1, Overloaded → 3, BetterPut → 5, NoOne → 8

#### 4.2 Tests: `app/domain/encumbrance.test.ts` (new)
- Test totalLoad computation
- Test encumbrance degree for various strength/load combinations
- Test boundary conditions (exactly at threshold → next degree)
- Test extrapolation for Strength >= 4
- Test decrease mapping

#### 4.3 Hook integration
- In `useCharacterCreation`, add derived values:
  - `totalLoad` (from selected equipment)
  - `encumbranceDegree` (from `ranks.Strength` and `totalLoad`)
  - `encumbranceDecrease` (from degree)

#### 4.4 i18n
- Add keys:
  - `creation.importantNumbersSection` → "Important Numbers" / "Chiffres Importants"
  - `creation.encumbrance` → "Encumbrance" / "Encombrement"
  - `creation.encumbranceDecrease` → "Encumbrance Decrease" / "Décroissance d'Encombrement"
  - `creation.totalLoad` → "Total Load" / "Charge Totale"
  - `encumbrance.Light` → "Light" / "Léger"
  - `encumbrance.Loaded` → "Loaded" / "Chargé"
  - `encumbrance.Overloaded` → "Overloaded" / "Surchargé"
  - `encumbrance.BetterPutSomethingDown` → "Better Put Something Down" / "Mieux vaut poser quelque chose"
  - `encumbrance.NoOneWillTakeThisMuch` → "No One Will Take This Much" / "Personne ne porterait autant"

#### 4.5 UI — Summary only (no main content section)
Encumbrance values are purely computed and belong in the **CharacterSummary** component only (desktop sidebar + mobile bottom sheet). They do **not** get their own CollapsibleSection in the main content area.

- In `CharacterSummary`, add an "Important Numbers" block after the Equipment section (or after HP/Wound Threshold if no equipment selected)
- Display:
  - **Encumbrance** row: degree label + total load value in parentheses
  - **Encumbrance Decrease** row: numeric malus value
- Color-code the degree: green for Light, yellow for Loaded, orange for Overloaded, red for worse
- Consider adding a Popover showing the full encumbrance table for reference (similar to HPBreakdownPopover)

### Files touched
- `app/domain/encumbrance.ts` (new)
- `app/domain/encumbrance.test.ts` (new)
- `app/hooks/use-character-creation.ts`
- `app/components/CharacterSummary.tsx`
- `app/i18n/locales/en.json`
- `app/i18n/locales/fr.json`

---

## Implementation Order

1. **Feature 1: Gender** — foundation, no dependencies
2. **Feature 2: Name Suggestion** — depends on gender
3. **Feature 3: Cognomen** — depends on gender + reuses name suggestion pattern
4. **Feature 4: Encumbrance** — independent, done last since it's the most complex

---

## Verification

After each feature, run the full suite:
```bash
npm run lint
npm run typecheck
npm run test
```
