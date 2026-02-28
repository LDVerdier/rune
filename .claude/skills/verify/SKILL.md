---
name: verify
description: After finishing the execution of a plan, run the full verification suite: linter, typecheck, and tests. Fix any issues found.
---

Run these three checks sequentially:

1. **Lint** — `npm run lint`
2. **Typecheck** — `npm run typecheck`
3. **Tests** — `npm run test`

For each step:
- Run the command
- If it fails, fix the issues before moving to the next step
- Re-run the command to confirm the fix

4. **Documentation** — Update or create AI-destined documentation files (in `.claude/memory/`) to store any new directives, conventions, or decisions about the project that emerged during the work. This ensures future sessions have the right context. Only write what is stable and confirmed — skip session-specific or speculative notes.

Report a summary at the end with the status of each check and any documentation updates made.
