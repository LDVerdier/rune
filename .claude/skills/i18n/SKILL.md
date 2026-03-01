---
name: i18n
description: All user-facing text must be internationalized. Use this skill when creating or modifying any UI component that contains text visible to the user.
---

## Rule: No hardcoded user-facing strings

Every piece of text rendered in the UI must come from the i18n translation files. Never hardcode strings directly in JSX.

### Setup

The project uses **react-i18next** with bundled JSON translation files:

| File | Purpose |
|------|---------|
| `app/i18n/index.ts` | i18next initialization (auto-detects language from localStorage / navigator) |
| `app/i18n/locales/en.json` | English translations |
| `app/i18n/locales/fr.json` | French translations |

### How to add translated text

1. **Add keys** to both `en.json` and `fr.json` using nested objects grouped by feature/page:

```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "Some text"
  }
}
```

2. **In React components**, use the `useTranslation` hook:

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t("myFeature.title")}</h1>;
}
```

3. **In `meta()` functions** (outside React context), use the i18n instance directly:

```tsx
import i18n from "~/i18n";

export function meta() {
  const t = i18n.t;
  return [{ title: t("myFeature.title") }];
}
```

4. **For dynamic values**, use i18next interpolation:

```tsx
t("myFeature.cost", { count: 5 })
// en.json: "Cost: {{count}} pts"
```

### Proper names are NOT translated

Names of places, people, gods, creatures, and other proper nouns from the setting (e.g. "Ragnarok", "Odin", "Midgard", "Rune") must remain identical in all language files. They are part of the world's identity, not generic UI text.

### Checklist for any UI change involving text

- [ ] All new user-facing strings have keys in **both** `en.json` and `fr.json`
- [ ] Proper names are kept identical across all locale files
- [ ] Component uses `useTranslation()` hook — no hardcoded strings in JSX
- [ ] Multi-line text uses `\n` in JSON and is split/rendered in the component
- [ ] Translation keys follow the existing nested structure (`page.section.key`)
