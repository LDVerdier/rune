# How this was built

Rune is a small personal project with an ulterior motive: it is where I stopped writing code by hand and moved to directing coding agents full time. I specced the work, reviewed the output, and corrected it; the agents did the typing. Roughly 15–20 hours of actual work, spread over several sessions, produced something that runs in production with authentication, CI/CD and a versioned database.

This document is about the loop and the judgment calls, because the code itself is the least interesting part.

## The loop

The workflow is committed as skills under [`.claude/skills/`](../.claude/skills/), so it runs the same way every session instead of living in my head:

1. **`planner`** — the agent interrogates me until it can write a plan without guessing, then writes it to `.claude/plans/`. Nothing is implemented at this stage. For the auth feature, exploration came first and landed in its own file: [`findings.md`](../.claude/plans/auth-persistence/findings.md) is a map of the existing codebase — state shape, domain functions available for reuse, what was missing — written before [`task_plan.md`](../.claude/plans/auth-persistence/task_plan.md) proposed anything.
2. **`plan-reviewer`** — the plan is reviewed for coherence and completeness *before* any code exists. Reviewing a plan costs minutes; reviewing seven phases of wrong implementation costs hours.
3. **`plan-executor`** — execution phase by phase, each with its own verification step, so an interrupted session can resume from the first unchecked box.
4. **`verify`** — lint, typecheck, tests. Non-negotiable, and repeated in [`CLAUDE.md`](../CLAUDE.md) so it survives a fresh context.

Review lenses live alongside them — `code-design`, `testing`, `security-review`, `frontend-architecture`, `i18n`, `ux-expert` — each one a checklist I would otherwise have to remember to apply.

This rigor was not there from the first commit. The early work was direct prompting; the ceremony grew as the project got large enough for an agent to lose the thread. The two committed plans both come from the last feature, which is also the one that touched auth, the database and production config at once.

## The guardrails

Process only helps if it cannot be skipped. Three mechanisms enforce it without me:

- **Hooks** ([`.claude/settings.json`](../.claude/settings.json)) — every file an agent writes goes through `eslint --fix` immediately, and any attempt to write to a `.env`, `.pem`, `.key` or `.secret` file is blocked before it happens. An agent cannot leak a credential into the repo by being helpful.
- **CI** — lint, typecheck, test and build run in parallel on every branch, and `main` only deploys if all four pass. The agent's definition of "done" and CI's are the same one.
- **`CONTEXT.md`** — the domain glossary. Agents invent synonyms with great confidence: "stat" for Characteristic, "skill" for Ability, "weight" for Load. A glossary in the repo root is cheaper than correcting the vocabulary in every review.

## Decisions worth explaining

**A rules layer with no React in it.** Everything under [`app/domain/`](../app/domain/) is pure functions — no React import anywhere in the directory. The rules are the hard part of this app and the UI is nearly incidental, so the rules are testable without a renderer: 265 tests run in about two seconds, and almost all of them are plain function calls. The side effect matters more than the speed: when an agent has to change a rule, the blast radius is one pure function and its test file, not a component tree.

**Store choices, never scores.** The `characters` table holds only what the player decided — ranks, chosen equipment, points spent, identity. Not one derived score is persisted. Loading a character runs [`rehydrateCharacter()`](../app/domain/character-rehydration.ts), which recomputes hit points, encumbrance, initiative, attack, defense, damage and the rest from the same functions the builder uses live. Fix a rule and every saved character is correct on next load, with no migration. The trade-off is real and accepted: a saved sheet is not a historical snapshot — it will change if the rules implementation changes.

**Authorization in the database, not the app.** The `characters` table has row-level security enabled with four policies, one per operation, all of them `auth.uid() = user_id`. A missing `WHERE` clause in application code cannot leak another player's characters. This is the one place where I wanted the guarantee to sit below anything an agent might write.

**Supabase.** Auth, Postgres and row-level security in one managed service, with a CLI that dumps the schema into a versioned migration. It was the one tool in the stack I had never used — Postgres and SQL were familiar, the platform was not. Picking it up while directing agents turned out to be a good test of the workflow: I could review generated SQL and RLS policies on their merits without knowing the product's conventions by heart.

## Where the agent was confidently wrong

Two bugs shipped in the auth feature. Both were written by an agent, both looked correct, and both are documented in the fix plan that followed: [`.claude/plans/fix-auth-and-save.md`](../.claude/plans/fix-auth-and-save.md).

**The OAuth redirect.** To send the user back after a Google login, the agent built the redirect target from the incoming request:

```ts
redirectTo: `${new URL(request.url).origin}/auth/callback`
```

Correct-looking, and correct locally. In production, behind Render's reverse proxy, `request.url` is the internal URL — so `origin` resolves to `http://localhost:PORT` and the user finishes a successful Google login on a dead localhost page. It got worse quietly: the half-completed flow had already created an account in Supabase, which then blocked signing up with the same email and password.

This is the class of bug an agent cannot catch. Nothing about the code is wrong; the *deployment topology* is what the code got wrong, and the code is where the agent is looking. It surfaced in production testing, and the fix was to stop inferring the origin at all — an explicit `SITE_URL` environment variable, with the request origin kept only as a local-dev fallback.

**Save, save again, two characters.** `saveCharacter()` always called `.insert()`, and nothing tracked the row id after the first save. Every click of the save button created a new character. The test suite was green throughout, because it covered the rules and not the round trip. The fix was an upsert on the id, which the RLS policies already supported.

The pattern in both: the failures were at the seams — a proxy, a round trip — not inside the logic. That is where I now spend my review attention, and why the two committed plans start with an exploration of what already exists rather than a list of files to write.

## Honest gaps

- **No end-to-end tests.** The 265 tests cover the rules layer well and the integration layer barely. Both bugs above would have been caught by one browser test against a deployed instance.
- **`progress.md` is stale.** The auth plan's phase checkboxes were never ticked, even though the feature shipped. It is left as it was rather than backfilled — a work file, not a deliverable.
- **The rules data is hardcoded.** Weapons, armor and ability tables are TypeScript constants. Fine for one rulebook, a rewrite for two.
