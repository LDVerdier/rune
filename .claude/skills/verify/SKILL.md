---
name: verify
description: After finishing the execution of a plan, run the full verification suite: linter, typecheck, tests. Fix any issues found.
---

# Final verification checklist

Run these three checks sequentially:

1. **Lint** — `npm run lint`
2. **Typecheck** — `npm run typecheck`
3. **Tests** — `npm run test`

Report a summary at the end with the status of each check.

For each step:
- Run the command
- If it fails, fix the issues before moving to the next step
- Re-run the command to confirm the fix
