# Project: Rune

## Domain Language
`CONTEXT.md` is the glossary for the *Rune* rulebook's vocabulary. Read it before naming anything in the domain layer, and use its terms verbatim — no synonyms. When a decision settles a term, update it there.

## Tech Stack
- React Router v7, React 19, HeroUI, Tailwind CSS v4, Framer Motion
- TypeScript, ESLint, Vitest + Testing Library

## Architecture
- `app/domain/` — Pure business logic (zero React imports), fully tested
- `app/hooks/` — Thin React adapters wiring state to domain functions
- `app/routes/` — Pure rendering, import hooks + domain
- `app/components/` — Reusable UI components (HeroUI-based)
- `app/i18n/` — Internationalization (en.json, fr.json)
- `app/services/` — Service layer

## Key Files
- `app/routes/character-creation.tsx` — Main feature route (largest file)
- `app/hooks/use-character-creation.ts` — Central state management hook
- `app/domain/character-stats.ts` — Core character stats logic
- `app/app.css` — Theme configuration (Tailwind v4 + HeroUI)

## Design System
HeroUI is the design system foundation. Always use HeroUI components before building custom ones. Only create a custom component when HeroUI genuinely has no equivalent.

## Verification Commands
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Tests: `npm run test`

## Post-Implementation Rule
After finishing any implementation plan, ALWAYS:
1. Run `/simplify` on changed files
2. `npm run lint` — fix any lint errors
3. `npm run typecheck` — fix any type errors
4. `npm run test` — fix any failing tests

## Memory Rule
Whenever you establish a new convention, make an architectural decision, or resolve a design question that should apply to future sessions, immediately write it to `.claude/memory/`. Only record what is stable and confirmed — skip session-specific or speculative notes.
