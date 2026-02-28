# Rune Project Memory

## Theme & UI
See [theme.md](theme.md) for detailed Viking theme documentation.

## Key Architecture
- React Router v7, React 19, HeroUI v2, Tailwind CSS v4, Framer Motion
- 2 routes: `/` (home) and `/character-creation`
- Dark mode forced globally (`className="dark"` on `<html>`, `color-scheme: dark` in CSS)
- HeroUI `disableRipple` enabled globally (fixes animation bug, fits theme)
- Font: Inter (sober, no fancy fonts)
