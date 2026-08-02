# Rune Project Memory

## Theme & UI
See [theme.md](theme.md) for detailed Viking theme documentation.

## Documentation
- `CONTEXT.md` (repo root) is the domain glossary — the rulebook's vocabulary. Use its terms verbatim; update it when a term is settled. It holds no implementation detail.
- `docs/HOW_THIS_WAS_BUILT.md` is the public writeup of the workflow and the design decisions. Keep it truthful: no claim goes in that cannot be verified in the repo or the live app.

## Key Architecture
- React Router v7, React 19, HeroUI v2, Tailwind CSS v4, Framer Motion
- 6 routes: `/`, `/character-creation`, `/login`, `/logout`, `/auth/callback`, `/my-characters`
- Dark mode forced globally (`className="dark"` on `<html>`, `color-scheme: dark` in CSS)
- HeroUI `disableRipple` enabled globally (fixes animation bug, fits theme)
- Font: Inter (sober, no fancy fonts)
