---
name: plan-executor
description: Execute a reviewed plan phase by phase with progress tracking and error handling. Invoke when the user says to execute, follow, or resume a plan.
---

# Plan Executor

Execute a plan from the **project's** `./.claude/plans/` directory methodically, phase by phase, with progress tracking and intermediate reports.

## When to Use

- The user says to execute, follow, or resume a plan
- The user says "go", "execute", "let's do it" after a plan has been created or reviewed

## Input

If the user specifies a plan file, use that. Otherwise, find the most recent `.md` file in the project's `./.claude/plans/` directory (not the global `~/.claude/plans/`).

## Step 1: Pre-flight

Before executing, check:

1. **Has the plan been reviewed?** Look for a `## Review` section in the plan or ask the user. If not reviewed, run `/plan-reviewer` first.
2. **Read the full plan** to load all phases, steps, and the file inventory into context.
3. **Find the starting point**: the first unchecked phase (`- [ ]`). This enables resuming after interruptions.

## Step 2: Execute Phase by Phase

For each phase:

### Before

- Re-read the phase details and its verification criteria.
- Announce to the user: "Starting Phase N: [Name]"

### During

- Execute each step in the phase.
- If a step produces an unexpected result or error, apply the error protocol (see below).
- Log errors in the plan's "Errors Encountered" table as they happen.

### After

- Update the plan file:
  - Mark the phase checkbox as done: `- [x] Phase N: [Name]`
  - If anything deviated from the plan, add a note below the phase details: `> Deviation: [what changed and why]`
  - Update the Errors table if any errors occurred.
- Run the phase's verification step.
- **Report to the user**: summarize what was done, any deviations, and the verification result.
- **Wait for user confirmation** before proceeding to the next phase. Do not auto-continue.

## Error Protocol

When something fails during execution:

| Strike | Action |
|--------|--------|
| 1 | Diagnose the root cause. Apply a targeted fix. |
| 2 | The first approach did not work. Try a fundamentally different approach. |
| 3 | Question your assumptions. Search for similar issues in the codebase or online. |
| After 3 | Stop. Report all three attempts to the user with full details. Ask for guidance. |

Every error and its resolution (or lack thereof) goes in the plan's "Errors Encountered" table with the attempt number.

## Step 3: Final Verification

After all phases are complete:

1. Run `/verify` (lint, typecheck, tests). Fix any issues.
2. Update the plan: mark all phases as done, add a final status note.
3. Report to the user: summary of everything implemented, any deviations from the original plan, and verification results.

## Resumability

The plan file is the single source of truth for progress. If a session is interrupted:

- Checked phases (`- [x]`) are done.
- Unchecked phases (`- [ ]`) remain.
- The Errors table shows what went wrong and how it was resolved.
- Deviation notes explain any changes from the original plan.

Any new session can read the plan file and resume from the first unchecked phase.

## Continuous Improvement

After completing the full plan, reflect briefly:

- Were any phases harder or easier than expected? Why?
- Were there missing steps that had to be improvised?
- Did the phase boundaries make sense, or should they have been split/merged?
- Was any tool or command hard to find or use?

Share these observations with the user as actionable suggestions. If a suggestion is a stable convention worth remembering, propose writing it to `.claude/memory/`.
