# Plan: Expandable Characteristic Details

## Context
Each characteristic card in the character creation page currently shows only the name and rank controls. The user wants each card to be expandable on click to reveal a description and the associated patron Norse deity.

## Approach

### 1. Domain layer — Add patron deity data to `character-stats.ts`
Add a `PATRON_DEITIES` record mapping each `Characteristic` to its deity key string:
```ts
export const PATRON_DEITIES: Record<Characteristic, string> = {
  Strength: "Thor",
  Stamina: "Tyr",
  Dexterity: "Ull",
  Quickness: "Njord",
  Intelligence: "Loki",
  Perception: "Heimdal",
  Presence: "Odin",
  Communication: "Freyr",
};
```
This is non-translatable proper-noun data that belongs in the domain.

### 2. i18n — Add description & deity translations
In both `en.json` and `fr.json`, add under `characteristics`:
- `"<Char>.description"` — the flavor text for each characteristic
- `"<Char>.deity"` — a sentence like "Thor the Thunderer is the patron god of Strength."

### 3. UI — Make cards expandable in `character-creation.tsx`
- Add `expandedChar` state (`Characteristic | null`) to track which card is expanded (only one at a time, accordion-style)
- Clicking anywhere on the card header row toggles that card open/closed
- Add a small chevron indicator (▸/▾) to hint at expandability
- Expanded section shows:
  - Description paragraph (italic, muted text)
  - Patron deity line (bold deity name + short sentence)
- Use Framer Motion `AnimatePresence` + `motion.div` for smooth height animation on expand/collapse (already in deps)

### Files to modify
- `app/domain/character-stats.ts` — add `PATRON_DEITIES`
- `app/i18n/locales/en.json` — add descriptions + deity sentences
- `app/i18n/locales/fr.json` — add descriptions + deity sentences (French)
- `app/routes/character-creation.tsx` — expandable card UI + animation

### Verification
1. `npm run lint`
2. `npm run typecheck`
3. `npm run test`
