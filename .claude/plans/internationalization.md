# Internationalization (i18n)

## Context

All UI text is hardcoded in English inside TSX files. The app needs internationalization so users can switch languages from anywhere. The app currently has 2 routes (`/` home, `/character-creation`) with no shared navbar — each page manages its own layout.

**Chosen approach:** react-i18next, no URL change (localStorage persistence), fixed top-right language switcher, English + French.

---

## 1. Install dependencies

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

- `i18next` — core i18n framework
- `react-i18next` — React bindings (`useTranslation` hook, `<Trans>` component)
- `i18next-browser-languagedetector` — auto-detects language from localStorage / browser `navigator.language`

---

## 2. Create translation files

```
app/
  i18n/
    index.ts           ← i18next init config
    locales/
      en.json          ← English translations
      fr.json          ← French translations
```

### Translation keys structure (nested objects):

i18next resolves `t('home.title')` by navigating nested keys automatically — no code difference vs flat keys, but the JSON is cleaner and more maintainable.

```jsonc
// en.json
{
  "home": {
    "title": "Rune",
    "meta": {
      "description": "Tools for the land of the Vikings"
    },
    "tagline": "At the edge of Ragnarok",
    "subtitle": "Forge your warrior. Shape your fate.\nThe final battle awaits.",
    "cta": "Enter the Forge"
  },
  "creation": {
    "title": "Rune - Character Creation",
    "meta": {
      "description": "Create your Rune character"
    },
    "heading": "The Forge",
    "back": "Back",
    "pointsRemaining": "Points remaining",
    "resetAll": "Reset All",
    "refundTooltip": "Refund {{count}} pts",
    "minRank": "Minimum rank",
    "costTooltip": "Cost: {{count}} pts",
    "maxRank": "Maximum rank",
    "resetModal": {
      "title": "Reset All Characteristics?",
      "body": "This will reset all characteristics to their default values.\nAny changes you've made will be lost.",
      "cancel": "Cancel",
      "confirm": "Reset"
    }
  },
  "characteristics": {
    "strength": "Strength",
    "stamina": "Stamina",
    "dexterity": "Dexterity",
    "quickness": "Quickness",
    "intelligence": "Intelligence",
    "perception": "Perception",
    "presence": "Presence",
    "communication": "Communication"
  }
}
```

French translations (`fr.json`) will mirror the same keys with French values.

---

## 3. Initialize i18next

**File:** `app/i18n/index.ts`

- Import `i18next`, `react-i18next`, `i18next-browser-languagedetector`
- Load `en.json` and `fr.json` as resources (bundled, not lazy-loaded — the app is small)
- Default language: `en`
- Fallback language: `en`
- Detection order: `['localStorage', 'navigator']`
- Store language choice in `localStorage` key `i18nextLng`

---

## 4. Integrate with React

**File:** `app/root.tsx`

- Import and call `i18n/index.ts` (side-effect import, must run before rendering)
- Wrap app with `I18nextProvider` inside `HeroUIProvider`
- Dynamically set `<html lang={currentLanguage}>` using `useTranslation()` hook

---

## 5. Create `LanguageSwitcher` component

**File:** `app/components/LanguageSwitcher.tsx`

- Fixed position: `fixed top-4 right-4 z-50`
- Uses HeroUI `Dropdown` + `DropdownTrigger` + `DropdownMenu` + `DropdownItem`
- Trigger: a `Button` with `variant="light"` showing a globe icon + current language code (e.g. "EN")
- Globe icon: inline SVG (simple, no extra dependency)
- Dropdown lists: `English` and `Français`, with a checkmark on the active one
- On select: calls `i18n.changeLanguage(lang)` — i18next handles localStorage persistence automatically
- Styling: subtle, transparent background, blends with dark theme. Light hover effect.

**Render in:** `app/root.tsx` inside the `App` component, outside `<Outlet />` so it appears on every page.

---

## 6. Replace hardcoded strings in routes

### `app/routes/home.tsx`
- Import `useTranslation` from `react-i18next`
- Replace all hardcoded strings with `t('home.title')`, `t('home.tagline')`, etc.
- Meta function: use i18next instance directly (meta runs outside React context)

### `app/routes/character-creation.tsx`
- Same pattern: `useTranslation()` + `t()` calls
- Characteristic names: map from translation keys instead of hardcoded array
- Interpolation for dynamic values: `t('creation.refundTooltip', { count: refund })`

---

## 7. Update existing test

**File:** `app/routes/home.test.tsx`

- Mock i18next or wrap test renders with `I18nextProvider` using test config
- Update text assertions to match translation keys or English values

---

## Verification

1. `npm run lint` — no lint errors
2. `npm run typecheck` — no type errors
3. `npm run test` — all tests pass
4. Manual: open app, verify language switcher appears top-right on both pages, switch to French, verify all text changes, refresh page and confirm language persists
